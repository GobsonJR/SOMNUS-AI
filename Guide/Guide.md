# Product Marketing Website — Clean, Human-Crafted UI Direction

## 0. Design Intent

This version deliberately moves away from the common "AI-generated landing page" vocabulary: oversized gradients, interchangeable SaaS cards, decorative dot fields, neon glows, excessive rounded containers, generic testimonials, fake terminal windows, sparkle icons, and bento layouts that exist only because they are fashionable.

The visual language should feel **edited rather than decorated**.

The website should answer three questions quickly:

1. **What is the product?**
2. **What does it help me do?**
3. **Why should I trust it enough to try it?**

The 3D object is the visual signature, not the entire story. It should demonstrate the product's character and behavior while the surrounding interface remains quiet and readable.

### Core principles

- Use a warm, slightly off-white or mineral background rather than pure white.
- Use one strong brand color with a dark neutral, rather than a purple/black SaaS palette.
- Use color as a signal, not as wallpaper.
- Prefer typography, spacing, borders, and composition over shadows and effects.
- Use a small number of deliberately chosen shapes.
- Make motion explain something.
- Use real product material wherever possible.
- Avoid fabricated social proof.
- Keep copy specific and concrete.
- Let empty space do some of the design work.

---

# 1. Visual Foundation

## 1.1 Background: use a warm neutral instead of pure white

### Recommendation

Use a restrained warm paper or mineral tone:

```css
:root {
  --canvas: #F4F1EA;
  --surface: #FAF8F3;
  --ink: #171716;
  --muted-ink: #68665F;
  --line: #D9D4C9;
  --brand: #C54B32;
  --brand-dark: #8E2F21;
}
```

The exact color should be selected from the product itself. If the physical product is blue, green, orange, metal, or another identifiable color, use that as the visual anchor instead of automatically reaching for purple.

### Why this feels less generic

A slightly warm canvas creates the feeling of a designed editorial surface. It also gives photographs, diagrams, product renders, and interface screenshots a more natural relationship with the page.

### CSS strategy

Avoid painting every section a different color. Establish one canvas and use a small number of surfaces:

```css
body {
  background: var(--canvas);
  color: var(--ink);
}

.surface {
  background: var(--surface);
  border: 1px solid var(--line);
}
```

Do not create ten nearly identical background shades.

### AI-slop trap

**Generic:** every section has a different tinted rectangle, gradient, or glowing backdrop.

**Intentional:** the page mostly shares one canvas, while a few surfaces are introduced because they have a clear functional reason.

---

## 1.2 Brand color: one strong color plus neutrals

Do not automatically use purple and black.

A better system is:

- **Primary brand:** one identifiable product color.
- **Ink:** nearly black, but not necessarily pure `#000`.
- **Canvas:** warm neutral.
- **Support colors:** one or two restrained colors for status, success, warning, or data.

Example:

```css
--brand: #C54B32;
--brand-hover: #A93C29;
--ink: #171716;
--muted-ink: #68665F;
--canvas: #F4F1EA;
--surface: #FAF8F3;
--line: #D9D4C9;
```

### Color rule

A useful rule is approximately:

- 70–80% neutral canvas/surface
- 15–25% dark typography and structural elements
- 5% brand color

The exact ratio should follow the content, not a rigid design formula.

### AI-slop trap

Do not use the brand color on every border, icon, heading, background, and button.

If everything is branded, nothing is emphasized.

---

## 1.3 Accents: use functional color, not pastel decoration

Avoid pastel blobs and decorative color chips.

Instead, use accents for actual meaning:

- active state
- selected state
- warning
- success
- product status
- highlighted metric
- interaction target

For example:

```css
.status-live {
  color: #246B45;
}

.status-warning {
  color: #8A5A14;
}

.status-error {
  color: #A12B25;
}
```

The accent should tell the user something.

---

## 1.4 No harsh gradients

Avoid:

```css
background: linear-gradient(...);
```

for major page backgrounds.

Solid colors should do most of the work.

If the 3D material itself contains physically realistic shading, that is different. The rendered object can have lighting because lighting belongs to the object, not the website's decorative background.

### AI-slop trap

A huge purple-blue gradient behind a floating object is one of the fastest ways to make the site resemble a generic generated SaaS landing page.

---

## 1.5 Corner treatment

Do not make every component a pill or heavily rounded card.

Use three levels:

```css
:root {
  --radius-small: 6px;
  --radius-medium: 10px;
  --radius-large: 16px;
}
```

Use:

- `6px` for controls and small UI
- `10px` for cards and panels
- `16px` only for major visual containers

Some elements can remain square or nearly square.

### Why

A consistent but restrained corner language feels more deliberate than putting `border-radius: 24px` on everything.

---

## 1.6 Shadows

Do not use shadows as a default component style.

Use borders and contrast first.

```css
.card {
  border: 1px solid var(--line);
}

.floating-panel {
  border: 1px solid var(--line);
  box-shadow: 0 14px 35px rgb(20 20 18 / 10%);
}
```

A shadow should communicate physical separation.

### Shadow hierarchy

- Normal content: no shadow.
- Raised interactive panel: subtle shadow.
- Modal/popover: stronger shadow.
- Nothing else needs a shadow.

