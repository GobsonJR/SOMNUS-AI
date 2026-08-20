"""Smart wake logic: consecutive N2 detection inside wake window."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, time, timedelta, timezone


@dataclass
class WakeDecision:
    should_wake: bool
    reason: str | None = None


def _to_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def _time_in_window(now: time, window_start: time, wake_time: time) -> bool:
    if window_start <= wake_time:
        return window_start <= now <= wake_time
    return now >= window_start or now <= wake_time


class SmartWakeEngine:
    def __init__(self, theta: float = 0.70, k_consecutive: int = 3) -> None:
        self.theta = theta
        self.k_consecutive = k_consecutive
    def evaluate(
        self,
        device_id: str,
        n2_probability: float,
        epoch_time: datetime,
        *,
        enabled: bool,
        window_start: time,
        wake_time: time,
        flags: list[bool],
    ) -> WakeDecision:
        if not enabled:
            return WakeDecision(should_wake=False)

        now = _to_utc(epoch_time)
        current_time = now.time().replace(microsecond=0)

        in_window = _time_in_window(current_time, window_start, wake_time)
        n2_confirmed = len(flags) >= self.k_consecutive and all(flags[-self.k_consecutive:])

        if n2_confirmed and in_window:
            return WakeDecision(should_wake=True, reason="N2_CONFIRMED")

        deadline = datetime.combine(now.date(), wake_time, tzinfo=timezone.utc)
        if current_time > wake_time and now >= deadline:
            return WakeDecision(should_wake=True, reason="FORCE_WAKE")

        return WakeDecision(should_wake=False)

    @staticmethod
    def wake_window_key(epoch_time: datetime, wake_time: time) -> str:
        now = _to_utc(epoch_time)
        return f"{now.date().isoformat()}-{wake_time.isoformat()}"
