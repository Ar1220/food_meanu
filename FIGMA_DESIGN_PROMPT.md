# Figma Design Prompt — "Dilite" Food Menu & Ordering App
### MongoDB project · inspired by pizzadilitebidholi.vercel.app, but rebuilt to look edible, premium and a little bit dangerous

---

## 0. THE BRIEF IN ONE PARAGRAPH

Design a full **food ordering experience** for a neighbourhood pizza kitchen serving hostel students in
**Bidholi, Dehradun**. Dark, warm, cinematic — the reference site's bones, but taken from "decent
college site" to "I want to eat off the screen". Food photography is the hero. Type is loud. Motion is
buttery. It must feel **premium but affordable**, because the customer is a broke, hungry 20-year-old at
11:40 PM deciding between ₹140 and ₹200.

**Deliver:** Home → Menu → Item detail → Cart → Checkout → Order success → Live order tracking →
Order history → Admin dashboard. Every screen designed, plus an interactive prototype.

**Not a static menu.** There is a real cart, a real checkout, and a real order record. Design for that.

---

## 1. PERSONALITY & ART DIRECTION

| Axis | Direction |
|------|-----------|
| Mood | Warm, moody, appetite-driven. "Late-night kitchen with the lights low." |
| Reference mix | Modern food apps (Swiggy/Zomato clarity) × craft pizzeria sites (dark, editorial) × streaming-service polish |
| Do | Deep charcoal, cream type, ember-orange accents, close-up food, generous whitespace, oversized headings |
| Don't | Flat white e-commerce, stock-photo clip art, emoji as icons, purple SaaS gradients, tiny grey text |

**Three words the whole file must obey:** **WARM · BOLD · EDIBLE.**

---

## 2. COLOR SYSTEM (exact tokens — build a Figma color styles set with these names)

### Core
| Token | Hex | Use |
|-------|-----|-----|
| `bg/base` | `#141110` | Page background (warm near-black, NOT pure black) |
| `bg/raised` | `#1C1815` | Cards, sheets, nav bar |
| `bg/sunken` | `#0D0B0A` | Footer, image letterboxing |
| `line/subtle` | `#2A2421` | 1px dividers, card borders at rest |
| `line/strong` | `#3A322D` | Input borders, hover borders |
| `text/primary` | `#F6F1EE` | Headings, item names (warm off-white) |
| `text/secondary` | `#B3A9A3` | Descriptions, meta |
| `text/muted` | `#7A706A` | Placeholders, timestamps |

### Accent — "ember"
| Token | Hex | Use |
|-------|-----|-----|
| `ember/500` | `#FF6B2C` | Primary buttons, active tabs, prices, CTA |
| `ember/600` | `#E85518` | Pressed state |
| `ember/400` | `#FF8A52` | Hover glow, icon accents |
| `ember/tint` | `rgba(255,107,44,0.12)` | Active chip fill, highlight rows |

### Support
| Token | Hex | Use |
|-------|-----|-----|
| `support/veg` | `#3FA34D` | Veg indicator square + dot |
| `support/nonveg` | `#C0392B` | Non-veg indicator square + dot |
| `support/gold` | `#E8B24A` | Ratings, "Bestseller" ribbon |
| `support/danger` | `#D94A3D` | Errors, remove-from-cart |
| `support/success` | `#3FA34D` | Order placed check, step complete |

**Rule:** ember is the *only* saturated colour allowed above 20% coverage. Everything else is warm
neutrals. One accent used well reads expensive; three accents read cheap.

### Gradients & effects
- Hero scrim: `linear-gradient(180deg, rgba(20,17,16,0) 0%, rgba(20,17,16,0.75) 65%, #141110 100%)`
- Card image hover scrim: `linear-gradient(0deg, rgba(13,11,10,0.85), transparent 60%)`
- Ember glow (buttons): `0 8px 28px rgba(255,107,44,0.28)`
- Glass panel (cart drawer / sticky bars): `rgba(28,24,21,0.82)` + `backdrop-filter: blur(18px)` + 1px `line/subtle`

---

## 3. TYPOGRAPHY

**Display / headings:** `Clash Display` or `Bricolage Grotesque` (fallback: Satoshi, General Sans).
Tight tracking (-2%), heavy weights (600–700). Headings are *huge* on desktop.

**UI / body:** `Inter` or `Satoshi` (fallback: system sans). 400–600 weight.

