#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <RTClib.h>

#define EEG_PIN 34
#define BUZZER_PIN 23

#define SDA_PIN 21
#define SCL_PIN 22

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// Alarm window settings
const int ALARM_START_HOUR = 6;   // 6:00 AM
const int ALARM_START_MIN = 0;
const int ALARM_END_HOUR = 7;     // 7:00 AM
const int ALARM_END_MIN = 0;

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
RTC_DS1307 rtc;

bool alarmTriggered = false;  // So it only beeps once per morning

void setup() {
  Serial.begin(115200);
  pinMode(EEG_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Wire.begin(SDA_PIN, SCL_PIN);

  // Start OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED not found");
    while (1);
  }

  // Start RTC
  if (!rtc.begin()) {
    Serial.println("RTC not found");
    while (1);
  }

  // Set a fake time for Wokwi simulation so we can test the alarm!
  // Comment this out when using real hardware with a battery-backed RTC
  rtc.adjust(DateTime(2024, 1, 1, 5, 55, 0)); // Jan 1, 2024, 5:55 AM (5 mins before alarm window)

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(10, 5);
  display.println("SMART EEG ALARM");
  display.setCursor(0, 25);
  display.println("System Ready...");
  display.display();
  delay(2000);
}

void loop() {
  // ----- 1. READ EEG (potentiometer pretending to be brain waves) -----
  int eegValue = analogRead(EEG_PIN);
  float voltage = eegValue * 3.3 / 4095.0;

  // ----- 2. CLASSIFY SLEEP STAGE (simulating frequency band logic) -----
  // In the real project, this will come from FFT of EEG signal:
  // Delta (0.5-4Hz) dominant  -> Deep Sleep
  // Theta (4-8Hz) dominant   -> Light Sleep
  // Alpha (8-13Hz)           -> Awake/Relaxed
  // Beta  (13-30Hz)          -> Active wake/REM
  
  String stage;
  if (eegValue < 1200) {
    stage = "N3 Deep";
  } else if (eegValue < 2400) {
    stage = "N2 Light";  // <-- TARGET: Wake them here!
  } else if (eegValue < 3300) {
    stage = "REM";
  } else {
    stage = "Awake";
  }

  // ----- 3. GET REAL TIME FROM RTC -----
  DateTime now = rtc.now();
  int currentHour = now.hour();
  int currentMin = now.minute();
  int currentSec = now.second();

  // ----- 4. CHECK IF WE ARE IN THE ALARM WINDOW (6:00 - 7:00 AM) -----
  bool inAlarmWindow = isTimeInWindow(currentHour, currentMin, ALARM_START_HOUR, ALARM_START_MIN, ALARM_END_HOUR, ALARM_END_MIN);

  // ----- 5. SMART ALARM DECISION -----
  String alarmStatus = "Idle";
  bool shouldBeep = false;

  if (inAlarmWindow) {
    if (stage == "N2 Light" && !alarmTriggered) {
      alarmStatus = "WAKING UP!";
      shouldBeep = true;
      alarmTriggered = true;  // Lock it so it doesn't beep continuously
    } else if (alarmTriggered) {
      alarmStatus = "Done";
    } else if (stage == "N3 Deep") {
      alarmStatus = "Monitor Deep";  // Waiting for you to come up to light sleep
    } else {
      alarmStatus = "Monitor " + stage;
    }
  } else {
    // Outside 6-7 AM window
    alarmStatus = "Wait " + String(ALARM_START_HOUR) + ":00";
    alarmTriggered = false;  // Reset for tomorrow
    noTone(BUZZER_PIN);
  }

  if (shouldBeep) {
    triggerAlarm();
  }

  // ----- 6. DISPLAY ON OLED -----
  display.clearDisplay();

  // Title
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("SMART EEG ALARM");

  // Time (big)
  display.setTextSize(2);
  display.setCursor(0, 10);
  if (currentHour < 10) display.print("0");
  display.print(currentHour);
  display.print(":");
  if (currentMin < 10) display.print("0");
  display.print(currentMin);

  // Alarm window indicator
  display.setTextSize(1);
  display.setCursor(70, 10);
  if (inAlarmWindow) {
    display.print("WIN:ON");
  } else {
    display.print("WIN:OFF");
  }

  // EEG Value & Stage
  display.setCursor(0, 30);
  display.print("EEG:");
  display.print(eegValue);

  display.setCursor(70, 30);
  display.print(stage);

  // Alarm Status
  display.setCursor(0, 42);
  display.print("Alarm: ");
  display.print(alarmStatus);

  // Band simulation info
  display.setCursor(0, 54);
  if (stage == "N3 Deep") display.print("Bands: D++ T+ A- B-");
  else if (stage == "N2 Light") display.print("Bands: D+ T++ A+ B-");
  else if (stage == "REM") display.print("Bands: D- T++ A+ B+");
  else display.print("Bands: D- T- A++ B++");

  display.display();

  // ----- 7. PRINT TO SERIAL MONITOR -----
  Serial.print("Time: ");
  if (currentHour < 10) Serial.print("0");
  Serial.print(currentHour);
  Serial.print(":");
  if (currentMin < 10) Serial.print("0");
  Serial.print(currentMin);
  Serial.print(":");
  if (currentSec < 10) Serial.print("0");
  Serial.print(currentSec);

  Serial.print(" | EEG: ");
  Serial.print(eegValue);
  Serial.print(" | Stage: ");
  Serial.print(stage);
  Serial.print(" | Window: ");
  Serial.print(inAlarmWindow ? "YES" : "NO");
  Serial.print(" | Alarm: ");
  Serial.println(alarmStatus);

  delay(500); // Update twice per second so you can see it
}

// ----- Helper: Check if current time is between start and end -----
bool isTimeInWindow(int currH, int currM, int startH, int startM, int endH, int endM) {
  int curr = currH * 60 + currM;
  int start = startH * 60 + startM;
  int end = endH * 60 + endM;

  if (start < end) {
    return (curr >= start && curr < end);
  } else {
    // Handles overnight windows (e.g., 11 PM to 6 AM) — not needed here but good practice
    return (curr >= start || curr < end);
  }
}

// ----- Trigger the buzzer -----
void triggerAlarm() {
  Serial.println("");
  Serial.println(">>> SMART ALARM TRIGGERED! WAKING DURING LIGHT SLEEP! <<<");
  Serial.println("");

  // Gentle rising tone
  for (int freq = 500; freq <= 1500; freq += 100) {
    tone(BUZZER_PIN, freq);
    delay(200);
  }
  noTone(BUZZER_PIN);
}
