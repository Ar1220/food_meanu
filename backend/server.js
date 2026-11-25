// =====================================================
// DILITE — kitchen API (Express + MongoDB)
// Menu, orders and live kitchen status
// =====================================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connect, collections } from "./db.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3003);
const ETA_MINUTES = Number(process.env.DELIVERY_ETA_MINUTES ?? 32);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const STATUSES = ["New", "Preparing", "Out for delivery", "Delivered", "Cancelled"];

// ---------- helpers ----------
const dhaka = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const timeLabel = (date) => dhaka.format(date).toUpperCase().replace(/\s+/g, " ").trim();

async function pricing() {
  const { settings } = collections();
  const doc = await settings.findOne({ key: "pricing" });
  return (
    doc ?? {
      sizes: [
        { label: "Small", sub: '7"', price: 0 },
        { label: "Medium", sub: '10"', price: 60 },
        { label: "Large", sub: '13"', price: 120 },
      ],
      addons: [
        { name: "Extra cheese", price: 30 },
        { name: "Jalapeños", price: 20 },
        { name: "Extra chicken", price: 60 },
      ],
      deliveryFee: 30,
      freeDeliveryOver: 399,
    }
  );
}

async function nextOrderNumber() {
  const { counters } = collections();
  const result = await counters.findOneAndUpdate(
    { _id: "orderNumber" },
    { $inc: { seq: 1 }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true, returnDocument: "after" },
  );
  return `DLT-${result.seq}`;
}

// Mongo document -> shape the React kitchen dashboard already speaks
function serializeOrder(doc) {
  const created = new Date(doc.createdAt);
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - created.getTime()) / 60000));
  return {
    id: doc.orderNumber,
    createdAt: timeLabel(created),
    createdAtISO: created.toISOString(),
    elapsedMinutes,
    estimatedDelivery: timeLabel(new Date(created.getTime() + ETA_MINUTES * 60000)),
    status: doc.status,
    customer: doc.customer,
    items: doc.items,
    subtotal: doc.subtotal,
    deliveryFee: doc.deliveryFee,
    discount: doc.discount,
    total: doc.total,
    payment: doc.payment,
    notes: doc.notes ?? "",
    statusHistory: (doc.statusHistory ?? []).map((entry) => ({
      status: entry.status,
      at: entry.at instanceof Date ? entry.at.toISOString() : entry.at,
    })),
    itemCount: doc.items.reduce((sum, item) => sum + item.qty, 0),
  };
}

// ---------- health ----------
app.get("/api/health", async (_req, res) => {
  try {
    const { items, categories, orders } = collections();
    res.json({
      status: "healthy",
      database: "connected",
      db: process.env.MONGODB_DB ?? "dilite",
      counts: {
        menuItems: await items.countDocuments(),
        categories: await categories.countDocuments(),
        orders: await orders.countDocuments(),
      },
      time: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: error.message });
  }
});

// ---------- menu ----------
app.get("/api/menu", async (_req, res) => {
  try {
    const { items, categories } = collections();
    const [menu, cats, price] = await Promise.all([
      items.find({}).sort({ sortOrder: 1 }).toArray(),
      categories.find({}).sort({ order: 1 }).toArray(),
      pricing(),
    ]);

    res.json({
      success: true,
      count: menu.length,
      items: menu.map(({ _id, updatedAt, ...item }) => item),
      categories: cats.map(({ _id, ...category }) => category),
      pricing: {
        sizes: price.sizes,
        addons: price.addons,
        deliveryFee: price.deliveryFee,
        freeDeliveryOver: price.freeDeliveryOver,
      },
    });
  } catch (error) {
    console.error("menu error", error);
    res.status(500).json({ success: false, message: "Could not load the menu" });
  }
});

