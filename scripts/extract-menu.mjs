// One-off: pull the menuItems array out of src/App.tsx so it can be seeded into MongoDB.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const src = fs.readFileSync("src/App.tsx", "utf8");
const start = src.indexOf("const menuItems: MenuItem[] = [");
const end = src.indexOf("\nconst menuItemsById");
if (start === -1 || end === -1) throw new Error("menuItems block not found");

const slice = src.slice(0, end); // types + helpers + the array, no JSX below this point
fs.mkdirSync(".tmp", { recursive: true });
fs.writeFileSync(".tmp/menu.ts", `${slice}\nexport default menuItems;\n`);

execFileSync("npx esbuild .tmp/menu.ts --bundle --format=esm --platform=node --outfile=.tmp/menu.mjs --log-level=error", {
  shell: true,
  stdio: "inherit",
});

const { default: menuItems } = await import(pathToFileURL(resolve(".tmp/menu.mjs")).href);

const items = menuItems.map((item, index) => ({
  ...item,
  sortOrder: index,
  updatedAt: new Date().toISOString(),
}));

const categoryNames = [...new Set(menuItems.map((item) => item.category))];
const descriptions = {
  "Veg Pizza": 'Small 7" / Medium 10" / Large 13"',
  "Non-Veg Pizza": 'Small 7" / Medium 10" / Large 13"',
  "Pizza Mania": 'Regular 7" pizzas · combos save you money',
};
const categories = categoryNames.map((name, index) => ({
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  description: descriptions[name] ?? null,
  order: index,
}));

fs.mkdirSync("backend/seed", { recursive: true });
fs.writeFileSync("backend/seed/menu.json", JSON.stringify(items, null, 2));
fs.writeFileSync("backend/seed/categories.json", JSON.stringify(categories, null, 2));
fs.writeFileSync("backend/seed/pricing.json", JSON.stringify({
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
}, null, 2));

console.log(`items: ${items.length} | categories: ${categories.length}`);
console.log("wrote backend/seed/menu.json, categories.json, pricing.json");
