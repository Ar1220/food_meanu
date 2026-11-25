# Dilite temporary kitchen dashboard

## Goal

Turn the existing basic dark admin area into a complete, frontend-only kitchen operations dashboard. It will let a kitchen worker see exactly who ordered, what each person ordered, bill totals, payment status, and where every order is in the preparation/delivery workflow.

No backend, authentication, persistence, or MongoDB integration will be added in this phase. The UI will use realistic local TypeScript data and local React state so it can be connected to the future order collection without redesigning the screens.

## Confirmed product decisions

- A small **Kitchen dashboard** footer link will be restored as the temporary entry point.
- Every order uses a **complete kitchen bill**:
  - order ID and creation time
  - customer name and phone
  - hostel, room number, landmark
  - each ordered product, quantity, size, add-ons, unit price, and line amount
  - subtotal, delivery fee, discount, taxes included, grand total
  - payment method and paid/pending payment status
  - customer order notes
- Dashboard data is temporary and frontend-local. All interactions are demonstrations only and reset on refresh.
- Keep the existing dark Dilite visual system and do not introduce a light admin theme.

## Temporary order data model

Add typed local data near the existing catalogue helpers in `src/App.tsx`:

```ts
type KitchenOrderStatus = "New" | "Preparing" | "Out for delivery" | "Delivered" | "Cancelled";
type PaymentMethod = "Cash on delivery" | "UPI";
type PaymentStatus = "Pending" | "Paid";

type KitchenOrderItem = {
  itemId: string;
  name: string;
  image: string;
  veg: boolean;
  qty: number;
  size?: string;
  addons: string[];
  unitPrice: number;
};

type KitchenOrder = {
  id: string;
  createdAt: string;
  elapsedMinutes: number;
  estimatedDelivery: string;
  status: KitchenOrderStatus;
  customer: {
    name: string;
    phone: string;
    hostel: string;
    room: string;
    landmark: string;
  };
  items: KitchenOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
  };
  notes?: string;
};
```

Seed 8–10 believable orders using real `menuItems` so images, dietary marks, size labels, add-ons, item names, and prices all agree with the customer menu. The fixture set will cover:

- new, preparing, out-for-delivery, delivered, and cancelled states
- COD pending and UPI paid orders
- different hostels and rooms
- single-item, multi-item, pizza-with-add-ons, Pizza Mania combo, and snack/drink orders
- a late order over 20 minutes so the timer warning treatment is visible

Totals will be calculated from the local line items and fees in helper functions rather than written as disconnected display strings.

## Dashboard experience

### 1. Dashboard overview

Keep the existing sidebar structure and replace the generic summary content with data derived from the temporary orders:

- Header: `Kitchen pulse.` with current local kitchen-open status.
- Four live stat cards:
  - today’s revenue
  - orders in progress
  - average order value
  - most-ordered menu item
- Current queue panel:
  - next orders to make
  - order ID, elapsed time, customer/hostel/room, item count, total, payment pill, and status pill
  - `Open order` action
- Retain the revenue and busy-hour visualisations as polished temporary operational context.
- Add a “Payment watch” panel for COD/pending orders with total pending cash collection.

### 2. Live orders board

Replace the current placeholder kanban cards with real cards generated from local orders.

Columns:

1. New
2. Preparing
3. Out for delivery
4. Delivered

Each card shows:

- order ID
- elapsed timer; ember treatment after 20 minutes
- customer name
- hostel and room
- ordered item summary
- total bill
- payment method and payment status pills
- open-order action

Behaviour:

- Clicking a card or `Open order` opens a right-side order-detail drawer.
- A simple status action moves the selected order one valid step forward:
  - New → Preparing
  - Preparing → Out for delivery
  - Out for delivery → Delivered
- “Mark paid” appears for unpaid UPI/COD orders and updates the local payment pill.
- Delivered orders remain readable and do not show a forward status action.
- Empty status columns display a small designed empty state, not blank space.

### 3. Order detail / kitchen bill drawer

Build a full-height right-side drawer that opens from the Live orders board and current-queue rows.

