param(
  [Parameter(Mandatory = $true)][string]$DevicePassword,
  [Parameter(Mandatory = $true)][string]$BackendPassword
)

$target = Join-Path $PSScriptRoot "..\mosquitto\passwordfile"
docker run --rm -v "$(Resolve-Path (Join-Path $PSScriptRoot '..\mosquitto')):/mosquitto/config" eclipse-mosquitto:2 `
  sh -c "mosquitto_passwd -b -c /mosquitto/config/passwordfile esp32_01 '$DevicePassword' && mosquitto_passwd -b /mosquitto/config/passwordfile somnus_backend '$BackendPassword'"
Write-Host "Created $target. Keep it private."
