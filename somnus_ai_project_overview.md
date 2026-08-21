# Somnus AI — Sleep Stage Monitoring (ECG-based Smart Wake System)

**Team:** David Immanuel Gobson (24BCS037), B Praveen (24BCS056)
**Event:** TECHINNOVATE 2026-2027

---

## 1. Problem Statement

- Poor sleep quality and irregular sleep patterns negatively affect daily productivity, concentration, and overall well-being.
- Conventional alarms wake users at a fixed time, which may result in waking during deeper sleep, leading to grogginess.
- Raw physiological sensor data is difficult to interpret without intelligent processing.
- Existing sleep-monitoring solutions often provide sleep data or reports but do not provide a personalized wake-up decision based on the user's current sleep stage and preferred wake-up window.

### Need for Solution

- A low-cost, accessible, intelligent sleep-monitoring system.
- Convert raw sensor readings into meaningful sleep information.
- Provide a smart wake-up mechanism within the user's preferred wake-up window.

---

## 2. Sleep Stage Background

The four sleep stages, per AASM standard: **W (Wakefulness)**, **N1** (transition from wake to light sleep), **N2** (light sleep), **N3** (deep sleep), **REM** (Rapid Eye Movement).

### Drawbacks of classifying all 4 stages

- Higher model complexity — distinguishing N1/N2/N3/REM instead of a simpler binary decision.
- Requires more representative training data across people and sleep conditions.
- Greater sensitivity to individual differences — HR, HRV, movement, and EEG patterns vary considerably between people.
- Stage transitions are not clear-cut — an epoch near a transition may show characteristics of more than one stage.

### Our narrowed objective: N2 vs Non-N2

- Full clinical PSG requires EEG + EOG + EMG + physiological signals — infeasible for a low-cost wearable.
- We narrow the ML objective to a **binary classifier: N2 vs Non-N2**.
- N2 is the target because it is the shallow-but-stable stage best suited for a low-grogginess wake — unlike REM or N3, which are poor wake targets.
- Smart Wake goal: detect **sustained N2** within the user's preferred wake window and wake them there.

---

## 3. Sensor Change: MAX30102 + MPU6050 → AD8232 ECG

### Original design (superseded)

- **MAX30102** (PPG) → HR, HRV, SpO₂
- **MPU6050** (accelerometer/gyroscope) → Movement

### Updated design

- **AD8232** single-lead ECG electrode module → continuous ECG voltage waveform → R-peak detection → RR interval series → HR/HRV features.
- This is a single-sensor design replacing the previous two-sensor design.

### What is gained / lost with this change

- **Lost: SpO₂** — no substitute exists in the ECG-only design.
- **Lost: direct movement/motion signal** — the MPU6050 accelerometer is removed. Motion correlates with arousals/stage transitions and previously stabilized the wake decision.
- **Partial substitute: Artifact Score** — a signal-quality proxy computed from the ratio of accepted vs. rejected R-peak detections per epoch, used as a rough (not equivalent) motion/noise indicator.
- **Known limitation to state explicitly in the pitch:** single-lead ECG is noisier than the original two-sensor setup, especially with a sleeping, moving user (baseline wander, electrode-pop, motion artifacts affecting R-peak detection).

---

## 4. What "Rhythm" Means From ECG

- Raw ECG is just a voltage waveform sampled over time — no heart rate, rhythm, or sleep-stage information is present directly in it.
- "Rhythm" refers to the **RR interval time series** — the time gaps between consecutive heartbeats — not the raw waveform amplitude/morphology.
- Pipeline to get there:
  1. Each heartbeat produces a sharp spike in the ECG waveform called the **R-peak** (part of the QRS complex) — the most reliable, distinct point to detect per beat.
  2. **R-peak detection** (via `neurokit2.ecg_process`, using the Pan-Tompkins algorithm under the hood) cleans the signal and returns a list of sample indices where each heartbeat occurred.
  3. Subtracting consecutive beat timestamps gives the **RR interval** in milliseconds.
  4. The full sequence of RR intervals across the night is the basis for every HRV feature used downstream (RMSSD, SDNN, pNN50, SD1/SD2, LF/HF).
