# Somnus MQTT Protocol

## 1. Scope and design decisions

This protocol connects an ESP32 ECG device to the Somnus backend through an MQTT broker.

- Protocol version: `1.0`
- Payload encoding: UTF-8 JSON
- Telemetry cadence: one closed, non-overlapping 30-second epoch
- Broker is transport only: the backend is the source of truth for inference, wake state, and persistence.
- The device sends RR intervals, not raw ECG. This matches the ESP32 processing path and keeps bandwidth and privacy exposure low.
- MQTT over TLS is required outside a trusted local development network.

All timestamps are UTC ISO-8601 strings with a `Z` suffix. Epoch timestamps identify the start of the measured interval.

## 2. Topic namespace

```text
somnus/v1/devices/{device_id}/telemetry/rr-epoch
somnus/v1/devices/{device_id}/commands/alarm
somnus/v1/devices/{device_id}/events/alarm
somnus/v1/devices/{device_id}/status
somnus/v1/devices/{device_id}/errors
```

`device_id` must match `^[a-zA-Z0-9_-]{1,64}$`. A device may publish only to its own telemetry, status, event, and error topics; it may subscribe only to its own command topic. The backend subscribes to all device topics.

| Topic | Publisher | Subscriber | QoS | Retained |
|---|---|---|---:|---:|
| `telemetry/rr-epoch` | ESP32 | backend | 1 | no |
| `commands/alarm` | backend | ESP32 | 1 | no |
| `events/alarm` | ESP32 | backend | 1 | no |
| `status` | ESP32 | backend/dashboard bridge | 1 | yes |
| `errors` | ESP32 or backend | backend/observability | 1 | no |

Alarm commands must never be retained. A retained `WAKE` could alarm a device after it reconnects.

## 3. Common envelope

Every payload contains these fields in addition to its message-specific data.

```json
{
  "protocol_version": "1.0",
  "message_id": "01J4W1S49TQY60CSY4D7K3BJT6",
  "device_id": "esp32_01",
  "sent_at": "2026-08-21T06:30:30Z"
}
```

- `message_id` is a device-unique ULID or UUID. It supports idempotent ingestion and command/event correlation.
- `sent_at` is when the payload was assembled; it is not the measurement timestamp.
- Unknown fields must be ignored for forward compatibility. Unknown major protocol versions must be rejected.

## 4. RR epoch telemetry

Topic: `somnus/v1/devices/{device_id}/telemetry/rr-epoch`

```json
{
  "protocol_version": "1.0",
  "message_id": "01J4W1S49TQY60CSY4D7K3BJT6",
  "device_id": "esp32_01",
  "sent_at": "2026-08-21T06:30:30Z",
  "epoch_started_at": "2026-08-21T06:30:00Z",
  "epoch_duration_ms": 30000,
  "sequence": 1242,
  "rr_intervals_ms": [912, 905, 921, 898, 915, 902],
  "r_peak_amplitudes_mv": [1.21, 1.18, 1.22, 1.15, 1.19, 1.17],
  "sampling_rate_hz": 250,
  "lead_off": false,
  "battery_pct": 84,
  "signal_quality": {
    "accepted_beats": 36,
    "rejected_candidates": 2
  }
}
```

### Required validation

| Field | Rule |
|---|---|
| `epoch_duration_ms` | exactly `30000` for v1 |
| `sequence` | non-negative and monotonically increasing per device; gaps are allowed |
| `rr_intervals_ms` | array of 2–80 finite integer values, each 250–2500 ms |
| `r_peak_amplitudes_mv` | optional; if supplied, same length as RR values |
| `sampling_rate_hz` | 250 for current firmware |
| `battery_pct` | integer 0–100 |
| `signal_quality.accepted_beats` | non-negative integer |

The backend must deduplicate by `(device_id, message_id)`. It may flag a sequence regression or overlapping epoch as an integrity warning, but must not overwrite a previously accepted epoch.

If `lead_off` is true, the backend persists the epoch/status for observability but must not run inference or advance the consecutive-N2 counter.

## 5. Alarm command

Topic: `somnus/v1/devices/{device_id}/commands/alarm`

```json
{
  "protocol_version": "1.0",
  "message_id": "01J4W3D96WD68JAX2D4PFFQ5QK",
  "device_id": "esp32_01",
  "sent_at": "2026-08-21T06:31:30Z",
  "command": "WAKE",
  "wake_event_id": "01J4W3D8S4KHS1YVZV3A14Z4M2",
  "reason": "N2_CONFIRMED",
  "expires_at": "2026-08-21T06:33:30Z",
  "alarm_duration_s": 10
}
```

