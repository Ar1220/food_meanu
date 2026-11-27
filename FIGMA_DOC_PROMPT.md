# Figma Prompt — Project Document for "Dilite" (paste this into Figma Make / Figma AI)

Copy everything between the lines into Figma.

---

**Task:** Design a short project document for a university submission — **A4 portrait, 1–2 pages**.
It is a *summary sheet*, not a report: bullet points only, no long paragraphs.

**Project facts (use exactly these, do not invent anything):**
- Name: **Dilite — Food Menu & Ordering System**
- What it is: a food-ordering website with a live kitchen dashboard, backed by **MongoDB**
- Tech: **React 19 + Vite + Tailwind** (front end) · **Node.js + Express** (API) · **MongoDB 9** (database)
- GitHub: **https://github.com/Ar1220/food_meanu**
- It's a small university mini project — say that plainly, don't oversell it

**Sections, in this order:**
1. **Cover block** — title, one-line description, "University mini project", GitHub link in the accent colour.
2. **What it does** — 5–6 bullets max:
   - browse an 85-dish menu, pick size + add-ons, add to cart
   - delivery form (hostel, room, landmark) → place a real order
   - order saved to MongoDB with a permanent number like `DLT-2482`
   - kitchen dashboard board: New → Preparing → Out for delivery → Delivered
   - kitchen staff advance status + mark payments, saved to the database
   - customers track an order by number and download an invoice
3. **Tech stack** — 3 short lines.
4. **Database** — small table of 5 collections: `menu_items` (85 dishes), `categories` (13),
   `orders` (one document per order), `settings` (pricing), `counters` (order numbering).
5. **How to run** — 3–4 steps (MongoDB service → `cd backend` + `npm install` + `npm run seed` + `npm start` → root `npm install` + `npm run dev`), or double-click `services.cmd`.
6. **Screenshots** — all 7, placed in this order, each with a one-line caption:
   - `02-home-hero.png` — Home page ("Hot. Late. Yours.")
   - `03-menu-and-cart.png` — Menu + cart drawer
   - `01-kitchen-dashboard.png` — Kitchen dashboard
   - `04-live-orders-board.png` — Live orders board
   - `05-order-detail-drawer.png` — Order detail drawer
   - `06-track-order.png` — Track order
   - `07-invoice-receipt.png` — Invoice / receipt
   The first image can span full width; the rest in a 2-column grid. **Import them at full
   resolution — do not crop, stretch or downscale them.** Keep captions tiny and grey.
7. **Demo video** — a section with an **auto-playing loop** of the full flow
   (order → kitchen board → track → invoice). See the video note below.
8. **Footer** — project name · Bidholi, Dehradun · the GitHub URL.

**Style:**
- Match the app: warm near-black `#141110`, cream text `#F6F1EE`, one accent **ember `#FF6B2C`**.
- Headings in a bold grotesque, body in Inter/Segoe UI, ~11pt body. Generous margins, print-safe.
- Thin orange rules under section headings, rounded corners on images, no drop shadows.
- Max ~250 words of body text in the whole document. If it gets long, cut words, not screenshots.

**Auto-play video — important:**
- Use an **animated GIF** (`demo.gif`) for the auto-playing demo. It loops by itself everywhere:
  Figma prototype preview, exported PDF, Word, GitHub — no click needed.
- Do **not** rely on an MP4 for autoplay: in Figma, MP4 autoplays only inside the prototype
  presentation (needs *Autoplay + Loop + Muted*); in an exported PDF it becomes a static frame,
  and GitHub README blocks autoplay. If an MP4 is supplied anyway, embed it with
  `autoplay muted loop playsinline` and keep the GIF as the fallback underneath the video section.

**Deliver:**
- A4 page(s), 1440 px wide frame, export-ready for PDF
- All 7 screenshots placed and legible
- GitHub link clickable
- Nothing invented — no fake metrics, no made-up features

---

## Short answer to the video question (for you, not for Figma)

- Figma prototype: MP4 **can** autoplay — set *Autoplay · Loop · Mute* on the video fill/prototype.
- Exported PDF / PNG / Word: MP4 will **not** autoplay (it becomes a still). Use a **GIF**.
- GitHub README: MP4 with `<video autoplay muted loop>` is stripped; a GIF always plays.

So: **GIF = auto-run everywhere. MP4 = only inside Figma's own preview.**
