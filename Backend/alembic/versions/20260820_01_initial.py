"""Create Somnus persistence schema and the epochs hypertable."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260820_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "epochs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("device_id", sa.String(length=64), nullable=False),
        sa.Column("message_id", sa.String(length=64), nullable=False),
        sa.Column("epoch_started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("sequence", sa.Integer(), nullable=False),
        sa.Column("rr_intervals_ms", postgresql.JSONB(), nullable=False),
        sa.Column("lead_off", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("battery_pct", sa.Integer(), nullable=True),
        sa.Column("signal_quality", postgresql.JSONB(), nullable=True),
        sa.Column("features", postgresql.JSONB(), nullable=True),
        sa.Column("n2_probability", sa.Float(), nullable=True),
        sa.Column("stage", sa.String(length=16), nullable=True),
        sa.Column("usable", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id", "epoch_started_at"),
        sa.UniqueConstraint("device_id", "message_id", "epoch_started_at", name="uq_epoch_device_message_time"),
    )
    op.create_index("ix_epochs_device_started", "epochs", ["device_id", "epoch_started_at"])
    op.execute("SELECT create_hypertable('epochs', 'epoch_started_at', if_not_exists => TRUE, migrate_data => TRUE)")

    op.create_table(
        "alarm_configs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("device_id", sa.String(length=64), nullable=False),
        sa.Column("wake_time", sa.Time(), nullable=False),
        sa.Column("window_start", sa.Time(), nullable=False),
        sa.Column("window_minutes", sa.Integer(), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("device_id"),
    )
    op.create_index("ix_alarm_configs_device_id", "alarm_configs", ["device_id"])

    op.create_table(
        "wake_events",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("device_id", sa.String(length=64), nullable=False),
        sa.Column("reason", sa.String(length=32), nullable=False),
        sa.Column("wake_window_key", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=24), nullable=False, server_default="PUBLISHED"),
        sa.Column("triggered_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("delivered", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("alarm_started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("command_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("device_id", "wake_window_key", name="uq_wake_event_device_window"),
    )
    op.create_index("ix_wake_events_device_id", "wake_events", ["device_id"])

    op.create_table(
        "device_status",
        sa.Column("device_id", sa.String(length=64), nullable=False),
        sa.Column("state", sa.String(length=16), nullable=False, server_default="OFFLINE"),
        sa.Column("firmware_version", sa.String(length=32), nullable=True),
        sa.Column("wifi_rssi_dbm", sa.Integer(), nullable=True),
        sa.Column("battery_pct", sa.Integer(), nullable=True),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("device_id"),
    )


def downgrade() -> None:
    op.drop_table("device_status")
    op.drop_index("ix_wake_events_device_id", table_name="wake_events")
    op.drop_table("wake_events")
    op.drop_index("ix_alarm_configs_device_id", table_name="alarm_configs")
    op.drop_table("alarm_configs")
    op.execute("DROP TABLE epochs")