**Numbers (prices, order totals, timers):** `JetBrains Mono` or Inter with `font-variant-numeric: tabular-nums`.
Prices must never jiggle when they change.

| Style | Desktop | Mobile | Weight | Notes |
|-------|---------|--------|--------|-------|
| Display XL | 88 / 92px | 44 / 46px | 700 | Hero headline, -2% tracking |
| Display L | 56 / 60px | 34 / 38px | 700 | Section titles ("The Menu") |
| Display M | 32 / 36px | 26 / 30px | 600 | Card group heads |
| Title | 22px | 20px | 600 | Item names in cards |
| Body | 16 / 26px | 15 / 24px | 400 | Descriptions, max 68ch |
| Label | 13px | 13px | 600 | Uppercase, +8% tracking, buttons & tabs |
| Caption | 12px | 12px | 500 | Meta, timestamps, helper text |
| Price L | 28px | 24px | 700 | Item price, monospace-feel |

---

## 4. LAYOUT, GRID, RHYTHM

- **Desktop canvas:** 1440 × variable height. 12-col grid, 24px gutters, **80px side margins**.
- **Content max-width:** 1280px, centred. Menu grid may bleed wider on ≥1600px.
- **Tablet:** 834 wide, 8-col, 20px gutters, 40px margins.
- **Mobile:** 390 wide, 4-col, 16px gutters, 20px margins.
- **8px spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding: **96px** desktop / **64px** mobile.
- **Radii:** cards 20px, buttons 999px (pill) or 14px, inputs 12px, sheets 24px top corners, images 16px.
- **Elevation:** only two shadows exist — `0 1px 0 line/subtle` for resting cards and the ember glow for CTAs. No soft grey drop-shadows.

---

## 5. SCREEN-BY-SCREEN SPEC

### 5.1 HOME / LANDING (the "mouth-water" screen)

**Fixed top nav** (height 72px, transparent → `bg/base` + blur after 24px scroll):
- Left: wordmark **DILITE** in display face, 22px, with a small ember dot after the "E".
- Centre: links — Menu · Offers · Track order · Contact (16px, `text/secondary`, hover → `text/primary` + ember 2px underline slide-in).
- Right: **Cart button** — pill, `bg/raised`, ember outline, cart icon + badge count + running total (`₹480`). Badge pulses once when an item is added.
- Mobile: hamburger left, wordmark centre, cart icon right.

**Hero (100vh, min 720px):**
- Full-bleed **food photograph** — pizza pulled from the oven, cheese stretch, steam. Dark on the right
  third of the frame so type sits in the empty space. Never a busy photo behind text.
- Eyebrow: `BIDHOLI · DEHRADUN` — 13px, uppercase, +8% tracking, ember, with a 24px ember rule to its left.
- Headline (Display XL): **"Hot. Late. Yours."** — three words on three lines is fine. Optional second
  line in `text/secondary` at 40% size: *"at your hostel door in 30 minutes."*
- Sub: 18px, `text/secondary`, max 46ch — *"Wood-fired pizza, pasta and late-night snacks from the
  kitchen on Bidholi main road."*
- Primary CTA: **"Order now"** — ember pill, 56px tall, 24px padding, arrow icon that slides 4px on hover.
- Secondary CTA: ghost text button **"See the menu ↓"**.
- Bottom-left: live status chip — green pulsing dot + `Kitchen open · closes 2:00 AM` (or red + `Closed · opens 11 AM`).
- Bottom-right: `4.7 ★ · 1.2k orders this month` in caption style.
- Scroll cue: thin vertical ember line that animates down, 1.5s loop.

**Offer strip** (below hero, full-bleed `bg/raised`, 64px tall): marquee-style, 3 offers scrolling
slowly, separated by ember diamonds. Example: *Order 1 Large, get 1 regular FREE* · *Free delivery over ₹399* ·
*Student combo ₹249*.

**"The Menu" section:**
- Section head: Display L **"The Menu"** left, and right-aligned `18 items · veg & non-veg`.
- **Category rail** (sticky under nav, 56px): pill tabs — `All · Veg · Non-veg · Pizza · Pizza Mania ·
  Pasta · Burgers · Sandwiches · Rolls · Wraps · Garlic Bread · Tacos · Zingy Parcel · Sides · Shakes`.
  Rest: `bg/raised` + `text/secondary`; Active: ember fill, near-black text, ember glow.
  Horizontally scrollable on mobile with edge fade, no scrollbar. Sticky rail gets a bottom hairline
  and slight blur.
