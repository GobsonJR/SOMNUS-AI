from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+asyncpg://somnus:somnus@localhost:5432/sleepdb"
    mqtt_broker: str = "localhost"
    mqtt_port: int = 1883
    mqtt_username: str | None = None
    mqtt_password: str | None = None
    redis_url: str = "redis://localhost:6379/0"

    model_n2_path: str = "app/models/model_n2.onnx"
    model_stage_path: str = "app/models/model_stage.onnx"
    feature_columns_path: str = "app/models/feature_columns.json"
    model_manifest_path: str = "app/models/model_manifest.json"
    model_min_n2_f1: float = 0.70
    model_min_n2_recall: float = 0.70
    auto_wake_enabled: bool = False

    theta: float = 0.70
    k_consecutive: int = 3
    window_minutes_default: int = 30
    configured_device_id: str = "esp32_01"
    dev_inference_enabled: bool = True
    operator_pin_hash: str = ""
    operator_pin_max_failures: int = 5
    operator_pin_window_seconds: int = 300

    gemini_api_key: str = "AQ.Ab8RN6ISUfxLsv6U2W_gIWzCFyTDl41wSLDif-9uli5OvPPxXQ"
    gemini_model: str = "gemini-1.5-flash"

    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