### AI-slop trap

Do not give every card the same soft shadow. It removes hierarchy and makes the page look assembled from a component library.

---

# 2. Typography

## 2.1 Primary typeface

Do not use Inter, Geist, or Space Grotesk for this direction.

A strong alternative is **IBM Plex Sans** for interface and body copy, paired with **IBM Plex Serif** for selected editorial headlines.

This creates a recognizable voice without relying on the current startup-design default.

### Assignment

| Purpose | Typeface |
|---|---|
| Hero headline | IBM Plex Serif |
| Section headlines | IBM Plex Serif |
| Body copy | IBM Plex Sans |
| Buttons | IBM Plex Sans |
| Navigation | IBM Plex Sans |
| Metrics/data | IBM Plex Mono |
| Small labels | IBM Plex Sans |

Use the serif sparingly. The objective is not to turn the site into a newspaper. It is to introduce a typographic fingerprint.

### Example

```css
.hero-title {
  font-family: "IBM Plex Serif", serif;
  font-size: clamp(3.5rem, 7vw, 7.5rem);
  line-height: 0.95;
  letter-spacing: -0.045em;
}

.body {
  font-family: "IBM Plex Sans", sans-serif;
  line-height: 1.55;
}

.data {
  font-family: "IBM Plex Mono", monospace;
}
```

### AI-slop trap

The generic formula is:

> giant sans-serif heading + tiny eyebrow + gradient text + "Built for the future" + pill CTA.

Instead, write a headline that describes the product.

Example:

> **See the signal before it becomes a problem.**

Supporting copy:

> A compact sensing system that turns movement and pulse data into a clear view of what is happening.

That is more credible than abstract marketing language.

---

# 3. Layout and Structure

## 3.1 Hero composition

Do not use a centered hero with a floating 3D object above a wall of text.

Use an asymmetric composition.

### Recommended structure

```text
┌─────────────────────────────────────────────────────────────┐
│ Logo                         Navigation             CTA      │
│                                                             │
│                                                             │
│  PRODUCT / CATEGORY                 ┌─────────────────────┐  │
│                                     │                     │  │
│  Clear product                      │       3D            │  │
│  statement                          │      PRODUCT        │  │
│                                     │                     │  │
│  Supporting copy                   └─────────────────────┘  │
│                                                             │
│  [Primary action]  [Secondary action]                       │
│                                                             │
│  Short product proof                                      ↓ │
└─────────────────────────────────────────────────────────────┘
```

The 3D model remains visible while the page content changes around it.

### Why

The product becomes the visual anchor without turning the entire page into a canvas experiment.

---

## 3.2 3D model: persistent but not dominant

### Optimal movement strategy

Use a combination of:

1. **Entry animation**
2. **Very slow ambient rotation**
3. **Small pointer/touch response**
4. **Scroll-linked orientation changes**

Do not use all of them at maximum intensity.

### Recommended sequence

#### On landing

The model begins slightly smaller and lower than its final position.

```text
opacity: 0 → 1
scale: 0.94 → 1
y: 30px → 0
rotation: -4deg → 0deg
```

Duration: approximately `700–1000ms`.

#### After entry

Use extremely slow continuous movement.

The product should feel alive, not like a spinning loading icon.

#### Pointer movement

Limit the effect:

```text
maximum X rotation: ±4°
maximum Y rotation: ±5°
```

Use interpolation rather than directly mapping pointer coordinates to rotation.

#### Scroll

Scroll should change the camera or product orientation only when it supports the story.

Do not rotate the model 360° simply because scrolling exists.

---

## 3.3 Three.js vs React Three Fiber vs Spline

### Three.js

Use when:

- you need complete control;
- the model is central to the product experience;
- you need custom shaders or camera behavior;
- you are comfortable managing the rendering lifecycle.

Official documentation:

urlThree.js documentationhttps://threejs.org/docs/

### React Three Fiber

Use when:

- the site is React-based;
- the 3D scene has interactive UI state;
- the model interacts with React components.

It is a good default for this project if React is already being used.

Official documentation:

urlReact Three Fiber documentationhttps://r3f.docs.pmnd.rs/

### Spline

Use when:

- designers need to edit the scene visually;
- the interaction is relatively self-contained;
- you want to reduce custom 3D engineering.

Official documentation:

urlSpline documentationhttps://docs.spline.design/

### Recommendation

For a product marketing site with one important model:

**React + React Three Fiber + Three.js** is the strongest long-term choice if the team can maintain it.

Use Spline when designer ownership is more important than low-level control.

---

# 4. No Persistent Left Stripe

Do not use the common colored vertical stripe.

Instead, create visual continuity through:

- a consistent left content edge;
- typography alignment;
- section numbers;
- small category labels;
- occasional brand-colored rules.

Example:

```text
01  HOW IT WORKS
────────────────────────

The system captures...
```

The structure itself becomes the brand element.

---

# 5. Feature Organization Without Bento Grids

Avoid the standard bento arrangement of differently sized rounded rectangles.

Use a **three-column editorial sequence** or a **horizontal narrative**.

Example:

