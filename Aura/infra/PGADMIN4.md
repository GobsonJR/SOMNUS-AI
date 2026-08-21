# pgAdmin 4 connection

pgAdmin is a database administration client. Somnus stores real ESP32 epochs in the PostgreSQL/TimescaleDB container; use pgAdmin to inspect that database after the stack is running.

## Connect

Create a server registration in pgAdmin 4:

| Field | Value |
|---|---|
| Host name/address | `localhost` |
| Port | `5432` |
| Maintenance database | value of `POSTGRES_DB` (normally `sleepdb`) |
| Username | value of `POSTGRES_USER` |
| Password | value of `POSTGRES_PASSWORD` |

The production stack binds PostgreSQL only to `127.0.0.1:5432`, so pgAdmin can connect from this host while the database remains unavailable to other LAN devices.

## Confirm incoming ESP32 data

After the ESP32 is connected and has emitted one 30-second epoch, execute:

```sql
SELECT device_id, epoch_started_at, sequence, lead_off, usable,
       battery_pct, n2_probability, stage
FROM epochs
ORDER BY epoch_started_at DESC
LIMIT 20;
```

Alarm command outcomes are stored in `wake_events`; current hardware connectivity is stored in `device_status`.
