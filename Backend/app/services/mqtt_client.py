import json
import logging
import threading
from datetime import datetime, timedelta, timezone
from typing import Any, Callable

import paho.mqtt.client as mqtt
from ulid import ULID

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class MqttService:
    def __init__(self, on_message: Callable[[str, dict[str, Any]], None], *, auto_wake_allowed: bool = False) -> None:
        self._on_message = on_message
        self._client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self._client.on_connect = self._handle_connect
        self._client.on_message = self._handle_message
        self._thread: threading.Thread | None = None
        self._connected = False
        self.auto_wake_allowed = auto_wake_allowed

    def _handle_connect(self, client: mqtt.Client, userdata: Any, flags: Any, reason_code: Any, properties: Any) -> None:
        if reason_code.is_failure:
            logger.error("MQTT connection rejected: %s", reason_code)
            self._connected = False
            return
        self._connected = True
        client.subscribe("somnus/v1/devices/+/telemetry/rr-epoch", qos=1)
        client.subscribe("somnus/v1/devices/+/events/alarm", qos=1)
        client.subscribe("somnus/v1/devices/+/status", qos=1)
        client.subscribe("somnus/v1/devices/+/errors", qos=1)
        logger.info("MQTT connected, subscribed to device topics")

    def _handle_message(self, client: mqtt.Client, userdata: Any, msg: mqtt.MQTTMessage) -> None:
        try:
            payload = json.loads(msg.payload.decode("utf-8"))
            self._on_message(msg.topic, payload)
        except Exception as exc:
            logger.exception("Failed to process MQTT message on %s: %s", msg.topic, exc)

    def start(self) -> None:
        if settings.mqtt_username:
            self._client.username_pw_set(settings.mqtt_username, settings.mqtt_password)
        # A missing broker must not stop the API from starting. Paho reconnects in
        # the background; readiness remains false until the broker is reachable.
        self._client.reconnect_delay_set(min_delay=1, max_delay=30)
        self._client.connect_async(settings.mqtt_broker, settings.mqtt_port, keepalive=60)
        self._client.loop_start()

    def stop(self) -> None:
        self._connected = False
        self._client.loop_stop()
        self._client.disconnect()

    @property
    def is_connected(self) -> bool:
        return self._connected

    def build_alarm(
        self,
        device_id: str,
        reason: str,
        wake_event_id: str | None = None,
        alarm_duration_s: int = 10,
    ) -> tuple[str, dict[str, Any]]:
        event_id = wake_event_id or str(ULID())
        now = datetime.now(timezone.utc)
        payload = {
            "protocol_version": "1.0",
            "message_id": str(ULID()),
            "device_id": device_id,
            "sent_at": now.isoformat().replace("+00:00", "Z"),
            "command": "WAKE",
            "wake_event_id": event_id,
            "reason": reason,
            "expires_at": (now + timedelta(minutes=2)).isoformat().replace("+00:00", "Z"),
            "alarm_duration_s": alarm_duration_s,
        }
        return event_id, payload

    def publish_alarm(self, device_id: str, payload: dict[str, Any]) -> bool:
        topic = f"somnus/v1/devices/{device_id}/commands/alarm"
        result = self._client.publish(topic, json.dumps(payload), qos=1, retain=False)
        return result.rc == mqtt.MQTT_ERR_SUCCESS