```text
01 / CAPTURE
The system observes the signal.

02 / INTERPRET
The raw signal becomes useful information.

03 / RESPOND
The result becomes an action you can understand.
```

Each feature can contain:

- a real product image;
- one short demonstration;
- one measurable benefit;
- one concise explanation.

This is easier to scan and feels less templated.

---

# 6. Three-Feature Card Deck

Keep the requested three-card interaction, but make it feel like a product story rather than a carousel template.

## Structure

Only one card is fully active.

The next card is partially visible.

```text
┌───────────────────────────────┐
│                               │
│ 01                            │
│                               │
│ Capture                       │
│                               │
│ [real product visual]         │
│                               │
│ Short explanation             │
│                               │
└───────────────────────────────┘
              ┌───────────────────────┐
              │ 02  Interpret         │
              └───────────────────────┘
```

### Interaction

- Drag with pointer/touch.
- Keyboard arrows.
- Previous/next buttons.
- Direct navigation through three progress indicators.
- Respect reduced motion.

### Technology

Prefer native CSS scroll snapping first.

CSS Scroll Snap provides snap positions for scroll containers and is widely supported. citeturn0search0turn0search9

Useful properties:

```css
.feature-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}

.feature {
  flex: 0 0 min(82vw, 720px);
  scroll-snap-align: center;
}
```

MDN also documents scroll snap events that can be used to detect selected snap targets. citeturn0search5

---

# 7. No Dot Grid Background

Do not use a decorative dot grid.

Use actual content structure instead:

- thin rules;
- section numbers;
- image crops;
- measured spacing;
- product diagrams;
- typography;
- subtle texture in photography.

If texture is required, use a real material texture or a barely visible paper grain rather than a generated dot pattern.

---

# 8. Components and UI Elements

## 8.1 Iconography

Do not restrict the site to Lucide.

Use icons only where an icon improves recognition.

Recommended hierarchy:

1. Product-specific diagrams first.
2. Familiar platform/browser icons where appropriate.
3. A coherent icon family for utility actions.
4. Lucide or another icon set only for genuinely generic UI actions.

Examples:

- menu
- close
- play
- pause
- previous
- next
- external link

Do not put an icon next to every sentence.

---

## 8.2 No emoji system

Avoid using emoji as decorative UI.

Personality should come from:

- photography;
- copy;
- typography;
- product details;
- subtle motion.

If an emoji is genuinely part of the brand voice, use it once and intentionally.

---

## 8.3 No liquid glass

Do not use blurred translucent cards over a background merely because the effect is fashionable.

Use opaque surfaces:

```css
.panel {
  background: var(--surface);
  border: 1px solid var(--line);
}
```

If an overlay is required over the 3D model, use a solid or mostly opaque panel so the information remains readable.

---

## 8.4 Copy: no em-dash dependency

Avoid using em dashes as a stylistic crutch.

Use short sentences.

Instead of:

> A compact sensing platform — designed for clarity — that turns raw signals into useful information.

Use:

> A compact sensing platform designed for clarity. It turns raw signals into useful information.

This also makes the copy easier to scan.

---

## 8.5 No terminal window

Do not use a fake terminal window to signal technical credibility.

If the product is technically sophisticated, demonstrate that through the actual product:

- a real measurement;
- a real graph;
- a real workflow;
- a real configuration;
- a real before/after result.

A fake terminal says "technology" without proving anything.

---

## 8.6 No checkmark bullet wall

Instead of:

- ✓ Fast
- ✓ Secure
- ✓ Reliable
- ✓ Scalable

write evidence-driven statements:

```text
01
Designed to capture changes without requiring constant attention.

02
Results are presented in a form people can act on.

03
The physical system stays compact enough for everyday use.
```

Benefits should sound like product observations, not SaaS feature filler.

---

# 9. Pricing

## 9.1 Three pricing levels

If the product genuinely has three purchasing levels, use three.

Do not manufacture three tiers simply because pricing cards are expected.

Example:

| Plan | Best for | Position |
|---|---|---|
| Starter | Individual use | Entry |
| Studio | Small teams | Recommended |
| Organization | Larger deployments | Contact |

Make the middle option visually clearer through typography and spacing, not a neon border or giant "MOST POPULAR" badge.

### If pricing is not appropriate

Do not show fake prices.

Use:

- Buy
- Request a quote
- Talk to the team
- Join the waitlist

depending on the actual business model.

---

# 10. Real Product Demonstrations

Use real demonstrations instead of abstract placeholder UI.

A good product demonstration might show:

- the physical product operating;
- an actual measurement changing;
- a real interface responding;
- a before/after comparison;
- a short interaction captured from the product.

### Important

Do not expose backend architecture.

The demonstration should answer:

> "What does this product let me see or do?"

It does not need to answer:

> "Which framework or service produced this?"

### Demo composition

Keep each demo focused on one action.

```text
USER ACTION
     ↓
PRODUCT RESPONSE
     ↓
USEFUL RESULT
```

Avoid dashboards containing fifteen meaningless charts.

---

# 11. Loading States

Do not use a generic skeleton for the hero 3D object.

A skeleton makes sense for content-heavy interfaces where the final geometry is unknown. It is less appropriate for a single hero object whose composition is known.

