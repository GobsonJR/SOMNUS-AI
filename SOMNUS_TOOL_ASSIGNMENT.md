# Somnus — Tool Assignment & AI-Slop Audit

> How to split the project across **ChatGPT 5.6 Terra**, **Cursor**, and **Antigravity** so each tool does what it is best at — while keeping the website free of generic "AI slop."

---

## Tool Strengths Map

| Tool | Best At | Avoid Giving It |
|------|---------|-----------------|
| **ChatGPT 5.6 Terra** | Architecture, system design, documentation, protocol design, cross-checking, reasoning | Writing 500-line implementation files, 3D shaders |
| **Cursor** | Writing actual code, IDE integration, refactoring, boilerplate generation, debugging | High-level architecture decisions, visual design direction |
| **Antigravity** | 3D scenes, WebGL, animations, motion design, creative coding, visual "wow" | Business logic, database schema, API design |

---

## Phase 1: ChatGPT 5.6 Terra — Architecture & Audit

### What to ask ChatGPT 5.6 Terra

1. **"Design the MQTT message protocol between ESP32 and FastAPI"**
   - Payload schema for 30-second epochs
   - Alarm command schema
   - Error handling protocol
   - Reconnection logic

2. **"Design the database schema for Somnus"**
   - `epochs` table (time-series, TimescaleDB hypertable)
   - `alarms` table
   - `wake_events` table
   - `users` table (if needed)
   - Indexing strategy

3. **"Design the WebSocket message protocol for the frontend"**
   - `STAGE_UPDATE` message format
   - `ALARM_TRIGGER` message format
   - `CONNECTION_STATUS` heartbeat
   - Reconnection strategy

4. **"Audit this feature list for AI slop"** (see Section 3 below)
   - Cross-check every feature against Guide.md
   - Mark: KEEP / CUT / DEFER
   - Give reasoning for each

5. **"Design the Docker Compose architecture"**
   - Service dependencies
   - Network topology
   - Volume mounts
   - Environment variable strategy

6. **"Design the ML training pipeline"**
   - Dataset selection (SHHS, MESA)
   - Feature extraction strategy
   - Model selection rationale
   - Evaluation metrics
   - ONNX export strategy

7. **"Write the API contract document"**
   - REST endpoints
   - Request/response schemas
   - Error codes
   - Authentication strategy

### Output from ChatGPT 5.6 Terra

- Markdown documents (like this one)
- Architecture diagrams (as text/ASCII)
- Decision records
- Feature audit results
- Protocol specifications

---

## Phase 2: Cursor — Implementation

### What to ask Cursor

Cursor excels at writing the actual files. Give it the architecture docs from ChatGPT and ask for implementation.

#### Backend (FastAPI)

```prompt
"Implement a FastAPI backend with the following structure:
- main.py with lifespan events
- MQTT client using paho-mqtt (background subscriber)
- WebSocket manager for broadcasting to frontend
- Smart wake logic (N2 consecutive epoch check + wake window)
- Feature extraction from RR intervals using hrv-analysis
- ONNX inference wrapper
- PostgreSQL models using SQLAlchemy async
- Alarm configuration API
- Health check endpoint
Use the architecture from [paste ChatGPT output here]."
```

#### Firmware (ESP32)

```prompt
"Write an Arduino sketch for ESP32 that:
- Reads AD8232 ECG from analog pin 34
- Runs a simple threshold-based R-peak detector
- Accumulates RR intervals for 30 seconds
- Connects to WiFi
- Publishes JSON payload via MQTT every 30s
- Subscribes to alarm topic and triggers buzzer on WAKE command
Use this config: [paste from FIRMWARE_README.md]"
```

#### Frontend (React + Vite)