- **Menu grid:** 3 columns ≥1280px, 2 at 834px, 1 on mobile. 32px gaps.

**Item card (the most important component — design 5 states):**
```
┌──────────────────────────┐
│  [ food photo 4:3 ]      │  ← veg/non-veg square badge top-left,
│                    ★ BEST│    gold "BESTSELLER" ribbon top-right (optional)
├──────────────────────────┤
│ Cheese & Onion           │  Title 22/600
│ Cheese, onion, mozzarella│  Body 15, text/secondary, 2 lines max, ellipsis
│ ⏱ 25 min · 7" / 10" / 13"│  Caption, muted
│ FROM ₹120        [ Add ] │  Price L (ember) left, ember pill button right
└──────────────────────────┘
```
States: **rest** (border `line/subtle`, image full colour) · **hover** (image scales 1.04 inside
overflow-hidden frame over 400ms, border → `line/strong`, card lifts 2px, Add button fills solid ember)
· **pressed** (scale 0.995) · **added** (Add → `1 in cart ✓`, two small stepper buttons `−`/`+` appear,
ember tint fills card background at 8%) · **unavailable** (image 40% opacity + grayscale, `Sold out`
chip, button disabled).

**"Why Dilite" band** (3 columns, `bg/sunken`): 30-min delivery · wood-fired oven · hostel-friendly
pricing. Each with a thin-line ember icon, headline, one sentence. No emoji.

**Story band:** two-column, image left (kitchen/oven, warm and grainy), text right — short paragraph in
Display M + body about the kitchen on Bidholi main road. Include a quiet quote line:
*"Do good. Be nice. Order pizza. Repeat."* in italic display type with ember quotation mark.

**Footer** (`bg/sunken`, 4 columns + bottom bar):
Brand + tagline · Menu links · Contact (both phone numbers, tap-to-call, WhatsApp button in `support/success`) ·
Hours + address + a simple map tile with ember pin. Bottom bar: `© 2025 Dilite · Bidholi, Dehradun` +
`Privacy · Terms`. Include an honest note: *"Prices include taxes. Delivery charged at checkout."*

---

### 5.2 ITEM DETAIL / CUSTOMISE SHEET

Triggered by clicking any card. Two presentations — design **both**:
1. **Desktop: centred modal** (720px wide) with the food photo on the left half.
2. **Mobile: bottom sheet** (slides up, 92% height, drag handle, image top).

Contents: large food image with ember-badge for veg/non-veg · title + description (full) ·
**Size selector** as 3 large radio cards — Small 7" / Medium 10" / Large 13" — each showing price delta
(`₹120`, `₹180`, `₹240`), selected card gets ember border + tint · **Add-ons** as checkbox rows with
prices (extra cheese ₹30, jalapeños ₹20, extra chicken ₹60) · **Quantity stepper** (− 1 +) 48px tall ·
sticky bottom bar with **"Add to cart — ₹210"** where the total updates live in ember.
Also a tiny `ⓘ` row: *"Prepared in a kitchen that handles dairy, gluten and nuts."*

### 5.3 CART DRAWER (desktop, right side, 420px) / FULL CART PAGE (mobile)

Glass panel sliding from right, 18px blur, hairline left border.
- Header: **"Your order"** + item count + `Clear` (danger text button, opens a confirm popover).
- Line items: 64px thumbnail, name, size note, unit price, stepper, line total (monospace), remove X on hover.
- Divider, then a summary block: `Subtotal`, `Delivery` (₹30 / FREE over ₹399 in `support/success`),
  `Taxes included`, then **Total** in Price L, ember.
- Free-delivery progress: thin bar `₹248 of ₹399` that fills ember as items are added, caption below.
- **"Checkout"** ember pill, full width, 56px.
- Empty state: a line illustration of an empty pizza box, headline *"Nothing in here yet"*, body
  *"The menu is right there."*, ghost button "Browse menu".

### 5.4 CHECKOUT

Single column, 640px max, on `bg/base`, with a sticky order-summary card on the right at ≥1024px.

Sections as numbered steps (1 Delivery details · 2 Payment · 3 Confirm) with a thin ember progress
line that fills as the user scrolls. Each step is a card on `bg/raised`, 24px radius.