### Recommended 3D loading pattern

Use a **quiet reserved stage**:

```text
┌──────────────────────────┐
│                          │
│       PRODUCT AREA       │
│                          │
│          •               │
│       loading            │
│                          │
└──────────────────────────┘
```

The container should reserve the final dimensions immediately.

Then:

1. reserve the canvas;
2. load the model;
3. fade the model in;
4. start interaction only after the model is ready.

Do not shift surrounding content when the model appears.

### For images

Use a low-resolution image preview or a blurred thumbnail if one exists.

---

# 12. Interactive Elements

## 12.1 Hover animation

Hover should communicate affordance.

Good:

```css
.button {
  transition:
    transform 180ms ease,
    background-color 180ms ease;
}

.button:hover {
  transform: translateY(-1px);
}
```

Bad:

```text
button glows
→ scales
→ rotates
→ emits particles
→ changes gradient
→ bounces
```

One clear response is enough.

---

## 12.2 No neon animation

Avoid neon pulses.

Use brand color transitions, border changes, opacity, and position.

Example:

```css
.link {
  color: var(--ink);
}

.link:hover {
  color: var(--brand);
}
```

The interaction should feel physical rather than synthetic.

---

## 12.3 No animated arrows

Use a static arrow or text label.

If direction needs to be emphasized, animate the destination rather than the arrow.

Example:

```text
Explore the system →
```

The arrow can remain static.

---

## 12.4 No sparkle icons

Completion should be communicated with:

- a state change;
- a checkmark if semantically necessary;
- a changed label;
- a progress state;
- a short confirmation message.

Do not decorate ordinary completion states with sparkles.

---

## 12.5 No radial orbs

Do not use floating gradient spheres as ambient decoration.

If the page needs depth, use the real 3D object, photography, or carefully placed shadows.

---

# 13. Trust and Conversion

## 13.1 Cookie consent

The cookie notice should be small and useful.

Example:

```text
We use essential cookies to keep the site working.
Optional analytics help us understand how people use it.

[Accept optional cookies]   [Use essential only]
```

Provide a settings link when optional categories exist.

Do not make the banner visually louder than the product.

### Security and maintenance considerations

- Default to the minimum necessary storage.
- Do not load optional analytics before consent where consent is required.
- Keep the consent state understandable.
- Do not use dark patterns such as making "Accept all" huge while hiding alternatives.

---

## 13.2 CTA hierarchy

Use three levels.

### Primary

The action that matters most:

> Buy the device

### Secondary

A lower-commitment action:

> See how it works

### Tertiary

A low-emphasis action:

> Read the details

Visual hierarchy:

```text
[ Buy the device ]

See how it works

Read the details
```

Do not put three equally large buttons beside each other.

---

# 14. Testimonials

Do not use fake testimonials.

If real testimonials are not available, use other forms of evidence:

- measured results;
- product testing;
- customer logos where permission exists;
- photographs;
- quotes from verified customers;
- published reviews;
- demonstration footage.

Label evidence honestly.

Never invent a person, job title, company, or quote to make the site look established.

### AI-slop trap

The pattern to avoid:

> "This product changed everything for our team."  
> — Sarah, Founder at FutureTech

If the person and quote do not exist, it damages trust.

---

# 15. Legal Pages

The requested design direction does not need to advertise legal pages in the primary navigation.

However, do **not** interpret that as permission to omit legally required privacy or terms information.

If the site collects personal data, analytics, account information, payments, or other regulated information, the legal requirements should be reviewed for the jurisdictions in which the product operates.

A clean footer can keep legal links quiet without making them part of the marketing story.

---

# 16. Motion System

Motion should have a job.

Use three categories.

## 16.1 Entry motion

Used once.

Purpose:

> Establish the product's physical presence.

Example:

```text
opacity 0 → 1
scale 0.94 → 1
translateY 24px → 0
```

---

## 16.2 Interaction motion

Used in response to the user.

Purpose:

> Confirm that the interface is responding.

Examples:

- button moves 1px;
- card changes border;
- product follows pointer slightly;
- selected card becomes clearer.

---

## 16.3 Scroll-linked motion

Used when scrolling changes the story.

CSS scroll-driven animations can tie animation progress directly to scroll position without requiring a JavaScript scroll handler. MDN documents both scroll-progress and view-progress timelines. citeturn0search1turn0search2

Use this for:

- product rotation;
- image reveal;
- section progress;
- typography movement.

Do not use it for every object.

### Performance note

Scroll-driven CSS can avoid some main-thread work associated with JavaScript scroll listeners. citeturn0search2

---

# 17. Accessibility

Accessibility is part of the visual system.

## 17.1 Reduced motion

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For the 3D scene, disable continuous rotation and pointer parallax when reduced motion is enabled.

---

## 17.2 Keyboard support

The feature deck must work without a mouse.

Support:

- Tab
- Enter
- Space
- ArrowLeft
- ArrowRight
- Escape where applicable

Do not make the 3D model itself the only way to understand the product.

---

## 17.3 Screen readers

Provide an accessible description:

```html
<canvas aria-hidden="true"></canvas>

<div class="sr-only">
  Three-dimensional view of the product showing its main sensing surface.
</div>
```

