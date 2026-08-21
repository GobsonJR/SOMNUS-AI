# LAN demonstration deployment

1. Reserve a DHCP lease or assign a static IP to the Docker host. Put that address in `SOMNUS_LAN_HOST`.
2. Copy `.env.production.example` to `.env.production`. Generate `OPERATOR_PIN_HASH` with `Get-FileHash` over the exact PIN text using SHA-256, then set distinct strong database, Redis, device MQTT, and backend MQTT secrets.
3. Generate the Mosquitto password file:

   ```powershell
   ./infra/scripts/create-mqtt-passwordfile.ps1 -DevicePassword '<device-secret>' -BackendPassword '<backend-secret>'
   ```

4. Copy `firmware/include/secrets.example.h` to `firmware/include/secrets.h`, use the host LAN address, and set the same device MQTT credentials. Flash the ESP32.
5. Place validated `model_n2.onnx`, `model_stage.onnx`, `feature_columns.json`, and `model_manifest.json` in `backend/app/models/`. Auto-wake remains disabled until manifest validation passes.
6. Allow inbound TCP 80 and 1883 in Windows Defender Firewall only on the private profile. Do not expose this stack to the internet.
7. Start the stack with:

   ```powershell
   docker compose --env-file .env.production -f docker-compose.production.yml up --build -d
   ```

8. Open `http://<SOMNUS_LAN_HOST>/`. The dashboard is read-only until an operator enters the shared PIN to change alarms or issue a test wake.

Use `docker compose --env-file .env.production -f docker-compose.production.yml logs -f backend` during the rehearsal. A readiness response with `model_approved: false` is expected until real model artifacts have been installed.

Use [PGADMIN4.md](PGADMIN4.md) to connect pgAdmin 4 to the same PostgreSQL container and verify actual ESP32 epochs are being persisted.