**Step 1 — Delivery details:** Name · Phone (with `+91` prefix, validated, monospace digits) ·
Hostel / address block: `Hostel` select (A/B/C/D/Girls/Warden/Day Scholar/Other) + `Room number` +
`Landmark` textarea. Plus a "Deliver now / Schedule" segmented control (schedule shows date + time-slot
pills: `12:00–12:30`, `19:00–19:30`, `22:00–22:30`…). Helper text under each field, inline validation —
error state = `support/danger` 1px border + 12px message, never a red fill.

**Step 2 — Payment:** three radio cards — **Cash on delivery** · **UPI** (opens a UPI ID field) ·
**Card** (disabled with a "coming soon" chip, to keep it honest). Selected card: ember border + tint + check.

**Step 3 — Confirm:** read-only summary, a `Coupon code` input with Apply button (success/error inline),
an order-notes textarea ("Extra chilli, no onion"), and the total card with `Place order — ₹480` CTA.
Under it, caption: *"You'll get a confirmation on WhatsApp."*

**Order summary card (right / sticky):** items compact list with thumbnails, subtotal, delivery,
total, and a small note of the estimated time (`~32 min`). On mobile this collapses into a tappable
"₹480 · 4 items" bar that opens the cart drawer.

### 5.5 ORDER SUCCESS

Full-screen, no nav distractions. Huge ember check drawn as stroke animation, then:
- Display L: **"Order placed."**
- Order number in monospace `#DLT-2481` with a copy icon.
- ETA card: `Arriving by 12:18 AM` + a thin animated ember progress line.
- Two CTAs: **"Track order"** (solid) and **"Back to menu"** (ghost).
- Confetti? No. A single ember ring pulse is classier.

### 5.6 LIVE ORDER TRACKING

Timeline, vertical on mobile / horizontal stepper on desktop — 4 steps:
`Order received → In the kitchen → Out for delivery → Delivered`.
Completed steps: ember filled node + tick, connecting line ember. Current: pulsing node.
Pending: `line/subtle` node. Under each step, a timestamp in caption grey.
Add a live-total card and a `Call kitchen` / `WhatsApp` button row. A subtle "refresh" affordance with
`Updated 12s ago` caption.

### 5.7 ORDER HISTORY ("My orders")

List of cards: order number, date, item thumbnails stacked, total, status chip (colour-coded),
`Reorder` ghost button that pushes all items back into the cart. Empty state designed too.
Tabs: `Active · Past · Cancelled`.

### 5.8 ADMIN DASHBOARD (design this properly — it's the MongoDB half of the marks)