If the 3D object communicates information, that information must exist as real text elsewhere.

---

# 18. 3D Performance Budget

Set a budget before modeling the site.

A reasonable starting target:

| Area | Target |
|---|---:|
| Initial JS for marketing UI | Keep as small as practical, ideally < 150 KB compressed |
| Hero model | Prefer < 5 MB compressed |
| Textures | Prefer 1K where visually sufficient |
| Desktop target | 60 FPS |
| Mid-range mobile | 30–60 FPS |
| Main-thread work | Avoid continuous expensive work |
| Number of lights | Keep low |
| Draw calls | Keep low |
| 3D scene | One focused hero scene |

These are working targets, not universal laws. The real target should be measured on representative devices.

---

# 19. 3D Optimization

## 19.1 Geometry

Use optimized GLTF/GLB.

Reduce:

- unnecessary polygons;
- duplicate meshes;
- invisible geometry;
- excessive material count.

---

## 19.2 Textures

Prefer compressed textures where supported.

Do not ship a 4K texture if a 1K texture looks identical at the displayed size.

---

## 19.3 Lighting

Use a small lighting setup.

For a product hero:

- one key light;
- one soft fill;
- optional rim light;
- restrained environment lighting.

Do not use ten dynamic lights.

---

## 19.4 Render resolution

Do not always render at full device pixel ratio.

For example:

```js
const dpr = Math.min(window.devicePixelRatio, 1.5);
```

A high-density phone can otherwise multiply GPU work substantially.

---

## 19.5 Visibility

If the 3D model is below the fold, pause rendering when it is not visible.

Use `IntersectionObserver` or scene visibility state.

---

# 20. Recommended Technology Stack

Keep the stack intentionally small.

## Recommended

```text
React
TypeScript
Vite or Next.js
React Three Fiber
Three.js
CSS Modules or plain CSS
GSAP only where complex scroll choreography is genuinely required
Native CSS Scroll Snap for the feature deck
```

### Why this stack

- React provides component structure.
- TypeScript reduces maintenance errors.
- React Three Fiber integrates 3D with UI state.
- Three.js provides the rendering layer.
- CSS handles most visual behavior.
- Native scroll snap avoids unnecessary carousel dependencies.
- GSAP is reserved for sequences that CSS cannot express comfortably.

Do not install a library simply because it can animate something that CSS already handles.

---

# 21. File Structure

A maintainable structure:

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.ts
│
├── components/
│   ├── navigation/
│   │   └── Navigation.tsx
│   ├── hero/
│   │   ├── Hero.tsx
│   │   ├── HeroModel.tsx
│   │   └── HeroCopy.tsx
│   ├── product-demo/
│   │   ├── ProductDemo.tsx
│   │   └── DemoControls.tsx
│   ├── feature-deck/
│   │   ├── FeatureDeck.tsx
│   │   ├── FeatureCard.tsx
│   │   └── FeatureControls.tsx
│   ├── pricing/
│   │   └── Pricing.tsx
│   └── consent/
│       └── CookieConsent.tsx
│
├── three/
│   ├── ProductScene.tsx
│   ├── ProductModel.tsx
│   ├── lights.ts
│   └── materials.ts
│
├── hooks/
│   ├── useReducedMotion.ts
│   ├── usePointerParallax.ts
│   └── useScrollProgress.ts
│
├── styles/
│   ├── tokens.css
│   ├── globals.css
│   └── typography.css
│
└── content/
    ├── features.ts
    └── pricing.ts
```

Keep product content outside rendering components where possible.

---

# 22. Custom Three-Element Scrolling UI From Scratch

This section defines a reusable three-element scrolling component without depending on a carousel library.

The component can be used for:

- three product capabilities;
- three product demonstrations;
- three use cases;
- three stages in a process.

---

## 22.1 Fundamental architecture

The component has five layers:

```text
Scroller
│
├── State
│   ├── activeIndex
│   ├── scrollProgress
│   └── interaction state
│
├── Viewport
│   └── horizontal overflow container
│
├── Items
│   ├── Item 0
│   ├── Item 1
│   └── Item 2
│
├── Controls
│   ├── Previous
│   ├── Next
│   └── Position indicators
│
└── Accessibility
    ├── keyboard
    ├── labels
    └── reduced motion
```

The important design decision is to make the browser's scrolling system do most of the work.

---

# 23. HTML Structure

```html
<section
  class="feature-scroller"
  aria-labelledby="feature-title"
>
  <div class="feature-scroller__header">
    <p>What it does</p>
    <h2 id="feature-title">Three parts of the experience.</h2>
  </div>

  <div class="feature-scroller__viewport">
    <ol class="feature-scroller__track">
      <li class="feature-card" id="feature-1">
        <span>01</span>
        <h3>Capture</h3>
        <p>The system observes the signal.</p>
      </li>

      <li class="feature-card" id="feature-2">
        <span>02</span>
        <h3>Interpret</h3>
        <p>The signal becomes useful information.</p>
      </li>

      <li class="feature-card" id="feature-3">
        <span>03</span>
        <h3>Respond</h3>
        <p>The result becomes something you can act on.</p>
      </li>
    </ol>
  </div>

  <div class="feature-scroller__controls">
    <button type="button">Previous</button>
    <button type="button">Next</button>
  </div>
