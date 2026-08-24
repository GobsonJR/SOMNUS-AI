"""MQTT and HTTP ingestion pipeline for RR epoch telemetry."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from pydantic import ValidationError

from app.core.feature_engine import extract_features
from app.core.predictor import Predictor
from app.core.protocol import RrEpochMessage, topic_device_id
from app.core.smart_wake import SmartWakeEngine
from app.db import crud
from app.db.session import async_session_factory
from app.services.mqtt_client import MqttService
from app.services.redis_client import RedisClient
from app.services.websocket_manager import WebSocketManager

logger = logging.getLogger(__name__)


class Ingestor:
    def __init__(
        self,
        predictor: Predictor,
        smart_wake: SmartWakeEngine,
        ws_manager: WebSocketManager,
        redis_client: RedisClient,
        mqtt_service: MqttService,
        *,
        theta: float,
        k_consecutive: int,
        inference_enabled: bool,
    ) -> None:
        self.predictor = predictor
        self.smart_wake = smart_wake
        self.ws_manager = ws_manager
        self.redis = redis_client
        self.mqtt = mqtt_service
        self.theta = theta
        self.k_consecutive = k_consecutive
        self.inference_enabled = inference_enabled

    async def handle_mqtt_message(self, topic: str, payload: dict[str, Any]) -> None:
        if topic.endswith("/telemetry/rr-epoch"):
            await self._handle_rr_epoch(topic, payload)
        elif topic.endswith("/events/alarm"):
            await self._handle_alarm_event(payload)
        elif topic.endswith("/status"):
            await self._handle_status(payload)

    async def ingest_http_epoch(self, device_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        if payload.get("device_id") and payload["device_id"] != device_id:
            return {"accepted": False, "error": "device_id mismatch"}
        payload = {**payload, "device_id": device_id}
        return await self._handle_rr_epoch(f"somnus/v1/devices/{device_id}/telemetry/rr-epoch", payload, http=True)

    async def _handle_rr_epoch(
        self,
        topic: str,
        payload: dict[str, Any],
        *,
        http: bool = False,
    ) -> dict[str, Any]:
        try:
            message = RrEpochMessage.model_validate(payload)
        except ValidationError as exc:
            logger.warning("Rejected invalid RR epoch: %s", exc.errors())
            return {"accepted": False, "error": "invalid_payload", "details": exc.errors()}

        device_id = message.device_id
        message_id = message.message_id
        if not http and topic_device_id(topic) != device_id:
            logger.warning("Rejected RR epoch with topic/device mismatch")
            return {"accepted": False, "error": "topic_device_mismatch"}

        async with async_session_factory() as session:
            if await crud.epoch_exists(session, device_id, message_id):
                return {"accepted": True, "duplicate": True, "device_id": device_id}

            epoch_started_at = self._parse_ts(message.epoch_started_at)
            rr_intervals = message.rr_intervals_ms
            lead_off = message.lead_off
            has_rr = len(rr_intervals) >= 2
            inference_eligible = not lead_off and has_rr
            usable = inference_eligible and message.clock_synced

            epoch = await crud.create_epoch(
                session,
                device_id=device_id,
                message_id=message_id,
                epoch_started_at=epoch_started_at,
                sequence=message.sequence,
                rr_intervals_ms=rr_intervals,
                lead_off=lead_off,
                battery_pct=message.battery_pct,
                signal_quality=message.signal_quality.model_dump() if message.signal_quality else None,
                usable=usable,
            )

            await crud.upsert_device_status(
                session,
                device_id,
                state="LEAD_OFF" if lead_off else "ONLINE",
                battery_pct=message.battery_pct,
            )

            if lead_off:
                await self._broadcast_skip(device_id, epoch_started_at, "lead_off")
                return {
                    "accepted": True,
                    "device_id": device_id,
                    "epoch_id": str(epoch.id),
                    "inference": "skipped",
                    "reason": "lead_off",
                }

            if not has_rr:
                await self._broadcast_skip(device_id, epoch_started_at, "insufficient_rr")
                return {
                    "accepted": True,
                    "device_id": device_id,
                    "epoch_id": str(epoch.id),
                    "inference": "skipped",
                    "reason": "insufficient_rr",
                }

            features = extract_features(rr_intervals)
            if features is None:
                await self._broadcast_skip(device_id, epoch_started_at, "feature_extraction_failed")
                return {
                    "accepted": True,
                    "device_id": device_id,
                    "epoch_id": str(epoch.id),
                    "inference": "skipped",
                    "reason": "feature_extraction_failed",
                }

            if not self.inference_enabled or not self.predictor.is_ready:
                await self.ws_manager.broadcast(
                    device_id,
                    {
                        "type": "STAGE_UPDATE",
                        "device_id": device_id,
                        "timestamp": epoch_started_at.isoformat(),
                        "stage": "MODEL_NOT_READY",
                        "n2_probability": None,
                        "features": features,
                        "skipped": True,
                        "reason": "onnx_models_missing",
                    },
                )
                return {
                    "accepted": True,
                    "device_id": device_id,
                    "epoch_id": str(epoch.id),
                    "features": features,
                    "inference": "skipped",
                    "reason": "onnx_models_missing",
                }

            prediction = self.predictor.predict(features)
            n2_prob = float(prediction["n2_probability"])
            stage = str(prediction["stage"])
            is_n2 = n2_prob >= self.theta

            await crud.update_epoch_inference(
                session,
                epoch.id,
                features=features,
                n2_probability=n2_prob,
                stage=stage,
            )

            config = await crud.get_alarm_config(session, device_id)
            flags = await self.redis.push_n2_flag(device_id, is_n2, self.k_consecutive)

            await self.ws_manager.broadcast(
                device_id,
                {
                    "type": "STAGE_UPDATE",
                    "device_id": device_id,
                    "timestamp": epoch_started_at.isoformat(),
                    "stage": stage,
                    "n2_probability": n2_prob,
                    "is_n2": is_n2,
                    "features": features,
                    "epoch_id": str(epoch.id),
                },
            )

            wake_result: dict[str, Any] | None = None
            if message.clock_synced and config and config.enabled:
                decision = self.smart_wake.evaluate(
                    device_id,
                    n2_prob,
                    epoch_started_at,
                    enabled=True,
                    window_start=config.window_start,
                    wake_time=config.wake_time,
                    flags=flags,
                )
                if decision.should_wake and decision.reason and self.mqtt.auto_wake_allowed:
                    wake_event_id, command = self.mqtt.build_alarm(device_id, decision.reason)
                    event = await crud.create_wake_event(
                        session,
                        wake_event_id,
                        device_id,
                        decision.reason,
                        self.smart_wake.wake_window_key(epoch_started_at, config.wake_time),
                        self._parse_ts(command["expires_at"]),
                        status="PUBLISHED",
                    )
                    if event and self.mqtt.publish_alarm(device_id, command):
                        await self.ws_manager.broadcast(
                            device_id,
                            {
                                "type": "ALARM_TRIGGER",
                                "device_id": device_id,
                                "timestamp": datetime.now(timezone.utc).isoformat(),
                                "reason": decision.reason,
                                "wake_event_id": wake_event_id,
                            },
                        )
                        wake_result = {"triggered": True, "reason": decision.reason, "wake_event_id": wake_event_id}

            return {
                "accepted": True,
                "device_id": device_id,
                "epoch_id": str(epoch.id),
                "stage": stage,
                "n2_probability": n2_prob,
                "is_n2": is_n2,
                "features": features,
                "rr_count": len(rr_intervals),
                "clock_synced": message.clock_synced,
                "wake": wake_result,
            }

    async def _broadcast_skip(self, device_id: str, epoch_started_at: datetime, reason: str) -> None:
        await self.ws_manager.broadcast(
            device_id,
            {
                "type": "STAGE_UPDATE",
                "device_id": device_id,
                "timestamp": epoch_started_at.isoformat(),
                "stage": "UNKNOWN",
                "n2_probability": 0.0,
                "features": {},
                "skipped": True,
                "reason": reason,
            },
        )

    async def _handle_alarm_event(self, payload: dict[str, Any]) -> None:
        wake_event_id = payload.get("wake_event_id")
        if not wake_event_id:
            return
        async with async_session_factory() as session:
            event = payload.get("event")
            if event == "ALARM_STARTED":
                await crud.mark_wake_delivered(session, wake_event_id)
            elif event in {"ALARM_FAILED", "COMMAND_REJECTED"}:
                await crud.mark_wake_failed(session, wake_event_id, event)
            else:
                return
        await self.ws_manager.broadcast(
            device_id=payload.get("device_id", ""),
            message={
                "type": "ALARM_STATUS",
                "wake_event_id": wake_event_id,
                "status": event,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

    async def _handle_status(self, payload: dict[str, Any]) -> None:
        device_id = payload.get("device_id")
        if not device_id:
            return
        async with async_session_factory() as session:
            await crud.upsert_device_status(
                session,
                device_id,
                state=payload.get("state", "ONLINE"),
                firmware_version=payload.get("firmware_version"),
                wifi_rssi_dbm=payload.get("wifi_rssi_dbm"),
                battery_pct=payload.get("battery_pct"),
            )
        await self.ws_manager.broadcast(
            device_id,
            {
                "type": "CONNECTION_STATUS",
                "device_id": device_id,
                "state": payload.get("state", "ONLINE"),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

    @staticmethod
    def _parse_ts(value: Any) -> datetime:
        if isinstance(value, datetime):
            return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
        if isinstance(value, (int, float)):
            return datetime.fromtimestamp(value, tz=timezone.utc)
        if isinstance(value, str):
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        return datetime.now(timezone.utc)