- Chain: **raw ECG voltages → R-peak detection → beat timestamps → RR intervals → HRV features → ML input.**

---

## 5. Feature Vector (Per 30-Second Epoch)

| Feature | Description | Computable at 30s? |
|---|---|---|
| HR | Average heart rate over the epoch, from RR interval count | Yes |
| RMSSD | Root Mean Square of Successive Differences between RR intervals — core parasympathetic-tone marker | Yes |
| SDNN | Standard deviation of RR intervals — overall variability | Yes |
| pNN50 | % of adjacent RR interval differences greater than 50ms | Yes |
| SD1 (Poincaré) | Short-term RR variability, from the RRᵢ vs RRᵢ₊₁ scatter plot | Yes (noisier with only ~40–50 beats/epoch) |
| SD2 (Poincaré) | Long-term RR variability | Yes (same caveat) |
| LF/HF ratio | Sympathetic/parasympathetic balance — low LF/HF indicates deep/restorative sleep, high LF/HF indicates light sleep, REM, or waking | **No at 30s** — needs a longer window (see below) |
| Artifact Score | Ratio of accepted vs. rejected R-peak detections in the epoch — motion/noise proxy, substitute for the removed MPU6050 channel | Yes |

**Feature vector:** `xi = [HRi, RMSSDi, SDNNi, pNN50i, SD1i, SD2i, LF_HFi, ArtifactScorei]`

### Why LF/HF needs a wider window