Left rail 240px, `bg/raised`, nav: Dashboard · Live orders · Menu items · Categories · Customers.
**Dashboard:** 4 stat cards (today's revenue, orders today, avg order value, top item) with ember
sparkline accents; a bar chart of last 7 days; "busiest hours" heat strip.
**Live orders board:** kanban — `New → Preparing → Out for delivery → Delivered` — draggable cards
showing `#DLT-2481 · ₹480 · 4 items · Hostel B · Room 214` + elapsed timer that turns ember after 20 min.
**Menu items table:** image thumb, name, category chip, veg badge, price, availability toggle, edit/delete
row actions, "Add item" primary button → drawer form (name, category, veg/non-veg, description, base
price, sizes, image upload dropzone, availability switch).
All admin screens use the same dark tokens — do not switch to a light theme.

---

## 6. COMPONENT LIBRARY (build as Figma components with variants)

`Button` — variants: primary / secondary / ghost / danger × sm / md / lg × default / hover / pressed /
loading / disabled. Loading shows a 16px ember spinner and keeps width stable.
`Tab pill` — rest / hover / active / disabled.
`Item card` — rest / hover / added / unavailable (see 5.1).
`Qty stepper` — 3 sizes, min/max states.
`Input` — rest / focus (ember ring 2px + 1px border) / filled / error / disabled, each with label,
helper and error slots.
`Radio card` (size, payment) — rest / selected / disabled.
`Checkbox row` (add-on) — rest / checked / disabled.
`Badge` — veg / non-veg / bestseller / sold out / status (new, preparing, delivered, cancelled).
`Drawer / Sheet` — closed / open / dragging.
`Toast` — success / error / info, bottom-centre mobile, top-right desktop, with undo on "removed".
`Skeleton` — card, list row, detail (shimmer sweeping left→right).
`Empty state` — 5 illustrations: empty cart, no orders, no results, offline, error.
`Nav` — top transparent / scrolled / mobile.
`Stat card`, `Order row`, `Kanban card` for admin.

Naming: `Component/State/Size` e.g. `Button/Primary/Lg/Hover`. Group with Figma variants, not separate frames.

---

## 7. MOTION (spec these in the prototype)

| Interaction | Spec |
|---|---|
| Card hover | image `scale 1.04`, 400ms `cubic-bezier(.22,1,.36,1)` |
| Button hover | background lightens, 4px lift + ember glow, 180ms |
| Add to cart | card fills ember-tint 8%, button morphs to stepper over 220ms, cart badge pops (scale 1 → 1.18 → 1, 300ms) |
| Cart drawer | slide 420px from right, 320ms ease-out; scrim fades 20% |
| Mobile sheet | translateY 100% → 0, 340ms ease-out, with 1:1 drag tracking |
| Toast | slide up 16px + fade, 200ms; auto-dismiss 3.2s |
| Scroll reveals | content fades up 24px, 600ms, staggered 60ms per card, once only |
| Page transitions | 200ms fade, no spinners between states |
| Skeleton | shimmer 1.4s infinite |
| Success check | SVG stroke-dashoffset 600ms ease-out |

Respect `prefers-reduced-motion`: disable parallax, marquee and staggers; keep opacity fades ≤120ms.

---

## 8. IMAGE DIRECTION

- Every dish needs a **real, warm-lit photo**: 3/4 angle, dark slate or wooden board, steam or cheese
  pull, shallow depth of field, warm 3000K lighting. No white-background stock shots.
- Standardise: 4:3 card crop (1200×900), 16:9 hero (2400×1350), 1:1 admin thumb.
- Food imagery must never sit under small grey text — either the scrim is strong enough or the text
  moves out of the photo.
- Use 6–8 dish photos minimum across the file so the grid looks real, not lorem.

---

## 9. ACCESSIBILITY & QUALITY BAR

- Text contrast ≥ 4.5:1 (`text/secondary` on `bg/base` passes; never use `text/muted` for body).
- Ember on near-black passes for large text/icons only — do **not** use ember for small body copy.
- All tap targets ≥ 44×44px. Focus rings: 2px ember at 3px offset, never removed.
- Every state has a non-colour cue too (veg/non-veg badge has a shape, not just colour).
- Inputs have visible labels — no placeholder-only fields.
- Design at 100% zoom, real content, no lorem ipsum in any final frame.

---

## 10. FIGMA FILE STRUCTURE & DELIVERABLES

**Pages:** `00 Cover` · `01 Foundations` (colour, type, spacing, icons) · `02 Components` ·
`03 Web` (1440) · `04 Tablet` (834) · `05 Mobile` (390) · `06 Admin` (1440) · `07 Prototype flows` ·
`08 Handoff`.

**Frames required:** Home (desktop/tablet/mobile), Menu with filter active, Item modal + mobile sheet,
Cart drawer, Cart page mobile, Checkout ×3 steps, Order success, Tracking, Order history,
Admin dashboard, Live orders board, Menu management + add-item drawer, plus empty/loading/error states.

**Prototype flows:** hero → menu → customise → cart → checkout → success → tracking, clickable end to end.

**Handoff notes:** export all tokens (colour styles + text styles), component variants, and a 1-page
spec sheet per component with measurements, states and motion timings.

---

## 11. DATA THE UI MUST SHOW (design against this — it's a MongoDB project)

| Collection | Fields the UI displays |
|---|---|
| `categories` | name, slug, order, veg-only flag |
| `items` | name, description, category, isVeg, basePrice, sizes[{label, price}], addons[{name, price}], imageUrl, isAvailable, rating, orderCount, tags[bestseller, spicy, new] |
| `orders` | orderNumber, customer{name, phone, hostel, room, landmark}, items[{itemId, name, size, qty, unitPrice, addons}], subtotal, deliveryFee, discount, total, status, estimatedTime, notes, createdAt |
| `users` | name, phone, savedAddresses[], orderCount |
| `coupons` | code, type(percent/flat), value, minOrder, isActive |

So the UI must be able to render: multiple sizes with different prices, add-ons, availability toggles,
a coupon field, order status transitions and an estimated delivery time. Design nothing that the data
can't support — and design nothing the data supports without a screen for it.

---

## 12. FINAL VIBE CHECK

Open the file at 100% and squint. It should read as **one warm, confident, expensive-looking food
brand** — not a collage. If a frame looks like a generic template with a pizza photo dropped in, redo it.

Keeper line for the whole file:

> **"Late-night kitchen energy. Studio-grade design. ₹140 price tag."**
