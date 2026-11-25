// Seed the Dilite MongoDB from the catalogue exported out of src/App.tsx
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connect, collections, close } from "./db.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(here, "seed", file), "utf8"));

const resetOrders = process.argv.includes("--reset-orders");

async function main() {
  await connect();
  const { items, categories, orders, settings, counters } = collections();

  const menu = readJson("menu.json");
  const cats = readJson("categories.json");
  const pricing = readJson("pricing.json");

  await items.deleteMany({});
  await items.insertMany(menu);
  await categories.deleteMany({});
  await categories.insertMany(cats);
  await settings.updateOne(
    { key: "pricing" },
    { $set: { key: "pricing", ...pricing, updatedAt: new Date() } },
    { upsert: true },
  );

  // Keep the brand's order numbering continuous (first order becomes DLT-2481).
  await counters.updateOne(
    { _id: "orderNumber" },
    { $setOnInsert: { seq: 2480, createdAt: new Date() } },
    { upsert: true },
  );

  if (resetOrders) {
    const removed = await orders.deleteMany({});
    console.log(`orders cleared: ${removed.deletedCount}`);
  }

  const counts = {
    menu_items: await items.countDocuments(),
    categories: await categories.countDocuments(),
    orders: await orders.countDocuments(),
  };

  console.log("seeded:", counts);
  await close();
}

main().catch(async (error) => {
  console.error("seed failed:", error.message);
  await close().catch(() => {});
  process.exit(1);
});
