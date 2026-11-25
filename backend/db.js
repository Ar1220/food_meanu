// MongoDB connection + shared collections
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "dilite";

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

let db = null;

export async function connect() {
  if (db) return db;
  await client.connect();
  db = client.db(dbName);
  await ensureIndexes(db);
  return db;
}

export function getDb() {
  if (!db) throw new Error("Database not connected");
  return db;
}

export function collections() {
  const database = getDb();
  return {
    items: database.collection("menu_items"),
    categories: database.collection("categories"),
    orders: database.collection("orders"),
    settings: database.collection("settings"),
    counters: database.collection("counters"),
  };
}

async function ensureIndexes(database) {
  await database.collection("menu_items").createIndex({ id: 1 }, { unique: true });
  await database.collection("menu_items").createIndex({ category: 1, sortOrder: 1 });
  await database.collection("categories").createIndex({ slug: 1 }, { unique: true });
  await database.collection("orders").createIndex({ orderNumber: 1 }, { unique: true });
  await database.collection("orders").createIndex({ status: 1, createdAt: -1 });
  await database.collection("orders").createIndex({ createdAt: -1 });
}

export async function close() {
  await client.close();
  db = null;
}
