"""Small in-process PIN guard for the single-instance LAN demonstration."""

from __future__ import annotations

import hashlib
import hmac
import time
from collections import deque

from fastapi import Header, HTTPException, status

from app.config import get_settings


class OperatorPinGuard:
    def __init__(self) -> None:
        self._failed_attempts: deque[float] = deque()

    def verify(self, pin: str | None) -> None:
        settings = get_settings()
        now = time.monotonic()
        while self._failed_attempts and now - self._failed_attempts[0] > settings.operator_pin_window_seconds:
            self._failed_attempts.popleft()
        if len(self._failed_attempts) >= settings.operator_pin_max_failures:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many invalid PIN attempts")
        expected = settings.operator_pin_hash.strip().lower()
        candidate = hashlib.sha256((pin or "").encode("utf-8")).hexdigest()
        if not expected or not hmac.compare_digest(candidate, expected):
            self._failed_attempts.append(now)
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="A valid operator PIN is required")
        self._failed_attempts.clear()


operator_pin_guard = OperatorPinGuard()


def require_operator_pin(x_operator_pin: str | None = Header(default=None)) -> None:
    operator_pin_guard.verify(x_operator_pin)
