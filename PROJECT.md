# Dilite — Food Menu & Ordering System

A small food-ordering website with a live kitchen dashboard, backed by MongoDB.
University mini project (NoSQL half of the SQL / NoSQL pair).

**GitHub:** https://github.com/Ar1220/food_meanu

---

## What it does

- Customers browse an 85-dish menu, pick size and add-ons, and add to cart.
- They fill a delivery form (hostel, room, landmark) and place a real order.
- The order is saved to MongoDB and gets a permanent number like `DLT-2482`.
- The kitchen dashboard shows every order on a board: **New → Preparing → Out for delivery → Delivered**.
- Kitchen staff move an order forward and mark payments — all saved to the database.
- Customers can **track** an order by its number, see **their past orders**, and **download an invoice**.

---

## Tech

- **Front end:** React 19 + Vite + Tailwind (port 5181)
- **API:** Node.js + Express (port 3003)
- **Database:** MongoDB 9 (`dilite` database, port 27017)

---

## Database (MongoDB)

| Collection | What it holds |
|---|---|
| `menu_items` | 85 dishes — name, price, category, veg/non-veg, image, available |
| `categories` | 13 menu categories |
| `orders` | one document per order: customer, items, totals, payment, status history |
| `settings` | pizza sizes, add-ons, delivery fee |
| `counters` | order numbering (`DLT-2481`, `DLT-2482`, …) |

An order is one document — no joins needed. Line items keep a price snapshot, so changing a
menu price later never rewrites old bills.

---

## Screenshots

**Home page**

![Home page](screenshots/02-home-hero.png)

**Menu + cart**

![Menu and cart](screenshots/03-menu-and-cart.png)

**Kitchen dashboard**

![Kitchen dashboard](screenshots/01-kitchen-dashboard.png)

**Live orders board**

![Live orders board](screenshots/04-live-orders-board.png)

**Order detail (kitchen)**

![Order detail drawer](screenshots/05-order-detail-drawer.png)

**Track order**

![Track order](screenshots/06-track-order.png)

**Invoice / receipt**

![Invoice](screenshots/07-invoice-receipt.png)

---

## How to run

1. Make sure the **MongoDB** service is running.
2. `cd backend` → `npm install` → `npm run seed` → `npm start`
3. In the project folder: `npm install` → `npm run dev`
4. Or just double-click **`services.cmd`** and press **1** to start everything.

---

## Demo video

Screen recording of the full flow (order → kitchen board → track → invoice).
Added as `demo.gif` so it plays automatically wherever the document is opened.