</section>
```

---

# 24. CSS Scroll-Snap Implementation

```css
.feature-scroller__viewport {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.feature-scroller__viewport::-webkit-scrollbar {
  display: none;
}

.feature-scroller__track {
  display: flex;
  gap: 24px;
  padding:
    0
    max(24px, calc((100vw - 1200px) / 2));
}

.feature-card {
  flex: 0 0 min(78vw, 720px);
  scroll-snap-align: center;
}
```

Native scroll snapping gives users touch scrolling without requiring a gesture library. MDN documents the core `scroll-snap-type`, `scroll-snap-align`, `scroll-padding`, and `scroll-margin` properties. citeturn0search3turn0search12

---

# 25. State Management

For three items, keep state local.

```ts
type FeatureIndex = 0 | 1 | 2;

const [activeIndex, setActiveIndex] =
  useState<FeatureIndex>(0);
```

You do not need Redux or a global state manager.

Track:

```text
activeIndex
scrollLeft
isDragging
isAnimating
```

Only introduce more state when the interaction actually requires it.

---

# 26. Detecting the Active Element

There are two good approaches.

## Approach A: IntersectionObserver

Observe the three cards and select the one with the highest visibility.

This is simple and broadly compatible.

## Approach B: Scroll Snap Events

Modern browsers expose `scrollsnapchange` and `scrollsnapchanging`, which can identify the pending and selected snap target. citeturn0search5

Example:

```js
viewport.addEventListener("scrollsnapchange", (event) => {
  const target = event.snapTargetInline;

  if (!target) return;

  const index = Number(
    target.getAttribute("data-index")
  );

  setActiveIndex(index);
});
```

Because support can vary by browser generation, use feature detection and retain an IntersectionObserver fallback.

---

# 27. Previous and Next Controls

Keep the logic simple.

```ts
function goTo(index: number) {
  const element = items[index];

  element?.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "nearest",
    inline: "center"
  });
}
```

Then:

```ts
function next() {
  goTo(Math.min(activeIndex + 1, 2));
}

function previous() {
  goTo(Math.max(activeIndex - 1, 0));
}
```

Disable controls at the boundaries rather than wrapping automatically.

This avoids surprising users.

---

# 28. Touch and Mouse Interaction

Native scrolling should be the default.

Do not manually implement touch scrolling unless there is a specific interaction that requires it.

### Touch

The browser handles:

- finger movement;
- momentum;
- overscroll;
- platform-specific gestures.

Use:

```css
touch-action: pan-x;
```

only when appropriate.

### Mouse

Desktop users can:

- use a trackpad;
- use a mouse wheel;
- drag if you explicitly implement dragging;
- use navigation buttons.

If you implement pointer dragging, do not interfere with normal click behavior.

---

# 29. Pointer Dragging

For a custom drag mode:

```ts
let startX = 0;
let startScroll = 0;