```prompt
"Create a React dashboard with:
- WebSocket connection to FastAPI
- Live metric cards (Current Stage, N2 Probability, RMSSD)
- Hypnogram chart showing sleep stages over time
- Alarm setup form (time picker + window slider)
- Wake banner that appears when alarm triggers
- Uses Tailwind CSS with warm neutral palette (#F4F1EA canvas, #C54B32 brand)
Follow the design system: [paste from Guide.md section 1]"
```

#### ML Training

```prompt
"Write a Python script that:
- Loads RR intervals and sleep stage labels from CSV
- Extracts HRV features using hrv-analysis (time, frequency, non-linear)
- Trains two XGBoost models (N2 binary + 3-class stage)
- Evaluates with classification report and confusion matrix
- Exports to ONNX + feature_columns.json
Use the feature list from [paste from ML_README.md]"
```

### Cursor Tips

- Use **Composer** for multi-file generation
- Use **Cmd+K** inline editing for quick fixes
- Use **Cmd+L** chat for explaining errors
- Use **@docs** to reference your architecture markdown files
- Use **@web** for library documentation (FastAPI, hrv-analysis, etc.)

---

## Phase 3: Antigravity — 3D & Motion

### What to ask Antigravity

Antigravity is built for creative coding, WebGL, and motion. Give it the visual direction from Guide.md and let it own the "feel."

#### 3D Product Hero

```prompt
"Create a React Three Fiber scene with:
- A 3D model of a small wearable device (ESP32 + ECG sensor)
- Warm studio lighting (key + fill + rim)
- Very slow ambient rotation (0.1 rpm)
- Subtle pointer parallax (max ±4° X, ±5° Y)
- Entry animation: fade in + scale from 0.94 to 1
- Render at max DPR 1.5 for performance
- Pause rendering when not in viewport (IntersectionObserver)
Color palette: warm neutral canvas #F4F1EA, brand #C54B32"
```

#### Feature Deck Animation

```prompt
"Create a three-card horizontal scroller with:
- CSS scroll-snap (x mandatory)
- Active card: opacity 1, scale 1
- Inactive cards: opacity 0.55, scale 0.97
- Smooth 220ms transitions
- Keyboard arrow support
- Respect prefers-reduced-motion
No Swiper, no GSAP unless necessary. Native CSS first."
```

#### Loading States

```prompt
"Design a loading state for the 3D hero that:
- Reserves final dimensions immediately (no layout shift)
- Shows a quiet 'loading' dot
- Fades model in when ready
- No generic skeleton blocks
- No spinner animations"
```

#### Micro-interactions

```prompt
"Create hover states that:
- Buttons: translateY(-1px) + 180ms transition
- Links: color change to brand #C54B32
- Cards: border color shift, no shadow explosion
- No neon glow, no sparkle, no bounce
Follow Guide.md Section 12 exactly."
```

### Antigravity Tips

- Let it generate **React Three Fiber** components directly
- Ask for **performance-optimized** shaders
- Request **fallbacks** for mobile/low-power devices
- Ask for **reduced motion** variants

---

## AI-Slop Audit: Your Feature List

Here is the cross-check of every feature you listed against Guide.md.

### KEEP — These are necessary and non-generic