- LF power (0.04–0.15 Hz) requires several minutes of data to resolve via FFT/Welch's periodogram — a 30-second window can't complete even one full LF cycle, so computing it directly on 30s epochs produces noise, not signal.
- **Fix:** compute LF/HF over a **2–5 minute sliding window** (5 min is standard in HRV literature; 2 min is the practical minimum for the HF band specifically), updated every 30 seconds as the window slides forward, and attach that value to every 30s epoch inside the window.
- Use **Lomb-Scargle periodogram** instead of Welch/FFT for this calculation — RR series are unevenly sampled by nature (heartbeats aren't equally spaced), and Lomb-Scargle handles that natively without resampling artifacts, which matters more on a short, noisy ECG window.

### Epoch timing decision

- **30-second epoch is kept as the primary cadence** — unchanged from the original design. This is required because the `k=3` consecutive-epoch stability check (below) depends on it: 3×30s = 90s of confirmed N2, and the wake-window responsiveness depends on checking every 30 seconds.
- Only the LF/HF feature is computed from a wider rolling lookback (2–5 min) and re-attached to each 30s row; every other feature is computed directly within the 30s window.

---

## 6. End-to-End Algorithm

```
AD8232 (ECG electrode) → Continuous ECG signal → R-peak detection
→ RR interval series → 30-second epoch → Feature calculation
(HR, RMSSD, SDNN, pNN50, SD1, SD2, LF/HF, Artifact Score)
→ ML N2 classifier → N2 probability (pᵢ) → Threshold check
→ Consecutive epoch check → Wake window check → WAKE / CONTINUE
```

### N2 Prediction

- Model output: `pi = fφ(xi)` — a trained model score from 0 to 1 indicating how strongly the epoch resembles N2.
- **Threshold check:** `θ = 0.70` (initial example value — not scientifically fixed, must be tuned using validation data). `di = 1 if pi ≥ θ, else 0`.

### Stability Check (Consecutive Epoch Confirmation)

- `k = 3` consecutive N2 epochs required.
- `Si = Σ dj` over the last k epochs. If `Si = k` → **N2 CONFIRMED**.
- "Consecutive" means immediately adjacent epochs are all N2 — not any three N2 epochs scattered across the night.
- Example: N2 → N2 → N2 = CONFIRMED. N2 → NOT N2 → N2 = NOT CONFIRMED.
- This filter is more important with the ECG-only sensor than in the original design, since single-lead ECG is noisier and the stability check protects the wake decision from a single noisy/misclassified epoch.

### Final Wake Decision

- `Wakei = 1 if Confirmedi = 1 AND Tstart ≤ ti ≤ Tdeadline`
- `Wakei = 1 if ti = Tdeadline` (forced fallback — wakes the user regardless of sleep stage if no N2 is confirmed by the deadline)
- `Wakei = 0` otherwise
- Worked example (epoch = 30s, θ = 0.70, k = 3, window 6:30–7:00 AM): three consecutive high-probability N2 epochs confirm N2 at ~6:31 AM → WAKE.

---

## 7. Technology Stack

| Layer | Tool |
|---|---|
| Firmware | ESP32 (Arduino/ESP-IDF), AD8232 on ADC pin, ECG sampled at 250–500 Hz, streamed over BLE/WiFi |
| Signal processing | R-peak detection via `neurokit2.ecg_process` (Pan-Tompkins algorithm) |
| Feature extraction | `neurokit2` HRV module or `pyHRV` — R-peak timestamps in, HRV features out |
| API layer | FastAPI — endpoints for ingest (ESP32 → backend), inference, and wake-decision state |
| Real-time transport | MQTT (ESP32 ↔ backend) or WebSocket (backend ↔ frontend, live waveform) |
| ML | scikit-learn / XGBoost on tabular HRV features (matches existing `train_xgboost.py` progress) |
| Database | PostgreSQL / Supabase — raw RR, epoch features, predictions |
| Frontend | Next.js — live RR waveform, hypnogram timeline, wake-window picker, alarm trigger UI |

---

## 8. Datasets for Training

DREAMT's wearable channel (Empatica E4: BVP, ACC, EDA, TEMP, HR, IBI) is **PPG-based**, not ECG — its IBI is derived from photoplethysmography. Since the sensor was switched to ECG, that wearable channel is the wrong modality to train on directly. DREAMT does, however, also include a **clinical PSG ECG channel** alongside its EEG/EOG/EMG/SpO2/respiratory signals — that's the channel to extract RR intervals from instead.

| Dataset | Why it fits | Access | Link |
|---|---|---|---|
| DREAMT (v2.x) — PSG ECG channel | Already downloaded; 100 subjects, AASM-scored; switch extraction source from E4 BVP/IBI to the PSG ECG channel | PhysioNet, open | https://physionet.org/content/dreamt/2.2.0/ |
| MESA (Multi-Ethnic Study of Atherosclerosis) | Single-lead ECG + PSG-scored stages, ~2,056 subjects with raw PSG data | NSRR (sleepdata.org), requires data use agreement | https://sleepdata.org/datasets/mesa |
| SHHS (Sleep Heart Health Study) | Large-scale single-lead ECG, PSG-scored, widely used in HRV sleep-staging literature | NSRR, requires data use agreement | https://sleepdata.org/datasets/shhs |
| MIT-BIH Polysomnographic Database (slpdb) | Smaller, ECG-native, no access request needed — used as a fast sanity check for the R-peak/RR extraction pipeline | PhysioNet, open | https://physionet.org/content/slpdb/1.0.0/ |

**Recommended order:** start with DREAMT's PSG ECG channel (already downloaded, fastest); submit MESA and SHHS access requests in parallel since NSRR approval takes a few days; use MIT-BIH slpdb to validate the R-peak/feature pipeline against a clean ECG-native reference before trusting results from DREAMT's clinical ECG lead (which will be cleaner than the AD8232's real-world signal on a moving sleeper).

Note: DREAMT is downloaded as `S00X_PSG_df.csv` files (e.g. `S002_PSG_df.csv`, `S003_PSG_df.csv`) sampled at 100Hz, containing an `ECG` column alongside other PSG channels (C4-M1, F4-M1, O2-M1, Fp1-O2, T3, CZ, T4, CHIN, E1, E2, LAT, RAT, SNORE, PTAF, FLOW, THORAX, ABDOMEN, SAO2, BVP, ACC_X/Y/Z, TEMP, EDA, HR, IBI) plus a `Sleep_Stage` label and event columns (Obstructive_Apnea, Central_Apnea, Hypopnea, Multiple_Events). Only the `ECG` column and `Sleep_Stage` label are used for feature extraction — every other column is ignored, since the deployed AD8232 sensor produces only ECG.

---

## 9. Model Training Workflow

1. **Use DREAMT's PSG ECG channel**, not its E4 wearable channel, since the deployed sensor is ECG-only.
2. **R-peak → RR series:** run `neurokit2.ecg_process()` on the `ECG` column to extract R-peaks and RR intervals — using the same extraction code for training data and live AD8232 data to avoid a train/deploy preprocessing mismatch.
3. **Epoch at 30s** for time-domain/Poincaré features; **epoch at 5-min sliding window** for LF/HF, then broadcast the 5-min value onto each contained 30s row.
4. **Label alignment:** map DREAMT's per-epoch `Sleep_Stage` labels onto the RR epochs, collapsed to binary N2-vs-non-N2 (matches the wake-decision architecture, which depends on N2 specifically).
5. **Split by subject, not by row** — random row splits leak adjacent epochs from the same sleep cycle into train and test.
6. **Class-weight or resample** to handle N2 imbalance (baseline confusion matrix showed heavy N2 dominance vs. other classes, e.g. N2 support of 8,559 vs. N3 support of 364).
7. **Train baseline (Random Forest/Logistic Regression) → XGBoost**, tracking precision/recall per class, not just accuracy.
8. **Simulate the wake state machine offline** before hardware integration — replay a held-out night's predicted probabilities through the `k=3` consecutive-epoch + wake-window logic to confirm it fires sensibly.
9. **Export the model** (pickle/ONNX) and serve it from FastAPI as a `/predict` endpoint taking a feature vector, returning `p(N2)`.

### Progress so far

- Baseline model run (`train_baseline.py`) — 5-class classification report and confusion matrix produced on MAX30102/MPU6050-era or early dataset (accuracy 0.4453, weighted avg F1 0.4623). Confusion matrix shows heavy misclassification, especially between N2 and other classes.
- XGBoost run (`train_xgboost.py`) — top-30 feature importance list produced, led by `HR_range`, `HR_range_prev`, `Movement_std_delta_prev`, `ACC_Y_std`, `ACC_X_std`, `HR_range_next`, and various movement/temperature/EDA delta features (from the earlier MAX30102/MPU6050 + wearable-based feature set — these will need to be recomputed for the ECG-only feature set above).

---

## 10. Real-Time Integration & Frontend Workflow

1. ESP32 streams raw ECG over MQTT/WebSocket to the backend.
2. Backend buffers samples, detects R-peaks in real time, builds a rolling RR series.
3. Every 30 seconds: extract the feature vector → call `/predict` → get `p(N2)` → threshold → push to the consecutive-epoch counter.
4. State machine: if N2 confirmed **and** inside the user's wake window → trigger alarm command back to the ESP32/phone and push a UI event.
5. If the deadline is reached with no confirmed N2 → forced wake fallback.
6. Frontend: WebSocket-fed live RR/ECG waveform panel, a rolling hypnogram (predicted stage per epoch over the night), and a wake-window input (start time + duration) read by the backend state machine.

---

## 11. Architecture Diagram Update

- **Perception & Sensing Layer:** MAX30102 (SpO2, HR) and MPU6050 (accelerometer) icons/labels replaced with **AD8232 (single-lead ECG electrodes) → analog output to ESP32 ADC**.
- All downstream layers (Communication Layer/ESP32, Intermediate Bridge, Database, ML Layer, UI/UX Layer, App Interface with Dashboard/AI ChatBot/Navigation-monitoring engine) are unchanged — the architecture doesn't depend on which sensor feeds the ESP32, only that raw signal comes in and is processed.

---

## 12. Cost / BOM Updates

### Prototype Sensors and Cost (updated)

| Component | Purpose | Approx. Cost / Unit |
|---|---|---|
| AD8232 ECG module (with cable + electrode pads) | Single-lead ECG acquisition → RR intervals | ₹300 – ₹800 |
| ESP32 Dev Board | Main controller and Wi-Fi/BLE | ₹480 – ₹960 |
| LiPo Battery and TP4056 | Power and charging | ₹380 – ₹575 |
| Carrier PCB | Mounting or interconnection | ₹190 – ₹960 |
| Wires, connectors, strap and enclosure | Assembly and wearable packaging | ₹480 – ₹960 |

**Estimated Total / Prototype ≈ ₹1,830 – ₹4,255** (cheaper than the original two-sensor BOM of ₹2,400 – ₹4,900, due to sensor consolidation from two ICs to one).

### Custom PCBA for the Prototype Sensors (updated)

| Component | Purpose | Approx. Cost / Unit |
|---|---|---|
| PCB Design & Layout | Schematic, PCB layout, routing | ₹5,000 – ₹12,000 |
| PCB Fabrication | Custom fabricated boards | ₹1,500 – ₹4,000 / board |
| PCBA Assembly | SMT/component placement or soldering | ₹1,500 – ₹4,000 / board |
| AD8232 | ECG signal conditioning IC/module | ₹300 – ₹700 / board |
| ESP32 | ESP32 module or supporting circuitry | ₹500 – ₹1,000 / board |
| Power Circuit | LiPo charging and regulation | ₹300 – ₹800 / board |
| Connectors | Battery connector, headers, etc. | ₹300 – ₹700 / board |
| Enclosure / Strap | Wearable packaging | ₹500 – ₹1,500 / unit |

**Estimated Total / Prototype ≈ ₹29,800 – ₹58,700** (slightly lower than the original ₹30,000 – ₹60,000, since AD8232 replaces the two-component MAX30102+MPU6050 line).

---

## 13. Presentation Slide Updates (Reference)

| Slide | Change |
|---|---|
| 5 — Our Solution to this Drawback | Sensor line updated: `AD8232 → ECG → R-peak detection → RR intervals → HR, HRV (time + Poincaré + LF/HF)`, replacing the MAX30102/MPU6050 line. Note added on lost SpO₂ and movement channel. |
| 6 — Algorithm and Formula | Pipeline redrawn: AD8232 → Continuous ECG Signal → R-peak Detection → RR Interval Series → 30-second Epoch → Feature Calculation → ML N2 Classifier → (unchanged) N2 probability → Threshold check → Consecutive epoch check → Wake window check → WAKE/CONTINUE. Sensor info box updated to describe AD8232 only. |
| 7 — How One Epoch becomes an ML Input? | Feature table and feature vector formula updated to the 8-feature ECG-derived set (HR, RMSSD, SDNN, pNN50, SD1, SD2, LF/HF, Artifact Score), replacing the old HR/HRV/SpO2/Movement set. |
| 8 — N2 Prediction and Stability Check | Logic unchanged (threshold θ=0.70, k=3 consecutive-epoch check) since it's sensor-agnostic; added note on why the stability filter matters more with noisier single-lead ECG input. |
| 9 — Final Wake Decision | Logic and formulas unchanged (sensor-agnostic); pipeline summary bar at the bottom updated to reflect the ECG-based chain. |
| 10 — Architecture Diagram | Sensor layer icons/labels updated from MAX30102+MPU6050 to AD8232. |
| 11 — Prototype Sensors and Cost | MAX30102 and MPU6050 rows merged into a single AD8232 row; total cost reduced. |
| 12 — Custom PCBA for the Prototype Sensors | MAX30102+MPU6050 row replaced with AD8232 row; total cost reduced. |

Slides 6–9 were regenerated as native (non-image) diagram slides matching the deck's navy/blue visual style, delivered as a standalone 4-slide `.pptx` file for insertion into the main deck.

---

## 14. Known Limitations to Address in the Pitch

- **No SpO₂ substitute** — apnea-related signal from the original MAX30102 is gone entirely.
- **Motion channel is only approximated** — the Artifact Score (R-peak detection quality ratio) is not equivalent to the MPU6050's direct accelerometer data.
- **Noisier deployment signal** — DREAMT's PSG ECG channel is a clinical, skin-prepped recording; the AD8232 wearable on a moving sleeper will be noisier, so real-world accuracy is expected to be lower than dataset-measured accuracy. Recommended: stress-test the R-peak detector against artificially noised/downsampled versions of the DREAMT ECG channel before trusting evaluation numbers, and have an actual measured artifact/noise rate ready if asked in Q&A.
- **REM vs. N2 objective clarification** — the project's ML task is specifically **N2 vs Non-N2** (not REM vs NREM), because the wake-window and consecutive-epoch logic in the architecture is built around detecting N2 specifically as the ideal low-grogginess wake stage.
