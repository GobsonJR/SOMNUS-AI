from datetime import datetime, time, timezone

from app.core.smart_wake import SmartWakeEngine


def test_n2_confirmed_after_three_epochs():
    engine = SmartWakeEngine(theta=0.70, k_consecutive=3)
    epoch = datetime(2026, 8, 20, 6, 45, tzinfo=timezone.utc)
    decision = engine.evaluate(
        "dev1", 0.90, epoch, enabled=True, window_start=time(6, 30), wake_time=time(7, 0), flags=[True, True, True]
    )
    assert decision.should_wake
    assert decision.reason == "N2_CONFIRMED"


def test_n2_not_confirmed_after_gap():
    engine = SmartWakeEngine(theta=0.70, k_consecutive=3)
    epoch = datetime(2026, 8, 20, 6, 45, tzinfo=timezone.utc)
    decision = engine.evaluate(
        "dev1", 0.90, epoch, enabled=True, window_start=time(6, 30), wake_time=time(7, 0), flags=[True, False, True]
    )
    assert not decision.should_wake


def test_forces_wake_after_deadline():
    engine = SmartWakeEngine(theta=0.70, k_consecutive=3)
    epoch = datetime(2026, 8, 20, 7, 1, tzinfo=timezone.utc)
    decision = engine.evaluate(
        "dev1", 0.10, epoch, enabled=True, window_start=time(6, 30), wake_time=time(7, 0), flags=[False, False, False]
    )
    assert decision.should_wake
    assert decision.reason == "FORCE_WAKE"
