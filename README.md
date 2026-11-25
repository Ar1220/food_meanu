# Dilite — Food Menu & Ordering (MongoDB)

A single-page food ordering app for a hostel-area pizza kitchen, with a **live kitchen dashboard**.
The **NoSQL half** of the SQL / NoSQL project pair: every dish and every order lives in **MongoDB**.

> University mini project. The dark "late-night kitchen" look is for fun — the substance is the
> document model: nested order lines, embedded price snapshots, status history, and a kitchen board
> that updates itself.

```
React 19 + Vite (5181)
        │  fetch → http://localhost:3003/api
        ▼
Express API (3003) ──mongodb driver──▶ MongoDB 9 (local service, 27017, db "dilite")
```

---

## 1. Stack & ports

| Layer | Tech | Port |
|-------|------|------|
| Site | React 19, Vite 8, Tailwind 4 | **5181** |
| API | Node 24, Express 4, mongodb driver 6 | **3003** |
| Database | MongoDB 9.0 (Windows service) | **27017** |

Ports were picked to avoid the MySQL project (3307 / 3002 / 5180) and other services on this machine.

---

## 2. Quick start

**Easiest: double-click `services.cmd`** — green/red dots per service, and a menu to start all, stop all,
view database data, open the site, or open a MongoDB shell.

```
     MongoDB 9 (Windows service)     localhost:27017  DB dilite  ●  RUNNING
     Express API                     localhost:3003              ●  RUNNING
     Site (Vite)                     localhost:5181              ●  RUNNING
```

Manual start:

```bash
# 1. MongoDB (already installed as a Windows service)
sc query MongoDB          # should say RUNNING

# 2. API + seed
cd backend
npm install
npm run seed              # 85 menu items, 13 categories, pricing, order counter
npm start                 # http://localhost:3003/api/health

# 3. Site
cd ..
npm install
npm run dev               # http://localhost:5173 by default (5500/5181 if taken)
```

Open the site → add dishes → checkout → **Place order**.
Then scroll to the footer → **Kitchen dashboard** → the order is already on the board.

### Scripts
| Command | What it does |
|---------|--------------|
| `npm run seed` | Re-seed menu + categories + pricing (keeps existing orders) |
| `npm run seed:fresh` | Same, but wipes orders too |

---

## 3. Data model (database `dilite`)

### `menu_items` — 85 documents
```js
{
  id: "veg-pizza-cheese-onion",
  name: "Cheese & Onion",
  category: "Veg Pizza",
  description: "Cheese & onion.",
  price: 120,
  image: "https://images.unsplash.com/...",
  veg: true,
  rating: "4.7",
  time: 25,
  tag: "BESTSELLER",
  available: true,
  productKind: "full-pizza",   // full-pizza | regular-pizza | combo | fixed
  sortOrder: 0
}
```

### `categories` — 13 documents
`{ name, slug, description, order }`

### `orders` — one document per order
```js
{
  orderNumber: "DLT-2482",
  createdAt: ISODate(...),
  status: "New",                  // New → Preparing → Out for delivery → Delivered | Cancelled
  customer: { name, phone, hostel, room, landmark },
  items: [                        // embedded lines — no joins needed
    { itemId, name, image, veg, qty, size, addons: [], unitPrice }
  ],
  subtotal, deliveryFee, discount, total,
  payment: { method: "Cash on delivery" | "UPI", status: "Pending" | "Paid" },
  notes,
  coupon,
  statusHistory: [{ status, at }]
}
```

### `settings` — single pricing document
`sizes[]`, `addons[]`, `deliveryFee`, `freeDeliveryOver`

### `counters` — order numbering
`{ _id: "orderNumber", seq: 2480 }` → next order is `DLT-2481`

**Why documents fit here:** an order is one self-contained document — customer, lines, totals, status
history. Reading a kitchen ticket is a single `findOne`, no joins, and the line items keep a price
snapshot so a later menu price change never rewrites past bills.

---

## 4. API (base `http://localhost:3003/api`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | DB + collection counts |
| GET | `/menu` | 85 items + categories + pricing |
| PATCH | `/menu/:id/availability` | `{available: boolean}` — admin toggle |
| GET | `/orders?limit=&status=&active=&phone=` | Kitchen list or a customer's own orders (newest first) |
| GET | `/orders/:orderNumber` | One order |
| POST | `/orders` | Place an order |
| PATCH | `/orders/:orderNumber/status` | `{status}` |
| PATCH | `/orders/:orderNumber/payment` | `{status: "Paid"}` |