| Feature | Verdict | Reason |
|---------|---------|--------|
| **simple cookie banner** | KEEP | Guide Section 13.1 explicitly supports this. Small, honest, functional. |
| **mobile menus** | KEEP | Necessary for responsive design. Not decorative. |
| **loading animations** | KEEP | Guide Section 11 supports meaningful loading states. Reserve dimensions, fade in. |
| **hover states** | KEEP | Guide Section 12.1: hover should communicate affordance. 1px lift, color shift. |
| **form success state** | KEEP | Real UX necessity. Not decorative. |
| **form error state** | KEEP | Real UX necessity. Not decorative. |
| **confirmation modals** | KEEP | Necessary for destructive actions (e.g., cancel alarm). |
| **expandable FAQ** | KEEP | If you have real questions. Don't invent fake ones. |
| **custom 404 page** | KEEP | Good practice. Keep it minimal. |
| **CTA above the fold** | KEEP | Guide Section 13.2 supports clear CTA hierarchy. |
| **internal links** | KEEP | SEO and navigation necessity. |
| **thank you page** | KEEP | After alarm setup or contact form. Real flow. |
| **breadcrumbs** | DEFER | Only if site grows beyond 5 pages. For MVP, probably unnecessary. |
| **robots.txt** | KEEP | Technical necessity for SEO. |
| **unique page titles** | KEEP | SEO necessity. |
| **meta descriptions** | KEEP | SEO necessity. |
| **alt text on images** | KEEP | Accessibility necessity. |
| **skip to content** | KEEP | Guide Section 17.2 / Accessibility requirement. |
| **print style sheet** | DEFER | Useful but not MVP-critical. |
| **social share img** | KEEP | Marketing necessity when sharing. |

### CUT — These are AI-slop or over-engineering for MVP

| Feature | Verdict | Reason |
|---------|---------|--------|
| **dark mode toggle** | CUT | Guide never mentions dark mode. For a health/medical product, warm neutral canvas is the intentional choice. Adding dark mode is "feature because trendy." |
| **site search** | CUT | You have ~5 pages. Native Ctrl+F is enough. Adding search is generic SaaS pattern. |
| **^ top button** | CUT | Guide never mentions this. For a single-page narrative site, native scroll is enough. This is a generic blog pattern. |
| **scroll progress bars** | CUT | Guide Section 16.3 warns against decorative scroll indicators. Unless content is genuinely chaptered and long, this is visual noise. |
| **copy button** | CUT | What are users copying? Code snippets? This is a product website, not a documentation site. Generic pattern. |
| **sticky headers** | CUT | Guide never mentions sticky headers. For a simple product site, this adds visual clutter. Let the page breathe. |
| **PW visibility toggle** | CUT | Password visibility toggle implies a login system. For a hackathon MVP with no auth, this is over-engineering. |
| **UTM tracking** | CUT | Marketing analytics. Not AI slop, but not necessary for MVP. Add when you actually run campaigns. |
| **last updated date** | CUT | Unless content genuinely changes frequently, this is a fake trust signal. "Last updated: today" on a static page is AI slop. |
| **floating contact** | CUT | Guide Section 37.1 warns against third-party chat widgets. If you need contact, use a simple form or email link. |
| **response time promise** | CUT | "We respond in 24 hours" without the infrastructure to back it is a fabricated trust signal. Guide Section 14 warns against this. |
| **meta data / meta text** | CUT (vague) | "Meta data" and "meta text" are not real features. Be specific: meta descriptions (KEEP), Open Graph tags (KEEP), structured data (DEFER). |
| **PP image** | CUT (unclear) | If this means "privacy policy image," a wall of legal text with a stock photo is AI slop. If it means something else, clarify. |
| **local schema** | DEFER | Schema.org structured data is good for SEO but not MVP-critical. Add after launch. |

### DEFER — Useful but not for MVP

| Feature | Reason |
|---------|--------|
| **breadcrumbs** | Only needed if site grows beyond single-page + dashboard |
| **print style sheet** | Nice-to-have. Not critical for a digital health product. |
| **local schema** | SEO enhancement. Defer to post-launch. |

---

## What the Guide Explicitly Forbids (Checklist)

From Guide.md, here are patterns that **must not appear** in Somnus:

### Visual
- [ ] **Harsh gradients** — Section 1.4: "Avoid `background: linear-gradient(...)` for major page backgrounds."
- [ ] **Decorative dot grids** — Section 7: "Do not use a decorative dot grid."
- [ ] **Neon glows / pulses** — Section 12.2: "Avoid neon pulses."
- [ ] **Liquid glass** — Section 8.3: "Do not use blurred translucent cards over a background."
- [ ] **Radial orbs / gradient spheres** — Section 12.5: "Do not use floating gradient spheres as ambient decoration."
- [ ] **Bento grids** — Section 5: "Avoid the standard bento arrangement of differently sized rounded rectangles."
- [ ] **Excessive rounded corners** — Section 1.5: "Do not make every component a pill or heavily rounded card."
- [ ] **Shadows on everything** — Section 1.6: "Do not use shadows as a default component style."
- [ ] **Purple/black SaaS palette** — Section 1.2: "Do not automatically use purple and black."

### Content
- [ ] **Fake testimonials** — Section 14: "Never invent a person, job title, company, or quote."
- [ ] **Fake terminal window** — Section 8.5: "Do not use a fake terminal window to signal technical credibility."
- [ ] **Checkmark bullet walls** — Section 8.6: "Benefits should sound like product observations, not SaaS feature filler."
- [ ] **Generic marketing copy** — Section 39: Avoid "The future of...", "Unlock your potential", "Transform your workflow", etc.
- [ ] **Em-dash stuffing** — Section 8.4: "Avoid using em dashes as a stylistic crutch."
- [ ] **Emoji decoration** — Section 8.2: "Avoid using emoji as decorative UI."
- [ ] **Sparkle icons** — Section 12.4: "Do not decorate ordinary completion states with sparkles."

### Motion
- [ ] **Animated arrows** — Section 12.3: "Use a static arrow or text label."
- [ ] **Excessive hover effects** — Section 12.1: "One clear response is enough."
- [ ] **360° scroll rotation** — Section 3.2: "Do not rotate the model 360° simply because scrolling exists."
- [ ] **No reduced motion support** — Section 17.1: Must respect `prefers-reduced-motion`.

---

## Recommended MVP Feature Set

Based on the audit, here is what Somnus should actually ship:

### Marketing Site (Frontend)

**Navigation**
- Logo + 3 links (Product, How it Works, Dashboard) + CTA
- Mobile hamburger menu (native, no fancy animation)
- Skip to content link (accessibility)

**Hero**
- Asymmetric layout: copy left, 3D product right
- One headline (specific to product)
- One supporting sentence
- Two buttons (Primary + Secondary)
- 3D model with slow ambient rotation

**How It Works**
- Three-step editorial sequence (01 Capture, 02 Interpret, 03 Respond)
- Real product images or diagrams
- No icons, no checkmarks, no bento grid

**Product Demo**
- Real screenshot of the dashboard
- Or a short looped video of the device working
- No fake terminal, no abstract UI mockups

**Feature Deck**
- Three cards with CSS scroll-snap
- One active, next partially visible
- Keyboard + touch support

**Evidence**
- One real measurement result
- Or one real product photo with specs
- No fake testimonials

**Footer**
- Minimal: logo, links, legal (privacy, terms), copyright
- No newsletter signup unless real
- No social icons unless real accounts exist

**Technical**
- Simple cookie banner
- Custom 404 page
- robots.txt
- Meta titles + descriptions
- Alt text on all images
- Social share image (one og:image)

### Dashboard (Authenticated / Device-Paired View)

- Live metric cards (Stage, N2 Probability, RMSSD)
- Hypnogram chart
- Alarm setup form
- Wake banner
- Connection status indicator

### Backend

- MQTT ingestion from ESP32
- RR feature extraction
- ONNX inference
- Smart wake logic
- WebSocket broadcast
- Alarm API
- PostgreSQL persistence
- Health endpoint

### Firmware

- ECG sampling
- R-peak detection
- RR accumulation
- WiFi + MQTT publish
- Alarm subscription + buzzer trigger

---

## Work Assignment by Tool

### ChatGPT 5.6 Terra — Architecture & Documentation