Header:

- order ID with copy affordance
- current order-status pill
- close button
- order time and elapsed timer

Customer block:

- name
- tap-to-call phone number
- hostel, room, landmark
- customer notes in a visually distinct but quiet note panel

Kitchen items:

- dish thumbnail and veg/non-veg mark
- quantity × name
- selected pizza size and add-ons where present
- unit price and line total

Bill:

- subtotal
- discount if present
- delivery
- taxes included
- grand total
- payment method
- prominent Paid / Pending payment state

Actions:

- status-advance button with the next real status label
- mark-paid button when relevant
- call customer
- WhatsApp customer

On mobile, the drawer becomes a bottom sheet with the same information and a fixed action bar.

### 4. Menu management compatibility

Keep the existing Menu items UI and its local availability toggles. Ensure the dashboard changes do not disturb the existing 85-item catalogue, filter logic, cards, cart, checkout, or customer order history.

## Entry point and local state flow

1. Restore a small `Kitchen dashboard` footer action.
2. That action sets the existing page state to `admin` and selects the Dashboard tab.
3. Store `kitchenOrders` in `App` state so Dashboard, Live orders, and the detail drawer see the same local order data.
4. Pass update handlers into the Admin tree:
   - `onAdvanceStatus(orderId)`
   - `onMarkPaid(orderId)`
   - `onOpenOrder(orderId)`
5. Hold the selected order ID and drawer-open state in the Admin view or its parent, then derive the selected order from `kitchenOrders`.
6. All mutations are immutable React state updates, ready to be replaced later by API/database calls.

## Files to modify

### `src/App.tsx`

- Add the typed local kitchen-order fixture and total/status helpers.
- Restore the temporary footer entry point.
- Extend top-level state and the Admin props to carry shared order data and mutation handlers.
- Replace dashboard placeholder stats/order rows with derived values and usable open-order actions.
- Replace the Live orders placeholder columns/cards with local-order-driven kanban columns.
- Add `KitchenOrderDrawer` and supporting status/payment pill components.
- Keep the existing menu-management view intact aside from shared admin navigation plumbing.

### `src/index.css`

- Add styles for:
  - dashboard queue rows
  - payment watch panel
  - status/payment pills
  - kitchen order cards and empty board columns
  - order detail drawer/sheet
  - bill line items/totals
  - customer and note panels
  - responsive mobile dashboard drawer layout
- Use existing Dilite tokens: warm near-black surfaces, subtle borders, cream typography, ember only for primary/action emphasis, green only for paid/success, and no light-theme UI.

## Edge cases

- Order with no notes: hide the notes panel.
- Item without a size or add-on: do not render an empty separator in the line-item detail.
- Free delivery: show `FREE`, not `₹0`.
- Discount of zero: omit the discount row.
- Cancelled and delivered orders: no next-status button.
- Empty status column: show a compact empty state.
- Drawer order changes state while open: update its pill, actions, and timeline immediately.
- Time warning: elapsed time at or above 20 minutes is ember plus an explicit `running late` label, not color-only.
- Temporary UI disclaimer: the admin footer or subtle caption states that demo order updates reset on refresh.

## Verification

1. Run `pnpm build` after implementation. Do not run the repository-wide formatter because the user has manual edits in `package.json`, `src/main.tsx`, and `vite.config.ts`.
2. Check the temporary footer entry opens the dashboard and the exit action returns to the customer menu.
3. Check Dashboard stats are derived from the mock orders.
4. Open one order from Dashboard and one from each active kanban column; verify customer, item, bill, payment, and notes information.
5. Advance a New order through Preparing, Out for delivery, and Delivered; verify it moves columns and the drawer updates.
6. Mark a pending-payment order as paid; verify pills and payment-watch totals update.
7. Check an empty column state by moving its final active order onward.
8. Confirm the kitchen dashboard remains responsive on desktop and mobile, with a side drawer on desktop and bottom sheet on mobile.
9. Confirm the customer menu, cart, checkout, and existing 85-menu-item data still build and work as before.