Place-order body (prices are **recomputed server-side** from the DB — the client can't set totals):
```json
{
  "customer": { "name": "Aaryan Sharma", "phone": "9876501422",
                "hostel": "Hostel C", "room": "C-118", "landmark": "Near the water cooler" },
  "items": [ { "itemId": "veg-pizza-cheese-onion", "qty": 1, "size": "Medium",
               "addons": ["Extra cheese"] } ],
  "notes": "Extra chilli",
  "payment": { "method": "Cash on delivery" },
  "coupon": "STUDENT10"
}
```

---

## 5. What changed to connect it

| File | Change |
|------|--------|
| `backend/db.js` | Mongo client, collections, indexes (unique order numbers, status+date) |
| `backend/server.js` | Full REST API, server-side pricing, order numbering, status history |
| `backend/seed.js` + `backend/seed/*.json` | Seeds 85 menu items extracted from the original UI catalogue |
| `src/api.ts` | Typed client |
| `src/App.tsx` | Menu + orders from the API instead of local fixtures; checkout posts a real order; kitchen board polls every 5s and writes status/payment back; admin menu toggles persist |
| `.env` / `backend/.env` | `VITE_API_URL`, `MONGODB_URI`, `DB_NAME`, ETA |

The kitchen dashboard is no longer a mock: its "temporary data · resets on refresh" footer now reads
**"Live from MongoDB · refreshes every 5s"**.

---

## 6. Verified end to end

- `tsc -p tsconfig.json --noEmit` → clean; `npm run build` → 288 kB JS / 81 kB CSS
- Site loads **85 dishes from MongoDB** (category counts match the DB)
- Order placed through the browser UI → full document stored (`DLT-2482`, ₹360, customer + lines + notes)
- Kitchen dashboard shows it on **New**, and **a new order appears within 5s without a reload**
- Dashboard "Mark as Preparing" + "Mark paid" → MongoDB updated with `statusHistory` entries
- Admin menu toggle → `menu_items.available` flips in the database
- Success page shows the DB's order number, real total and real ETA

---

## 7. Inspect the data

```bash
mongosh dilite
```
```js
db.orders.find().sort({ createdAt: -1 }).limit(5).pretty()
db.orders.findOne({ orderNumber: "DLT-2482" })
db.menu_items.countDocuments()
db.menu_items.find({ category: "Veg Pizza" }, { name: 1, price: 1, _id: 0 })
db.menu_items.aggregate([{ $group: { _id: "$category", n: { $sum: 1 } } }, { $sort: { _id: 1 } }])
```

---

## 8. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `MongoDB connection failed` | `sc query MongoDB` — start the service: `net start MongoDB` |
| Site shows static menu / "Menu API offline" | API down; check `http://localhost:3003/api/health` |
| `EADDRINUSE :3003` | Another server is running: `netstat -ano \| findstr 3003` |
| Kitchen board empty | No orders yet, or API down — place an order first |
| Need a clean slate | `cd backend && npm run seed:fresh` |

---

## 9. Customer-facing extras

### Track order (by order number)
Nav → **Track order**. Type any order number (`DLT-2482` or just `2482`) and it pulls that order straight
from MongoDB: current status, real ETA, item list, and a timeline whose times come from the order's
`statusHistory`. It refreshes itself every 10 seconds, and shows a clear error for unknown numbers.

### My orders
Nav → **My orders** (or *Track order* → **My orders**). Orders are tied to the phone number used at
checkout, which the site remembers locally, so a customer sees **their** orders only — `Active · Past ·
Cancelled` tabs with live counts. Each card can **Track** it or **Reorder** it (puts every line, with
sizes and add-ons, back in the cart).

### Receipt / invoice
Available in **three** places, always with the order number on it:
- **Success screen**, right after ordering.
- **Track order** — under the timeline of any order you look up.
- **My orders** — an `Invoice` and `Print` button on every order card.

Two formats: **Download invoice** → `DILITE-receipt-DLT-2487.txt` (items, sizes, add-ons, totals,
payment, notes), and **Print / save PDF** → a clean one-page receipt in a print window.

Both carry the order number, so the customer always has a reference even if they close the tab.

### Kitchen dashboard
Footer → **Kitchen dashboard**. Live orders board (New / Preparing / Out for delivery / Delivered),
order drawer with the full bill, and one-click status advance / mark paid — all written back to MongoDB.

---

## 10. Screenshots

Full-resolution captures of the running app (MongoDB-backed, live orders).

### Kitchen dashboard
![Kitchen dashboard with revenue, queue and pending payments](screenshots/01-kitchen-dashboard.png)

### Home / hero
![Landing page — Hot. Late. Yours.](screenshots/02-home-hero.png)

### Menu + cart drawer
![Menu with category filters and the cart drawer open](screenshots/03-menu-and-cart.png)

### Live orders board
![Kanban board — New, Preparing, Out for delivery, Delivered](screenshots/04-live-orders-board.png)

### Order detail (kitchen drawer)
![Order drawer with customer, items, bill and status actions](screenshots/05-order-detail-drawer.png)

### Track order
![Customer order tracking with real timeline from MongoDB](screenshots/06-track-order.png)

### Invoice / receipt
![Downloadable and printable invoice for an order](screenshots/07-invoice-receipt.png)