| Task | Output |
|------|--------|
| Design MQTT protocol | Protocol spec markdown |
| Design database schema | SQL + SQLAlchemy models |
| Design WebSocket protocol | Message type definitions |
| Audit feature list | This document |
| Design Docker Compose | docker-compose.yml spec |
| Design ML pipeline | Training strategy doc |
| Write API contract | REST + MQTT + WS spec |
| Write copy for website | Headlines, feature descriptions |

### Cursor — Code Implementation

| Task | Output |
|------|--------|
| FastAPI backend | All Python files in `backend/app/` |
| ESP32 firmware | `firmware/src/*.cpp`, `*.h` |
| React frontend | `frontend/src/` components + pages |
| ML training scripts | `ml/src/*.py` |
| Docker files | `Dockerfile`s, `docker-compose.yml` |
| Database migrations | Alembic files |

### Antigravity — 3D & Motion

| Task | Output |
|------|--------|
| 3D product hero | React Three Fiber scene |
| Feature deck scroll-snap | CSS + React implementation |
| Loading states | Fade-in, reserved dimensions |
| Hover micro-interactions | CSS transitions |
| Reduced motion variants | `@media (prefers-reduced-motion)` |
| Mobile menu animation | Simple, non-bouncy |

---

## Suggested Prompts for Each Tool

### ChatGPT 5.6 Terra Prompts

```
"Design the MQTT message protocol for a sleep monitoring device.
Requirements:
- 30-second epochs of RR intervals
- Device ID, timestamp, lead-off status
- Alarm command from server to device
- JSON payload format
- Include reconnection and error handling strategy."
```

```
"Audit this feature list for generic AI-slop patterns.
Reference: [paste Guide.md sections 1, 8, 12, 14].
Mark each feature as KEEP, CUT, or DEFER with reasoning.
Feature list: [paste your list]."
```

### Cursor Prompts

```
"Generate a FastAPI backend with MQTT and WebSocket support.
Architecture:
- paho-mqtt background subscriber
- WebSocket connection manager
- Smart wake logic (consecutive N2 detection)
- PostgreSQL with SQLAlchemy async
- Health check endpoint
Follow the structure in [paste BACKEND_README.md]."
```

```
"Generate a React dashboard for sleep monitoring.
Components needed:
- LiveGraph (RR tachogram)
- Hypnogram (sleep stage timeline)
- AlarmSetup (time + window form)
- MetricCard (reusable stat card)
- WakeBanner (alarm triggered overlay)
Style: Tailwind CSS, warm neutral palette."
```

### Antigravity Prompts

```
"Create a React Three Fiber hero scene for a wearable health device.
Requirements:
- Warm studio lighting (3-point)
- Ambient rotation 0.1 rpm
- Pointer parallax max ±4°
- Entry fade + scale animation
- DPR capped at 1.5
- Pause when off-screen
- Reduced motion fallback
Palette: canvas #F4F1EA, brand #C54B32"
```

```
"Create a CSS scroll-snap feature deck with 3 cards.
Requirements:
- Native CSS scroll-snap, no Swiper
- Active card: opacity 1, scale 1
- Inactive: opacity 0.55, scale 0.97
- 220ms transitions
- Keyboard arrow support
- Reduced motion support"
```

---

## Final Checklist Before Shipping

Run this through ChatGPT 5.6 Terra one last time:

```
"Review the Somnus website against the AI-slop checklist.
Check:
1. No gradients on backgrounds
2. No decorative dot grids
3. No neon glows or pulses
4. No liquid glass
5. No fake testimonials
6. No fake terminal
7. No checkmark bullet walls
8. No generic marketing copy
9. No em-dash stuffing
10. No emoji decoration
11. No sparkle icons
12. No animated arrows
13. No excessive hover effects
14. No 360° scroll rotation
15. Reduced motion supported
16. Real product demonstrations only
17. One strong brand color, not purple/black
18. Warm neutral canvas, not pure white
19. Shadows only where depth matters
20. Rounded corners restrained (6px/10px/16px)

Flag any violations."
```