Allowed values:

- `command`: `WAKE`, `STOP`
- `reason` for `WAKE`: `N2_CONFIRMED`, `FORCE_WAKE`, `MANUAL_TEST`
- `alarm_duration_s`: 1–60, default 10

The device must reject a command whose `device_id` does not match its configured identity, whose `expires_at` is in the past, or whose protocol version is unsupported. It must treat a repeated `wake_event_id` as idempotent: do not restart the alarm, but publish the prior/current event state again.

## 6. Alarm event acknowledgement

The broker QoS acknowledgement confirms delivery to the ESP32 MQTT client, not that the user was alerted. The device publishes an application-level event for the backend to record the outcome.

Topic: `somnus/v1/devices/{device_id}/events/alarm`

```json
{
  "protocol_version": "1.0",
  "message_id": "01J4W3E69M8BKE8FQV0Y5C2N4A",
  "device_id": "esp32_01",
  "sent_at": "2026-08-21T06:31:31Z",
  "wake_event_id": "01J4W3D8S4KHS1YVZV3A14Z4M2",
  "event": "ALARM_STARTED",
  "reason": "N2_CONFIRMED"
}
```

Events are `ALARM_STARTED`, `ALARM_STOPPED`, `COMMAND_REJECTED`, or `ALARM_FAILED`. The backend marks a wake event as delivered only after `ALARM_STARTED`; it marks it failed if the event is not received before the command expiry plus a 30-second grace period.

## 7. Device status and errors

The ESP32 publishes its status on boot, after reconnecting, and whenever its state changes. It sets an MQTT last-will message on the same topic:

```json
{
  "protocol_version": "1.0",
  "message_id": "01J4W1T7HQY15JZ9AR6YTZZZEP",
  "device_id": "esp32_01",
  "sent_at": "2026-08-21T06:31:00Z",
  "state": "ONLINE",
  "firmware_version": "0.1.0",
  "wifi_rssi_dbm": -57,
  "battery_pct": 84
}
```

`state` is `ONLINE`, `OFFLINE`, `DEGRADED`, or `LEAD_OFF`. The broker last will uses `OFFLINE`, QoS 1, and retained `true`.

Errors use the error topic and contain `code`, `message`, and optional `related_message_id`. Stable v1 codes are `INVALID_PAYLOAD`, `CLOCK_UNSYNCED`, `LEAD_OFF`, `LOW_BATTERY`, `ALARM_ACTUATOR_FAILURE`, and `UNSUPPORTED_COMMAND`.

## 8. Connection, buffering, and retry rules

1. The firmware connects with a persistent MQTT session and the configured last-will status.
2. It reconnects with exponential backoff: 1, 2, 4, 8, 16, then 30 seconds maximum, with small random jitter.
3. Telemetry is published at QoS 1. While offline, the device retains up to 10 complete epochs in a FIFO queue. On reconnect, it publishes oldest first. On overflow, it drops the oldest epoch and emits `TELEMETRY_BUFFER_OVERFLOW` on the next successful connection.
4. The ESP32 should synchronize time with NTP at boot and periodically. Until time is synchronized, it may publish telemetry with `clock_synced: false`; the backend records it but must not use it to make deadline-based wake decisions.
5. The backend must be idempotent because QoS 1 permits duplicate delivery.
6. The backend should issue at most one active `WAKE` command per `wake_event_id`. If no `ALARM_STARTED` event arrives, retry the same command and same identifiers once before recording a failure. Do not create a second wake event.

## 9. Backend processing contract

For each accepted, usable epoch the backend performs this order:

```text
validate → deduplicate → persist raw epoch → clean RR → extract features
→ infer N2 probability/stage → persist result → evaluate smart wake
→ publish alarm command if triggered → broadcast WebSocket update
```

Malformed payloads, lead-off epochs, insufficient RR data, and low signal-quality epochs must be visible in persistence and the dashboard. They must not silently become a Non-N2 prediction, because that would incorrectly disturb the state machine.

## 10. Security and operational requirements

- Per-device credentials must be unique; never embed a shared production password in firmware source.
- Production broker access must require TLS plus topic ACLs.
- Message payloads must contain no direct personal identifiers; device-to-user mapping remains in the backend database.
- Persist raw RR telemetry and alarm events before asynchronous dashboard broadcasting so reconnecting clients can recover a consistent history.
- Log only IDs and diagnostic metadata; do not log complete RR arrays at info level in production.