app.patch("/api/menu/:id/availability", async (req, res) => {
  try {
    const { available } = req.body ?? {};
    if (typeof available !== "boolean") {
      return res.status(400).json({ success: false, message: "`available` must be a boolean" });
    }
    const { items } = collections();
    const result = await items.updateOne(
      { id: req.params.id },
      { $set: { available, updatedAt: new Date() } },
    );
    if (!result.matchedCount) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    res.json({ success: true, id: req.params.id, available });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- orders ----------
app.get("/api/orders", async (req, res) => {
  try {
    const { orders } = collections();
    const filter = {};
    if (req.query.status && STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (req.query.active === "true") filter.status = { $in: ["New", "Preparing", "Out for delivery"] };
    if (req.query.phone) {
      // Customers look up their own history by the phone they ordered with.
      const digits = String(req.query.phone).replace(/\D/g, "");
      filter["customer.phone"] = { $regex: `${digits}$` };
    }

    const limit = Math.min(Number(req.query.limit ?? 100), 300);
    const docs = await orders.find(filter).sort({ createdAt: -1 }).limit(limit).toArray();

    res.json({ success: true, count: docs.length, orders: docs.map(serializeOrder) });
  } catch (error) {
    console.error("orders error", error);
    res.status(500).json({ success: false, message: "Could not load orders" });
  }
});

app.get("/api/orders/:orderNumber", async (req, res) => {
  try {
    const { orders } = collections();
    const doc = await orders.findOne({ orderNumber: req.params.orderNumber });
    if (!doc) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: serializeOrder(doc) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { customer, items, notes, payment, coupon } = req.body ?? {};

    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "The cart is empty" });
    }

    const { items: menu, orders } = collections();
    const price = await pricing();
    const menuDocs = await menu.find({ id: { $in: items.map((line) => line.itemId) } }).toArray();
    const byId = new Map(menuDocs.map((doc) => [doc.id, doc]));

    // Prices are recomputed from the database — the client cannot set its own totals.
    const lines = items.map((line) => {
      const dish = byId.get(line.itemId);
      if (!dish) throw Object.assign(new Error(`Unknown menu item: ${line.itemId}`), { status: 400 });

      const sizePrice =
        dish.productKind === "full-pizza"
          ? (price.sizes.find((size) => size.label === line.size)?.price ?? 0)
          : 0;
      const addonList = Array.isArray(line.addons) ? line.addons : [];
      const addonPrice = addonList.reduce(
        (sum, name) => sum + (price.addons.find((addon) => addon.name === name)?.price ?? 0),
        0,
      );
      const qty = Math.max(1, Number(line.qty) || 1);

      return {
        itemId: dish.id,
        name: dish.name,
        image: dish.image,
        veg: dish.veg,
        qty,
        size: line.size || undefined,
        addons: addonList,
        unitPrice: dish.price + sizePrice + addonPrice,
        lineTotal: (dish.price + sizePrice + addonPrice) * qty,
      };
    });

    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const deliveryFee = subtotal >= price.freeDeliveryOver ? 0 : price.deliveryFee;
    const discount =
      String(coupon ?? "").toUpperCase() === "STUDENT10" ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + deliveryFee - discount;

    const orderNumber = await nextOrderNumber();
    const method = payment?.method === "UPI" ? "UPI" : "Cash on delivery";

    const doc = {
      orderNumber,
      createdAt: new Date(),
      status: "New",
      customer: {
        name: String(customer.name).trim(),
        phone: String(customer.phone).trim(),
        hostel: String(customer.hostel ?? "").trim(),
        room: String(customer.room ?? "").trim(),
        landmark: String(customer.landmark ?? "").trim(),
      },
      items: lines.map(({ lineTotal, ...line }) => line),
      subtotal,
      deliveryFee,
      discount,
      total,
      payment: { method, status: "Pending" },
      notes: String(notes ?? "").trim(),
      statusHistory: [{ status: "New", at: new Date() }],
      coupon: String(coupon ?? "").toUpperCase() || null,
    };

    await orders.insertOne(doc);
    res.status(201).json({ success: true, order: serializeOrder(doc) });
  } catch (error) {
    const status = error.status ?? 500;
    console.error("create order error", error.message);
    res.status(status).json({
      success: false,
      message: status === 500 ? "Could not place the order" : error.message,
      error: status === 500 ? error.message : undefined,
    });
  }
});

app.patch("/api/orders/:orderNumber/status", async (req, res) => {
  try {
    const { status } = req.body ?? {};
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of ${STATUSES.join(", ")}` });
    }
    const { orders } = collections();
    const result = await orders.findOneAndUpdate(
      { orderNumber: req.params.orderNumber },
      {
        $set: { status, updatedAt: new Date() },
        $push: { statusHistory: { status, at: new Date() } },
      },
      { returnDocument: "after" },
    );
    if (!result) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: serializeOrder(result) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch("/api/orders/:orderNumber/payment", async (req, res) => {
  try {
    const { status } = req.body ?? {};
    if (!["Pending", "Paid"].includes(status)) {
      return res.status(400).json({ success: false, message: "status must be Pending or Paid" });
    }
    const { orders } = collections();
    const result = await orders.findOneAndUpdate(
      { orderNumber: req.params.orderNumber },
      { $set: { "payment.status": status, paidAt: status === "Paid" ? new Date() : null } },
      { returnDocument: "after" },
    );
    if (!result) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: serializeOrder(result) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---------- start ----------
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n  DILITE kitchen API`);
      console.log(`  http://localhost:${PORT}/api/health`);
      console.log(`  db: ${process.env.MONGODB_DB ?? "dilite"} @ ${process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017"}\n`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