function onPointerDown(event: PointerEvent) {
  startX = event.clientX;
  startScroll = viewport.scrollLeft;

  viewport.setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!viewport.hasPointerCapture(event.pointerId)) {
    return;
  }

  const distance = event.clientX - startX;
  viewport.scrollLeft = startScroll - distance;
}
```

But test this carefully before shipping.

A native scroll container often feels better than a custom implementation.

---

# 30. Animation Strategy

Do not animate every card independently.

Use a simple state transition:

```css
.feature-card {
  opacity: 0.55;
  transform: scale(0.97);
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.feature-card[data-active="true"] {
  opacity: 1;
  transform: scale(1);
}
```

This creates hierarchy without making the interface feel like a carousel advertisement.

---

# 31. Responsive Behavior

## Desktop

Show approximately 1.2 cards:

```text
[ active card ][ next card partially visible ]
```

This hints that more content exists.

## Tablet

Show one card with a smaller preview.

## Mobile

Use almost the entire viewport width:

```css
.feature-card {
  flex-basis: calc(100vw - 32px);
}
```

Do not shrink text to preserve desktop layouts.

Reflow instead.

---

# 32. Virtualization and Lazy Loading

With only three cards, virtualization is unnecessary.

This is important.

Do not add virtualization just because it sounds like a performance technique.

### When virtualization becomes appropriate

Use it for:

- hundreds of cards;
- long media lists;
- large data collections;
- expensive embedded components.

For a three-item product deck, render all three.

### Lazy loading

Lazy-load:

- below-the-fold video;
- large images;
- secondary 3D scenes.

Do not lazy-load the main hero object so aggressively that the page appears broken.

---

# 33. Performance Rules for the Scroller

Prefer:

```css
transform
opacity
scroll-snap
scroll-behavior
```

Avoid animating:

```text
width
height
top
left
box-shadow at high frequency
filter blur at high frequency
```

When JavaScript is needed, batch work with `requestAnimationFrame`.

Do not perform expensive calculations on every raw `scroll` event.

---

# 34. CSS Scroll-Driven Animation

For supported browsers, CSS can connect animation progress to scroll progress.

Example:

```css
@keyframes reveal {
  from {
    opacity: 0.4;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 35%;
}
```

CSS scroll-driven animations are designed specifically for this relationship between scrolling and animation. citeturn0search1turn0search11

Use feature detection and provide a normal static presentation where unsupported.

---

# 35. Libraries and Tools

## 35.1 GSAP + ScrollTrigger

### Purpose

Advanced timeline and scroll-based animation.

### Key features

- timeline sequencing;
- pinning;
- scrubbing;
- snapping;
- scroll triggers;
- complex choreography.

ScrollTrigger supports scrub, pin, snap, and trigger-based animation. citeturn0search10

Official documentation:

urlGSAP ScrollTrigger documentationhttps://gsap.com/docs/v3/Plugins/ScrollTrigger/

### Use it when

The design contains a genuine sequence that is difficult to express with CSS.

### Integration complexity

Medium.

### Trade-offs

It adds another animation abstraction. Do not use it for simple fades and transforms that CSS can already handle.

---

## 35.2 Lenis

### Purpose

Smooth scrolling behavior.

Official site:

urlLenishttps://lenis.darkroom.engineering/

### Use it when

The entire site genuinely benefits from a controlled scrolling feel.

### Avoid it when

Native scrolling already feels good.

Smooth scrolling can introduce complexity around:

- accessibility;
- browser behavior;
- scroll-linked components;
- touch interaction;
- reduced motion.

Do not add Lenis simply because smooth scrolling is fashionable.

---

## 35.3 Locomotive Scroll

### Purpose

Scroll effects and smooth-scrolling experiences.

### Use it when

A project is specifically designed around its scroll abstraction.

### Trade-offs

It introduces another scrolling model. This can make integrations with browser-native scroll behavior, accessibility, and other scroll APIs more complicated.

For a new project, first ask whether CSS scroll snap and CSS scroll-driven animation are enough.

---

## 35.4 Swiper.js

### Purpose

Touch-friendly sliders and carousels.

Official documentation:

urlSwiper documentationhttps://swiperjs.com/

### Use it when

You need:

- touch gestures;
- pagination;
- navigation;
- looping;
- responsive slides;
- established carousel behavior.

### Integration complexity

Low to medium.

### Trade-off

It solves many problems, but also brings a component model and configuration surface that may be unnecessary for three cards.

For this project, use native scroll snap first.

---

## 35.5 Flickity

### Purpose

Responsive draggable carousels.

Official documentation:

urlFlickity documentationhttps://flickity.metafizzy.co/

### Use it when

The interaction genuinely benefits from a carousel abstraction.

### Trade-offs

It is another dependency to maintain, and its feature set may be excessive for a simple three-card scroller.

---

## 35.6 fullPage.js

### Purpose

Section-based full-screen scrolling.

Official documentation:

urlfullPage.js documentationhttps://alvarotrigo.com/fullPage/

### Use it when

The entire website is intentionally organized as a controlled sequence of full-screen panels.

### Avoid it when

The site needs conventional browser scrolling.

For a marketing site, normal scrolling is generally more accessible and predictable.

---

## 35.7 react-scroll

### Purpose

React utilities for scrolling to page sections.

### Use it when

Navigation needs to move to known sections with simple behavior.

### Trade-off

It should not become the foundation of an elaborate scrolling engine.

For simple anchor navigation, native links and `scroll-behavior: smooth` may be enough.

---

## 35.8 react-spring

### Purpose

Physics-based animation.

Official documentation:

urlReact Spring documentationhttps://react-spring.dev/

### Use it when

An interaction benefits from spring physics:

- cards following a pointer;
- physical-feeling transitions;
- draggable elements.

### Avoid it when

A basic CSS transition is sufficient.

---

# 36. Tool Selection Matrix

| Requirement | First choice | Alternative |
|---|---|---|
| Basic feature deck | CSS Scroll Snap | Swiper |
| Simple reveal | CSS | Framer Motion |
| Scroll-linked reveal | CSS Scroll-Driven Animation | GSAP |
| Complex scroll sequence | GSAP ScrollTrigger | CSS |
| 3D product scene | React Three Fiber | Spline |
| Physics interaction | React Spring | CSS |
| Simple anchor navigation | Native CSS/HTML | react-scroll |
| Full-screen section system | fullPage.js | Native scroll |
| Smooth scrolling | Native scroll | Lenis |
| Large media carousel | Swiper | Flickity |

The best stack is not the stack with the most libraries.

---

# 37. Security and Maintenance

Even though the website is marketing-focused, maintainability still matters.

## 37.1 Keep third-party scripts limited

Every third-party script can affect:

- performance;
- privacy;
- availability;
- security;
- maintenance.

Do not install analytics, chat widgets, animation libraries, and marketing scripts by default.

Add them only when there is a clear requirement.

---

## 37.2 Keep 3D assets local where practical

Self-host:

- GLB/GLTF assets;
- fonts where licensing permits;
- critical images.

This improves predictability and reduces third-party dependency.

---

## 37.3 Content/data separation

Keep pricing and feature copy in data files:

```ts
export const features = [
  {
    number: "01",
    title: "Capture",
    description: "..."
  },
  {
    number: "02",
    title: "Interpret",
    description: "..."
  },
  {
    number: "03",
    title: "Respond",
    description: "..."
  }
];
```

This makes future content changes less risky.

---

# 38. Suggested Page Structure

A clean page can follow this sequence:

```text
01  Navigation

02  Hero
    Product
    One clear promise
    Primary CTA
    3D object

03  Proof
    One real result
    One real image
    One concise statement

04  How it works
    Three-step sequence

05  Product demonstration
    Real interaction

06  Feature deck
    Three cards

07  Product detail
    Real specifications
    Real photographs

08  Pricing
    Only if applicable

09  Evidence
    Real customers / measurements / reviews

10  Final CTA

11  Minimal footer
```

This creates a narrative rather than a collection of decorative sections.

---

# 39. Clean Copy Direction

Avoid phrases such as:

- "The future of..."
- "Built for the modern..."
- "Unlock your potential"
- "Transform your workflow"
- "Next-generation"
- "Seamless"
- "Revolutionary"
- "Powerful yet simple"
- "Built different"
- "AI-powered" unless AI is actually the meaningful product feature.

Prefer statements that identify the product.

### Hero example

**Headline**

> Know what the signal is doing.

**Supporting copy**

> A compact sensing system that turns movement and pulse data into information you can understand at a glance.

**Primary CTA**

> See the product

**Secondary CTA**

> How it works

### Feature example

**Capture**

> The device records the signal continuously.

**Interpret**

> Changes are converted into readable measurements.

**Respond**

> The result gives you a clear next step.

The exact copy should be rewritten around the real product once its capabilities and audience are known.

---

# 40. What Makes This Design Feel Human

A human-designed site usually has evidence of decisions.

That means:

- one unusual but useful layout decision;
- a deliberate type pairing;
- real product imagery;
- a restrained color system;
- meaningful motion;
- content with specific nouns and verbs;
- asymmetry where it helps composition;
- fewer components;
- fewer effects;
- fewer badges;
- fewer invented claims.

The goal is not to make the website look "different" through decoration.

The goal is to make it look **specific to the product**.

---

# 41. AI-Slop Avoidance Checklist

Before shipping, ask:

### Visual

- [ ] Is the background more distinctive than pure white?
- [ ] Is there one recognizable brand color?
- [ ] Have decorative gradients been removed?
- [ ] Are shadows used only where depth matters?
- [ ] Are cards allowed to have different visual treatments?

### Typography

- [ ] Does the typography have a recognizable voice?
- [ ] Is the hero headline about the actual product?
- [ ] Are headings short enough to understand immediately?

### Layout

- [ ] Does the layout look like it belongs to this product?
- [ ] Is there no unnecessary bento grid?
- [ ] Is the 3D object helping explain the product?
- [ ] Does the page still make sense when motion is disabled?

### Components

- [ ] Are icons used only where they add meaning?
- [ ] Is there no fake terminal?
- [ ] Is there no decorative sparkle system?
- [ ] Is there no neon glow system?
- [ ] Are product demonstrations real?
- [ ] Are testimonials real?

### Motion

- [ ] Does every animation have a purpose?
- [ ] Is reduced motion supported?
- [ ] Does the page remain usable on a low-power device?
- [ ] Is the 3D scene paused when it is not needed?

### Trust

- [ ] Are claims verifiable?
- [ ] Are prices real?
- [ ] Are testimonials authentic?
- [ ] Is consent handled honestly?
- [ ] Are required legal disclosures available?

---

# 42. Final Recommended Stack

For this specific direction:

```text
React
TypeScript
React Three Fiber
Three.js
Native CSS
CSS Scroll Snap
CSS Scroll-Driven Animations
GSAP + ScrollTrigger only for complex sequences
React Spring only for genuine spring interactions
IBM Plex Sans
IBM Plex Serif
IBM Plex Mono
```

Do not add:

```text
A UI kit just for cards
A carousel library for three items
A smooth-scroll library by default
A fake terminal component
A gradient background system
A neon glow system
A decorative dot-grid system
A testimonial generator
A collection of unnecessary icon libraries
```

The resulting site should feel like a product presentation with a strong visual identity, not a showcase of frontend techniques.

---

# 43. Resource List

## 3D

- urlThree.js documentationhttps://threejs.org/docs/
- urlReact Three Fiber documentationhttps://r3f.docs.pmnd.rs/
- urlSpline documentationhttps://docs.spline.design/

## Motion

- urlGSAP ScrollTrigger documentationhttps://gsap.com/docs/v3/Plugins/ScrollTrigger/
- urlMotion documentationhttps://motion.dev/
- urlReact Spring documentationhttps://react-spring.dev/

## Scrolling

- urlMDN CSS Scroll Snaphttps://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap
- urlMDN CSS Scroll-Driven Animationshttps://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- urlLenishttps://lenis.darkroom.engineering/
- urlSwiperhttps://swiperjs.com/
- urlFlickityhttps://flickity.metafizzy.co/
- urlfullPage.jshttps://alvarotrigo.com/fullPage/

## Implementation principle

Start with browser primitives.

Add a library only when the primitive is no longer sufficient.

That single rule will keep the project faster, easier to maintain, and much less likely to drift into the generic "AI slop" visual language.
