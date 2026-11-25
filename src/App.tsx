import { useEffect, useMemo, useState } from "react";

type IconName =
  | "arrow"
  | "bag"
  | "check"
  | "chevron"
  | "clock"
  | "close"
  | "copy"
  | "fire"
  | "menu"
  | "minus"
  | "phone"
  | "plus"
  | "spark"
  | "whatsapp";

type ProductKind = "full-pizza" | "regular-pizza" | "combo" | "fixed";

type MenuCategory =
  | "Veg Pizza"
  | "Non-Veg Pizza"
  | "Pizza Mania"
  | "Pasta"
  | "Burgers"
  | "Grilled Sandwich"
  | "Rolls"
  | "Wraps"
  | "Garlic Bread"
  | "Tacos"
  | "Zingy Parcel"
  | "Sides & Snacks"
  | "Shakes & Drinks";

type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  image: string;
  veg: boolean;
  rating: string;
  time: number;
  tag?: string;
  available: boolean;
  productKind: ProductKind;
  group?: string;
};

type CartItem = MenuItem & {
  size: string;
  unitPrice: number;
  addons: string[];
  qty: number;
};

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=88`;

const foodImages = {
  vegPizzaClassic: image("photo-1574071318508-1cdbab80d002"),
  vegPizzaPaneer: image("photo-1594007654729-407eedc4be65"),
  vegPizzaLoaded: image("photo-1513104890138-7c749659a591"),
  chickenPizza: image("photo-1565299624946-b28f40a0ae38"),
  pepperoniPizza: image("photo-1628840042765-356cda07504e"),
  loadedPizza: image("photo-1579751626657-72bc17010498"),
  pizzaMania: image("photo-1571407970349-bc81e7e96d47"),
  pastaRed: image("photo-1621996346565-e3dbc646d9a9"),
  pastaWhite: image("photo-1473093295043-cdd812d0e601"),
  burgerVeg: image("photo-1550547660-d9450f859349"),
  burgerChicken: image("photo-1568901346375-23c9450c58cd"),
  sandwich: image("photo-1528735602780-2552fd46c7af"),
  roll: image("photo-1547592180-85f173990554"),
  wrap: image("photo-1626700051175-6818013e1d4f"),
  garlicBread: image("photo-1573140401552-3fab0b24306f"),
  taco: image("photo-1551504734-5ee1c4a1479b"),
  zingy: image("photo-1601050690597-df0568f70950"),
  fries: image("photo-1573080496219-bb080dd4f877"),
  dessert: image("photo-1606313564200-e75d5e30476c"),
  wings: image("photo-1527477396000-e27163b481c2"),
  shake: image("photo-1551024506-0bccd828d307"),
  coldDrink: image("photo-1581006852262-e4307cf6283a"),
};

const makeItem = (
  id: string,
  name: string,
  category: MenuCategory,
  description: string,
  price: number,
  imageKey: keyof typeof foodImages,
  veg: boolean,
  productKind: ProductKind,
  options: Partial<Pick<MenuItem, "tag" | "group" | "time" | "rating">> = {},
): MenuItem => ({
  id,
  name,
  category,
  description,
  price,
  image: foodImages[imageKey],
  veg,
  productKind,
  available: true,
  time: options.time ?? (productKind === "full-pizza" ? 25 : 16),
  rating: options.rating ?? "4.7",
  tag: options.tag,
  group: options.group,
});

const fullPizza = (
  id: string,
  name: string,
  description: string,
  price: number,
  veg: boolean,
  imageKey: keyof typeof foodImages,
  options: Partial<Pick<MenuItem, "tag" | "time" | "rating">> = {},
) =>
  makeItem(
    id,
    name,
    veg ? "Veg Pizza" : "Non-Veg Pizza",
    description,
    price,
    imageKey,
    veg,
    "full-pizza",
    options,
  );

const fixedItem = (
  id: string,
  name: string,
  category: Exclude<MenuCategory, "Veg Pizza" | "Non-Veg Pizza">,
  description: string,
  price: number,
  veg: boolean,
  imageKey: keyof typeof foodImages,
  productKind: ProductKind = "fixed",
  options: Partial<Pick<MenuItem, "tag" | "group" | "time" | "rating">> = {},
) => makeItem(id, name, category, description, price, imageKey, veg, productKind, options);

const menuItems: MenuItem[] = [
  // Veg Pizza · Small 7" / Medium 10" / Large 13"
  fullPizza(
    "veg-pizza-cheese-onion",
    "Cheese & Onion",
    "Cheese & onion.",
    120,
    true,
    "vegPizzaClassic",
    { tag: "BESTSELLER" },
  ),
  fullPizza(
    "veg-pizza-cheese-tomato",
    "Cheese & Tomato",
    "Cheese & tomato.",
    120,
    true,
    "vegPizzaClassic",
  ),
  fullPizza(
    "veg-pizza-crunchy-veg",
    "Crunchy Veg",
    "Cheese & capsicum.",
    120,
    true,
    "vegPizzaClassic",
  ),
  fullPizza("veg-pizza-cheese-corn", "Cheese Corn", "Cheese & corn.", 120, true, "vegPizzaClassic"),
  fullPizza("veg-pizza-margherita", "Margherita", "Double cheese.", 140, true, "vegPizzaClassic"),
  fullPizza(
    "veg-pizza-farm-house",
    "Farm House",
    "Onion, capsicum, tomato, mushroom & cheese.",
    140,
    true,
    "vegPizzaLoaded",
  ),
  fullPizza(
    "veg-pizza-tandoori-veg",
    "Tandoori Veg",
    "Onion, capsicum, tomato, tandoori sauce & cheese.",
    140,
    true,
    "vegPizzaLoaded",
  ),
  fullPizza(
    "veg-pizza-kids-favorite",
    "Kids Favorite",
    "Onion, capsicum, sweet corn & cheese.",
    140,
    true,
    "vegPizzaClassic",
  ),
  fullPizza(
    "veg-pizza-veggie-deluxe",
    "Veggie Deluxe",
    "Onion, capsicum, sweet corn, paneer & cheese.",
    140,
    true,
    "vegPizzaPaneer",
  ),
  fullPizza(
    "veg-pizza-tandoori-paneer",
    "Tandoori Paneer Pizza",
    "Onion, capsicum, corn, paneer & tandoori sauce.",
    160,
    true,
    "vegPizzaPaneer",
    { tag: "HOUSE FAVOURITE" },
  ),
  fullPizza(
    "veg-pizza-paneer-makhani",
    "Paneer Makhani",
    "Capsicum, paneer, makhani sauce & cheese.",
    160,
    true,
    "vegPizzaPaneer",
  ),
  fullPizza(
    "veg-pizza-green-wave",
    "Green Wave",
    "Onion, tomato, capsicum, jalapeños & cheese.",
    160,
    true,
    "vegPizzaLoaded",
  ),
  fullPizza(
    "veg-pizza-pizza-punch",
    "Pizza Punch",
    "Paneer, capsicum, red paprika, mint sauce & cheese.",
    160,
    true,
    "vegPizzaPaneer",
  ),
  fullPizza(
    "veg-pizza-all-veg",
    "All Veg Pizza",
    "Onion, capsicum, tomato, mushroom, black olive, jalapeños & cheese.",
    200,
    true,
    "vegPizzaLoaded",
  ),
  fullPizza(
    "veg-pizza-veggie-lover",
    "Veggie Lover",
    "Capsicum, black olives, corn, red paprika & cheese.",
    200,
    true,
    "vegPizzaLoaded",
  ),
  fullPizza(
    "veg-pizza-veg-supreme",
    "Veg Supreme",
    "Capsicum, black olives, corn, onion, mushroom, tomato, red paprika & cheese.",
    200,
    true,
    "vegPizzaLoaded",
  ),

  // Non-Veg Pizza · Small 7" / Medium 10" / Large 13"
  fullPizza(
    "nonveg-pizza-chicken-bbq",
    "Chicken BBQ",
    "Hot & BBQ, chicken & cheese.",
    160,
    false,
    "chickenPizza",
    { tag: "BESTSELLER" },
  ),
  fullPizza(
    "nonveg-pizza-hot-chicken",
    "Hot Chicken",
    "Onion, red paprika & spicy chicken.",
    160,
    false,
    "chickenPizza",
  ),
  fullPizza(
    "nonveg-pizza-chicken-sausages",
    "Chicken Sausages",
    "Chicken sausages & cheese.",
    160,
    false,
    "chickenPizza",
  ),
  fullPizza(
    "nonveg-pizza-pepperoni",
    "Pepperoni Pizza",
    "Chicken pepperoni & cheese.",
    200,
    false,
    "pepperoniPizza",
    { tag: "HOUSE FAVOURITE" },
  ),
  fullPizza(
    "nonveg-pizza-golden-chicken",
    "Golden Chicken",
    "Corn & BBQ chicken.",
    200,
    false,
    "chickenPizza",
  ),
  fullPizza(
    "nonveg-pizza-tandoori",
    "Non-Veg Tandoori Pizza",
    "Capsicum, onion, BBQ chicken, tandoori sauce.",
    240,
    false,
    "loadedPizza",
  ),
  fullPizza(
    "nonveg-pizza-chicken-feast",
    "Chicken Feast",
    "Black olive, onion, capsicum, mushroom, red paprika, spicy chicken.",
    240,
    false,
    "loadedPizza",
  ),
  fullPizza(
    "nonveg-pizza-chicken-supreme",
    "Chicken Supreme",
    "Onion, capsicum, mushroom, black olive, BBQ & spicy chicken.",
    240,
    false,
    "loadedPizza",
  ),
  fullPizza(
    "nonveg-pizza-chicken-club",
    "Chicken Club",
    "BBQ chicken, spicy chicken & chicken sausage.",
    240,
    false,
    "loadedPizza",
  ),

  // Pizza Mania · regular 7" pizzas and combo deals
  fixedItem(
    "mania-veg-single-combo",
    "Veg Single Combo",
    "Pizza Mania",
    "All 4 single-topping regular pizzas.",
    280,
    true,
    "pizzaMania",
    "combo",
    { group: "Combo Deals", tag: "BEST VALUE", time: 22 },
  ),
  fixedItem(
    "mania-veg-double-combo",
    "Veg Double Combo",
    "Pizza Mania",
    "All 4 double-topping regular pizzas.",
    360,
    true,
    "pizzaMania",
    "combo",
    { group: "Combo Deals", time: 22 },
  ),
  fixedItem(
    "mania-nonveg-combo",
    "Non-Veg Combo",
    "Pizza Mania",
    "All 4 non-veg regular pizzas.",
    400,
    false,
    "pizzaMania",
    "combo",
    { group: "Combo Deals", time: 22 },
  ),
  fixedItem(
    "mania-onion",
    "Onion Pizza",
    "Pizza Mania",
    "Onion & cheese.",
    80,
    true,
    "pizzaMania",
    "regular-pizza",
    { group: "Single Topping · Regular" },
  ),
  fixedItem(
    "mania-tomato",
    "Tomato Pizza",
    "Pizza Mania",
    "Tomato & cheese.",
    80,
    true,
    "pizzaMania",
    "regular-pizza",
    { group: "Single Topping · Regular" },
  ),
  fixedItem(
    "mania-capsicum",
    "Capsicum Pizza",
    "Pizza Mania",
    "Capsicum & cheese.",
    80,
    true,
    "pizzaMania",
    "regular-pizza",
    { group: "Single Topping · Regular" },
  ),
  fixedItem(
    "mania-sweet-corn",
    "Sweet Corn Pizza",
    "Pizza Mania",
    "Sweet corn & cheese.",
    80,
    true,
    "pizzaMania",
    "regular-pizza",
    { group: "Single Topping · Regular" },
  ),
  fixedItem(
    "mania-fresh-veggie",
    "Fresh Veggie Pizza",
    "Pizza Mania",
    "Onion, capsicum.",
    100,
    true,
    "pizzaMania",
    "regular-pizza",
    { group: "Double Topping · Regular" },
  ),
  fixedItem(
    "mania-spicy-dilite",
    "Spicy Dilite Pizza",
    "Pizza Mania",
    "Onion, jalapeños.",
    100,
    true,
    "pizzaMania",
    "regular-pizza",
    { group: "Double Topping · Regular", tag: "SPICY" },
  ),
  fixedItem(
    "mania-exotic-veggie",
    "Exotic Veggie Pizza",
    "Pizza Mania",
    "Tomato, corn.",
    100,
    true,
    "pizzaMania",
    "regular-pizza",
    { group: "Double Topping · Regular" },
  ),
  fixedItem(
    "mania-paneer-tikka",
    "Paneer Tikka Pizza",
    "Pizza Mania",
    "Onion, paneer.",
    100,
    true,
    "pizzaMania",
    "regular-pizza",
    { group: "Double Topping · Regular" },
  ),
  fixedItem(
    "mania-chunky-chicken",
    "Chunky Chicken Pizza",
    "Pizza Mania",
    "Onion, BBQ chicken.",
    120,
    false,
    "pizzaMania",
    "regular-pizza",
    { group: "Non-Veg · Regular" },
  ),
  fixedItem(
    "mania-spicy-chicken",
    "Spicy Chicken Pizza",
    "Pizza Mania",
    "Capsicum, spicy chicken & green chilli.",
    120,
    false,
    "pizzaMania",
    "regular-pizza",
    { group: "Non-Veg · Regular", tag: "SPICY" },
  ),
  fixedItem(
    "mania-chicken-choice",
    "Chicken Choice Pizza",
    "Pizza Mania",
    "Onion, chicken sausage.",
    120,
    false,
    "pizzaMania",
    "regular-pizza",
    { group: "Non-Veg · Regular" },
  ),
  fixedItem(
    "mania-tangy-chicken",
    "Tangy Chicken Pizza",
    "Pizza Mania",
    "Capsicum, spicy chicken.",
    120,
    false,
    "pizzaMania",
    "regular-pizza",
    { group: "Non-Veg · Regular" },
  ),

  // Pasta
  fixedItem(
    "pasta-red-veg",
    "Red Sauce Pasta (Veg)",
    "Pasta",
    "Pasta tossed in a bold tomato sauce.",
    100,
    true,
    "pastaRed",
  ),
  fixedItem(
    "pasta-red-nonveg",
    "Red Sauce Pasta (Non-Veg)",
    "Pasta",
    "Red sauce pasta with chicken.",
    140,
    false,
    "pastaRed",
  ),
  fixedItem(
    "pasta-white-veg",
    "White Sauce Pasta (Veg)",
    "Pasta",
    "Creamy white sauce pasta.",
    100,
    true,
    "pastaWhite",
  ),
  fixedItem(
    "pasta-white-nonveg",
    "White Sauce Pasta (Non-Veg)",
    "Pasta",
    "Creamy white sauce pasta with chicken.",
    140,
    false,
    "pastaWhite",
  ),
  fixedItem(
    "pasta-mix-veg",
    "Mix Sauce Pasta (Veg)",
    "Pasta",
    "Creamy pink sauce pasta.",
    100,
    true,
    "pastaRed",
  ),
  fixedItem(
    "pasta-mix-nonveg",
    "Mix Sauce Pasta (Non-Veg)",
    "Pasta",
    "Creamy pink sauce pasta with chicken.",
    140,
    false,
    "pastaRed",
  ),
  fixedItem(
    "pasta-peri-peri-veg",
    "Peri-Peri Pasta (Veg)",
    "Pasta",
    "Pasta with a smoky peri-peri kick.",
    120,
    true,
    "pastaRed",
    "fixed",
    { tag: "SPICY" },
  ),
  fixedItem(
    "pasta-peri-peri-nonveg",
    "Peri-Peri Pasta (Non-Veg)",
    "Pasta",
    "Peri-peri pasta with chicken.",
    160,
    false,
    "pastaRed",
    "fixed",
    { tag: "SPICY" },
  ),

  // Burgers
  fixedItem(
    "burger-veg",
    "Veg Burger",
    "Burgers",
    "A crisp, classic vegetarian burger.",
    60,
    true,
    "burgerVeg",
  ),
  fixedItem(
    "burger-paneer",
    "Paneer Burger",
    "Burgers",
    "Paneer patty in a toasted bun.",
    80,
    true,
    "burgerVeg",
  ),
  fixedItem(
    "burger-cheese",
    "Cheese Burger",
    "Burgers",
    "Classic burger with extra cheese.",
    80,
    true,
    "burgerVeg",
  ),
  fixedItem(
    "burger-chicken",
    "Chicken Burger",
    "Burgers",
    "Crisp chicken burger, made fresh.",
    80,
    false,
    "burgerChicken",
  ),
  fixedItem(
    "burger-special",
    "Special Burger",
    "Burgers",
    "The house burger with the good stuff.",
    100,
    true,
    "burgerVeg",
    "fixed",
    { tag: "HOUSE FAVOURITE" },
  ),

  // Grilled Sandwich
  fixedItem(
    "sandwich-veg",
    "Veg Grilled Sandwich",
    "Grilled Sandwich",
    "A hot, grilled vegetarian sandwich.",
    80,
    true,
    "sandwich",
  ),
  fixedItem(
    "sandwich-paneer",
    "Paneer Grilled Sandwich",
    "Grilled Sandwich",
    "Paneer in a crisp grilled sandwich.",
    100,
    true,
    "sandwich",
  ),
  fixedItem(
    "sandwich-cheese",
    "Cheese Grilled Sandwich",
    "Grilled Sandwich",
    "Golden grill, gooey cheese.",
    100,
    true,
    "sandwich",
  ),
  fixedItem(
    "sandwich-chicken",
    "Chicken Grilled Sandwich",
    "Grilled Sandwich",
    "Chicken in a pressed, toasted sandwich.",
    100,
    false,
    "sandwich",
  ),

  // Rolls & Wraps
  fixedItem("roll-veg", "Veg Roll", "Rolls", "A hot vegetarian roll.", 80, true, "roll"),
  fixedItem(
    "roll-paneer",
    "Paneer Roll",
    "Rolls",
    "Paneer wrapped with fresh crunch.",
    100,
    true,
    "roll",
  ),
  fixedItem(
    "roll-chicken",
    "Chicken Roll",
    "Rolls",
    "Chicken wrapped hot and fresh.",
    100,
    false,
    "roll",
  ),
  fixedItem("wrap-veg", "Veg Wrap", "Wraps", "A light, fresh veg wrap.", 70, true, "wrap"),
  fixedItem(
    "wrap-paneer",
    "Paneer Wrap",
    "Wraps",
    "Paneer wrapped with fresh crunch.",
    90,
    true,
    "wrap",
  ),
  fixedItem(
    "wrap-chicken",
    "Chicken Wrap",
    "Wraps",
    "Chicken wrapped with fresh crunch.",
    100,
    false,
    "wrap",
  ),

  // Garlic Bread, Tacos and Zingy Parcel
  fixedItem(
    "garlic-plain",
    "Plain Garlic Bread",
    "Garlic Bread",
    "Warm, buttery garlic bread.",
    90,
    true,
    "garlicBread",
  ),
  fixedItem(
    "garlic-cheese",
    "Cheese Garlic Bread",
    "Garlic Bread",
    "Garlic bread with a cheese pull.",
    120,
    true,
    "garlicBread",
  ),
  fixedItem(
    "garlic-stuffed",
    "Stuffed Garlic Bread",
    "Garlic Bread",
    "Crisp outside, stuffed inside.",
    120,
    true,
    "garlicBread",
  ),
  fixedItem(
    "garlic-paneer-tikka",
    "Paneer Tikka Garlic Bread",
    "Garlic Bread",
    "Garlic bread with paneer tikka.",
    140,
    true,
    "garlicBread",
  ),
  fixedItem(
    "garlic-chicken-tikka",
    "Chicken Tikka Garlic Bread",
    "Garlic Bread",
    "Garlic bread with chicken tikka.",
    140,
    false,
    "garlicBread",
  ),
  fixedItem(
    "taco-veg",
    "Veg Taco",
    "Tacos",
    "Crisp taco with a vegetarian filling.",
    120,
    true,
    "taco",
  ),
  fixedItem(
    "taco-chicken",
    "Chicken Taco",
    "Tacos",
    "Crisp taco with a chicken filling.",
    140,
    false,
    "taco",
  ),
  fixedItem(
    "zingy-veg",
    "Veg Zingy",
    "Zingy Parcel",
    "A small, spicy vegetarian parcel.",
    50,
    true,
    "zingy",
  ),
  fixedItem(
    "zingy-nonveg",
    "Non-Veg Zingy",
    "Zingy Parcel",
    "A small, spicy chicken parcel.",
    60,
    false,
    "zingy",
  ),

  // Sides & Snacks
  fixedItem(
    "side-french-fries",
    "French Fries",
    "Sides & Snacks",
    "Golden, salted fries.",
    90,
    true,
    "fries",
  ),
  fixedItem(
    "side-masala-fries",
    "Masala Fries",
    "Sides & Snacks",
    "Fries dusted with masala.",
    100,
    true,
    "fries",
  ),
  fixedItem(
    "side-cheesy-fries",
    "Cheesy Fries",
    "Sides & Snacks",
    "Golden fries with melted cheese.",
    120,
    true,
    "fries",
  ),
  fixedItem(
    "side-choco-lava",
    "Choco Lava Cake",
    "Sides & Snacks",
    "Warm chocolate centre, soft cake.",
    80,
    true,
    "dessert",
  ),
  fixedItem(
    "side-chicken-nuggets",
    "Chicken Nuggets",
    "Sides & Snacks",
    "Crisp chicken nuggets.",
    100,
    false,
    "wings",
  ),
  fixedItem(
    "side-fried-chicken-wings",
    "Fried Chicken Wings",
    "Sides & Snacks",
    "Crisp, juicy fried chicken wings.",
    200,
    false,
    "wings",
    "fixed",
    { tag: "BESTSELLER" },
  ),

  // Shakes & Drinks
  fixedItem(
    "drink-banana-shake",
    "Banana Shake",
    "Shakes & Drinks",
    "Thick banana shake, served cold.",
    70,
    true,
    "shake",
  ),
  fixedItem(
    "drink-oreo-shake",
    "Oreo Shake",
    "Shakes & Drinks",
    "Creamy Oreo shake.",
    80,
    true,
    "shake",
  ),
  fixedItem(
    "drink-butterscotch-shake",
    "Butter Scotch Shake",
    "Shakes & Drinks",
    "Creamy butterscotch shake.",
    90,
    true,
    "shake",
  ),
  fixedItem(
    "drink-strawberry-shake",
    "Strawberry Shake",
    "Shakes & Drinks",
    "Cold strawberry shake.",
    90,
    true,
    "shake",
  ),
  fixedItem(
    "drink-cold-coffee",
    "Cold Coffee",
    "Shakes & Drinks",
    "Chilled coffee with a creamy finish.",
    80,
    true,
    "shake",
    "fixed",
    { tag: "BESTSELLER" },
  ),
  fixedItem(
    "drink-cold-drink-small",
    "Cold Drink (Small)",
    "Shakes & Drinks",
    "Cold canned soft drink, small.",
    20,
    true,
    "coldDrink",
    "fixed",
    { time: 3 },
  ),
  fixedItem(
    "drink-cold-drink-large",
    "Cold Drink (Large)",
    "Shakes & Drinks",
    "Cold bottled soft drink, large.",
    40,
    true,
    "coldDrink",
    "fixed",
    { time: 3 },
  ),
];

const categories = [
  "All",
  "Veg",
  "Non-veg",
  "Veg Pizza",
  "Non-Veg Pizza",
  "Pizza Mania",
  "Pasta",
  "Burgers",
  "Grilled Sandwich",
  "Rolls",
  "Wraps",
  "Garlic Bread",
  "Tacos",
  "Zingy Parcel",
  "Sides & Snacks",
  "Shakes & Drinks",
];

const categoryDescriptions: Partial<Record<MenuCategory, string>> = {
  "Veg Pizza": 'Small 7" / Medium 10" / Large 13"',
  "Non-Veg Pizza": 'Small 7" / Medium 10" / Large 13"',
  "Pizza Mania": 'Regular 7" pizzas · combos save you money',
};

const sizes = [
  { label: "Small", sub: '7"', price: 0 },
  { label: "Medium", sub: '10"', price: 60 },
  { label: "Large", sub: '13"', price: 120 },
];

const addons = [
  { name: "Extra cheese", price: 30 },
  { name: "Jalapeños", price: 20 },
  { name: "Extra chicken", price: 60 },
];

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const itemOptionLabel = (item: Pick<CartItem, "size" | "addons" | "productKind">) =>
  [item.size, ...item.addons].filter(Boolean).join(" · ") ||
  (item.productKind === "combo"
    ? "Combo deal"
    : item.productKind === "regular-pizza"
      ? 'Regular 7"'
      : "Made fresh");

const getItemAddons = (item: MenuItem) => {
  if (item.productKind !== "full-pizza" && item.productKind !== "regular-pizza") return [];
  return item.veg ? addons.filter((addon) => addon.name !== "Extra chicken") : addons;
};

const menuItemsById = (...ids: string[]) =>
  ids
    .map((id) => menuItems.find((item) => item.id === id))
    .filter((item): item is MenuItem => Boolean(item));

function Icon({
  name,
  size = 20,
  stroke = 1.8,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    check: <path d="m5 12 4.2 4L19 6.5" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="10" height="10" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    fire: (
      <path d="M12.1 21c4.1 0 6.9-2.7 6.9-6.4 0-3.4-2-5.5-4.1-7.3.1 2-1 3.1-2.1 3.7C13 7.3 10.7 4.7 8.3 3 8.6 6.7 5 8.7 5 14.5 5 18.2 7.9 21 12.1 21Z" />
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    phone: (
      <path d="M5.4 3.7 8 3.1c.7-.2 1.4.2 1.7.8l1.2 3c.2.6.1 1.3-.4 1.7L8.8 10c1.2 2.5 2.8 4.1 5.2 5.2l1.4-1.8c.4-.5 1.1-.6 1.7-.4l3 1.2c.6.3 1 .9.8 1.7l-.6 2.6c-.2.8-.9 1.4-1.8 1.4C10.2 19.9 4.1 13.8 4.1 5.5c0-.9.5-1.6 1.3-1.8Z" />
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20.5 11.7a8.5 8.5 0 0 1-12.5 7.5L3.5 20.5l1.3-4.3a8.5 8.5 0 1 1 15.7-4.5Z" />
        <path d="M8.4 7.8c.2-.4.5-.4.8-.4h.6c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.5.6c-.1.2-.1.3 0 .5.5.9 1.3 1.7 2.2 2.2.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5v.6c0 .3-.1.6-.4.8-.6.4-1.4.5-2.3.2-1.2-.4-2.7-1.4-4.1-2.8-1.4-1.4-2.4-2.8-2.8-4.1-.3-.9-.2-1.7.2-2.3Z" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      className={`veg-mark ${veg ? "is-veg" : "is-nonveg"}`}
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      <i />
    </span>
  );
}

function QtyStepper({
  value,
  onChange,
  compact = false,
}: {
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={`qty-stepper ${compact ? "compact" : ""}`}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Icon name="minus" size={16} />
      </button>
      <strong>{value}</strong>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<
    "home" | "checkout" | "success" | "tracking" | "history" | "admin"
  >("home");
  const [adminView, setAdminView] = useState<"dashboard" | "orders" | "menu">("dashboard");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderNumber, setOrderNumber] = useState("DLT-2481");
  const [addItemOpen, setAddItemOpen] = useState(false);

  const subtotal = cart.reduce((total, item) => total + item.unitPrice * item.qty, 0);
  const delivery = subtotal === 0 || subtotal >= 399 ? 0 : 30;
  const total = subtotal + delivery;
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);

  const shownItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    if (activeCategory === "Veg") return menuItems.filter((item) => item.veg);
    if (activeCategory === "Non-veg") return menuItems.filter((item) => !item.veg);
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const menuSections = useMemo(() => {
    if (activeCategory === "All") {
      return categories.slice(3).map((category) => ({
        label: category,
        items: menuItems.filter((item) => item.category === category),
        detail: categoryDescriptions[category as MenuCategory],
      }));
    }
    return [
      {
        label:
          activeCategory === "Veg"
            ? "Vegetarian favourites"
            : activeCategory === "Non-veg"
              ? "Non-vegetarian favourites"
              : activeCategory,
        items: shownItems,
        detail:
          activeCategory === "Veg" || activeCategory === "Non-veg"
            ? `${shownItems.length} dishes across the full menu`
            : categoryDescriptions[activeCategory as MenuCategory],
      },
    ];
  }, [activeCategory, shownItems]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addToCart = (
    item: MenuItem,
    size = item.productKind === "full-pizza" ? "Small" : "",
    selectedAddons: string[] = [],
    quantity = 1,
  ) => {
    const validAddons = selectedAddons.filter((name) =>
      getItemAddons(item).some((addon) => addon.name === name),
    );
    const sizePrice =
      item.productKind === "full-pizza"
        ? (sizes.find((entry) => entry.label === size)?.price ?? 0)
        : 0;
    const addonPrice = validAddons.reduce(
      (sum, name) => sum + (addons.find((addon) => addon.name === name)?.price ?? 0),
      0,
    );
    const unitPrice = item.price + sizePrice + addonPrice;
    const key = `${item.id}-${size}-${validAddons.join("/")}`;
    setCart((current) => {
      const existing = current.findIndex(
        (cartItem) => `${cartItem.id}-${cartItem.size}-${cartItem.addons.join("/")}` === key,
      );
      if (existing === -1)
        return [...current, { ...item, size, addons: validAddons, unitPrice, qty: quantity }];
      return current.map((cartItem, index) =>
        index === existing ? { ...cartItem, qty: cartItem.qty + quantity } : cartItem,
      );
    });
    setSelectedItem(null);
    setToast(`${item.name} is in your order`);
  };

  const updateCart = (key: string, qty: number) => {
    if (qty < 1) {
      setCart((current) =>
        current.filter((item) => `${item.id}-${item.size}-${item.addons.join("/")}` !== key),
      );
      return;
    }
    setCart((current) =>
      current.map((item) =>
        `${item.id}-${item.size}-${item.addons.join("/")}` === key ? { ...item, qty } : item,
      ),
    );
  };

  const browseMenu = () => {
    setPage("home");
    setTimeout(() => document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" }), 20);
  };

  const checkout = () => {
    setCartOpen(false);
    setPage("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = () => {
    setOrderNumber(`DLT-${Math.floor(2000 + Math.random() * 7000)}`);
    setPage("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (page === "checkout") {
    return (
      <Checkout
        cart={cart}
        total={total}
        subtotal={subtotal}
        delivery={delivery}
        customerName={customerName}
        setCustomerName={setCustomerName}
        onBack={browseMenu}
        onPlaceOrder={placeOrder}
      />
    );
  }
  if (page === "success") {
    return (
      <Success
        orderNumber={orderNumber}
        total={total}
        onTrack={() => setPage("tracking")}
        onMenu={browseMenu}
      />
    );
  }
  if (page === "tracking") {
    return (
      <Tracking
        orderNumber={orderNumber}
        total={total}
        onMenu={browseMenu}
        onHistory={() => setPage("history")}
      />
    );
  }
  if (page === "history") {
    return (
      <OrderHistory
        onMenu={browseMenu}
        onReorder={() => {
          const favouritePizza = menuItems.find((item) => item.id === "nonveg-pizza-chicken-bbq");
          const favouriteSide = menuItems.find((item) => item.id === "garlic-cheese");
          if (favouritePizza) addToCart(favouritePizza, "Medium");
          if (favouriteSide) addToCart(favouriteSide);
          setToast("Your favourite order is back in the cart");
        }}
      />
    );
  }
  if (page === "admin") {
    return (
      <Admin
        view={adminView}
        setView={setAdminView}
        onExit={browseMenu}
        addItemOpen={addItemOpen}
        setAddItemOpen={setAddItemOpen}
      />
    );
  }

  return (
    <main>
      <nav className="top-nav">
        <button
          className="mobile-menu-button"
          aria-label="Open menu"
          onClick={() => setMobileNav(!mobileNav)}
        >
          <Icon name={mobileNav ? "close" : "menu"} />
        </button>
        <button
          className="wordmark"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          DILITE<span>.</span>
        </button>
        <div className={`nav-links ${mobileNav ? "open" : ""}`}>
          <button onClick={browseMenu}>Menu</button>
          <button
            onClick={() =>
              document.querySelector("#offers")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Offers
          </button>
          <button onClick={() => setPage("tracking")}>Track order</button>
          <button
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Contact
          </button>
        </div>
        <button
          className={`cart-button ${itemCount > 0 ? "cart-float" : ""}`}
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart, ${itemCount} items, ${inr(total)}`}
        >
          <Icon name="bag" size={18} />
          <span className="cart-count">{itemCount}</span>
          <span className="cart-total">{inr(total)}</span>
        </button>
      </nav>

      <section className="hero">
        <img
          className="hero-image"
          src="/images/dilite-hero.png"
          alt="Fresh pizza being pulled from a wood-fired oven"
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="eyebrow">
            <i /> BIDHOLI · DEHRADUN
          </p>
          <h1>
            Hot.
            <br />
            Late.
            <br />
            <em>Yours.</em>
          </h1>
          <p className="hero-sub">
            Wood-fired pizza, pasta, and late-night snacks from the kitchen on Bidholi main road.
          </p>
          <div className="hero-actions">
            <button className="button primary large" onClick={browseMenu}>
              Order now <Icon name="arrow" size={19} />
            </button>
            <button className="button ghost" onClick={browseMenu}>
              See the menu <Icon name="chevron" size={17} />
            </button>
          </div>
        </div>
        <div className="hero-bottom hero-status">
          <span className="live-dot" /> Kitchen open <b>· closes 2:00 AM</b>
        </div>
        <div className="hero-bottom hero-rating">
          4.7 <span>★</span> · 1.2k orders this month
        </div>
        <div className="scroll-cue">
          <i />
        </div>
      </section>

      <section className="offer-strip" id="offers" aria-label="Current offers">
        <div className="marquee">
          <span>
            Order 1 Large, get 1 regular <b>FREE</b>
          </span>
          <i>◆</i>
          <span>
            Free delivery over <b>₹399</b>
          </span>
          <i>◆</i>
          <span>
            Student combo from <b>₹249</b>
          </span>
          <i>◆</i>
          <span>
            Order 1 Large, get 1 regular <b>FREE</b>
          </span>
          <i>◆</i>
        </div>
      </section>

      <section className="menu-section section-shell" id="menu">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <i /> CHOOSE YOUR DAMAGE
            </p>
            <h2>The menu.</h2>
          </div>
          <p>{menuItems.length} items · veg & non-veg</p>
        </div>
        <div className="category-rail" role="tablist" aria-label="Menu categories">
          {categories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={activeCategory === category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="menu-sections">
          {menuSections.map((section) => (
            <MenuSection
              key={section.label}
              label={section.label}
              detail={section.detail}
              items={section.items}
              showViewAll={activeCategory === "All"}
              onViewAll={() => setActiveCategory(section.label)}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="section-shell">
          <p className="eyebrow">
            <i /> THE DILITE STANDARD
          </p>
          <div className="why-grid">
            <InfoBlock
              number="01"
              title="At your door in 30."
              text="Fast, hot, and very much worth leaving the study table for."
              icon="clock"
            />
            <InfoBlock
              number="02"
              title="The oven does the talking."
              text="Dough, flame, and just enough char on every crust."
              icon="fire"
            />
            <InfoBlock
              number="03"
              title="Hostel-wallet friendly."
              text="Big late-night energy without the 4-digit checkout."
              icon="spark"
            />
          </div>
        </div>
      </section>

      <section className="story section-shell">
        <div className="story-image">
          <img
            src={image("photo-1579751626657-72bc17010498")}
            alt="Warm wood-fired kitchen with pizza"
          />
        </div>
        <div className="story-copy">
          <p className="eyebrow">
            <i /> FROM BIDHOLI, WITH HEAT
          </p>
          <h2>
            Made for the
            <br />
            <em>after-hours.</em>
          </h2>
          <p>
            We are the little kitchen on Bidholi main road making the kind of food you text your
            friends about at 11:40 PM. Good dough. Good people. No sleepy flavours.
          </p>
          <blockquote>
            <span>“</span>Do good. Be nice. Order pizza. Repeat.
          </blockquote>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-grid section-shell">
          <div className="footer-brand">
            <button className="wordmark">
              DILITE<span>.</span>
            </button>
            <p>The late-night kitchen for a hungry Bidholi.</p>
          </div>
          <div>
            <h4>On the menu</h4>
            <a href="#menu">Pizza</a>
            <a href="#menu">Pasta</a>
            <a href="#menu">Burgers & rolls</a>
            <a href="#menu">Drinks</a>
          </div>
          <div>
            <h4>Say hello</h4>
            <a href="tel:+919410000000">+91 94100 00000</a>
            <a href="tel:+917017000000">+91 70170 00000</a>
            <a className="whatsapp-link" href="https://wa.me/919410000000">
              <Icon name="whatsapp" size={17} /> WhatsApp us
            </a>
          </div>
          <div>
            <h4>Find the fire</h4>
            <p>
              Bidholi Main Road
              <br />
              Dehradun, Uttarakhand
            </p>
            <p className="hours">Every day · 11 AM — 2 AM</p>
            <div className="map-tile">
              <span>✦</span> Bidholi main road
            </div>
          </div>
        </div>
        <div className="footer-bottom section-shell">
          <span>© 2025 Dilite · Bidholi, Dehradun</span>
          <span>Prices include taxes. Delivery charged at checkout.</span>
          <span>Privacy · Terms</span>
        </div>
      </footer>

      {selectedItem && (
        <ItemSheet item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={addToCart} />
      )}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        subtotal={subtotal}
        delivery={delivery}
        total={total}
        updateCart={updateCart}
        onClear={() => setCart([])}
        onCheckout={checkout}
        onBrowse={browseMenu}
      />
      {toast && (
        <div className="toast">
          <span className="toast-check">
            <Icon name="check" size={14} />
          </span>
          {toast}
          <button onClick={() => setToast("")}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </main>
  );
}

function MenuSection({
  label,
  detail,
  items,
  showViewAll,
  onViewAll,
  onSelect,
}: {
  label: string;
  detail?: string;
  items: MenuItem[];
  showViewAll: boolean;
  onViewAll: () => void;
  onSelect: (item: MenuItem) => void;
}) {
  const groups =
    label === "Pizza Mania"
      ? ["Combo Deals", "Single Topping · Regular", "Double Topping · Regular", "Non-Veg · Regular"]
      : [];

  return (
    <section className="catalogue-section">
      <header className="catalogue-section-heading">
        <div>
          <h3>{label}</h3>
          <p>{detail ?? `${items.length} dishes, made fresh`}</p>
        </div>
        <div>
          <span>{items.length} items</span>
          {showViewAll && (
            <button onClick={onViewAll}>
              View all <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
      </header>
      {groups.length ? (
        <div className="pizza-mania-groups">
          {groups.map((group) => {
            const groupedItems = items.filter((item) => item.group === group);
            if (!groupedItems.length) return null;
            return (
              <div className="menu-subgroup" key={group}>
                <h4>{group}</h4>
                <div className="menu-grid">
                  {groupedItems.map((item) => (
                    <MenuCard item={item} onSelect={onSelect} key={item.id} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="menu-grid">
          {items.map((item) => (
            <MenuCard item={item} onSelect={onSelect} key={item.id} />
          ))}
        </div>
      )}
    </section>
  );
}

function MenuCard({ item, onSelect }: { item: MenuItem; onSelect: (item: MenuItem) => void }) {
  const isFullPizza = item.productKind === "full-pizza";
  const itemMeta =
    item.productKind === "full-pizza"
      ? '7" / 10" / 13"'
      : item.productKind === "regular-pizza"
        ? 'Regular 7"'
        : item.productKind === "combo"
          ? "Combo deal"
          : "Made fresh";

  return (
    <article className={`item-card ${!item.available ? "unavailable" : ""}`}>
      <button
        className="card-image-wrap"
        onClick={() => onSelect(item)}
        aria-label={`Customise ${item.name}`}
      >
        <img src={item.image} alt={item.name} />
        <span className="food-badge">
          <VegMark veg={item.veg} />
        </span>
        {item.tag && <span className={`tag ${item.tag === "NEW" ? "new" : ""}`}>{item.tag}</span>}
        {!item.available && <span className="sold-out">Sold out</span>}
      </button>
      <div className="item-info">
        <div className="item-topline">
          <h3>{item.name}</h3>
          <span className="item-rating">★ {item.rating}</span>
        </div>
        <p>{item.description}</p>
        <small>
          <Icon name="clock" size={14} /> {item.time} min · {itemMeta}
        </small>
        <div className="item-bottom">
          <div>
            <small>{isFullPizza ? "FROM" : "PRICE"}</small>
            <strong>{inr(item.price)}</strong>
          </div>
          <button
            className="button primary card-add"
            disabled={!item.available}
            onClick={() => onSelect(item)}
          >
            Add <Icon name="plus" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function InfoBlock({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: IconName;
}) {
  return (
    <article className="info-block">
      <span>{number}</span>
      <div className="info-icon">
        <Icon name={icon} size={25} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function ItemSheet({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: (item: MenuItem, size?: string, addons?: string[], quantity?: number) => void;
}) {
  const isFullPizza = item.productKind === "full-pizza";
  const isRegularPizza = item.productKind === "regular-pizza";
  const isCombo = item.productKind === "combo";
  const itemAddons = getItemAddons(item);
  const [size, setSize] = useState(isFullPizza ? "Small" : "");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const addOnCost = selectedAddons.reduce(
    (total, name) => total + (itemAddons.find((entry) => entry.name === name)?.price ?? 0),
    0,
  );
  const price =
    (item.price +
      (isFullPizza ? (sizes.find((entry) => entry.label === size)?.price ?? 0) : 0) +
      addOnCost) *
    quantity;
  return (
    <div className="overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="item-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-sheet-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="close-button" aria-label="Close customisation" onClick={onClose}>
          <Icon name="close" />
        </button>
        <div className="sheet-image">
          <img src={item.image} alt={item.name} />
          <span className="food-badge">
            <VegMark veg={item.veg} />
          </span>
        </div>
        <div className="sheet-content">
          <div className="sheet-title">
            <div>
              <p className="eyebrow">
                <i /> {item.category}
              </p>
              <h2 id="item-sheet-title">{item.name}</h2>
            </div>
            <strong>{isFullPizza ? `from ${inr(item.price)}` : inr(item.price)}</strong>
          </div>
          <p className="sheet-description">{item.description}</p>
          {isFullPizza && (
            <fieldset>
              <legend>Choose your size</legend>
              <div className="size-options">
                {sizes.map((option) => (
                  <button
                    type="button"
                    className={size === option.label ? "selected" : ""}
                    onClick={() => setSize(option.label)}
                    key={option.label}
                  >
                    <span>
                      <b>{option.label}</b>
                      <small>{option.sub}</small>
                    </span>
                    <strong>{inr(item.price + option.price)}</strong>
                    <i>{size === option.label && <Icon name="check" size={13} />}</i>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {(isRegularPizza || isCombo) && (
            <div className="product-format">
              <span>{isCombo ? "WHAT'S INCLUDED" : "PIZZA SIZE"}</span>
              <strong>
                {isCombo ? "Combo deal · all pizzas are regular 7-inch" : 'Regular 7" pizza'}
              </strong>
            </div>
          )}
          {itemAddons.length > 0 && (
            <fieldset>
              <legend>
                Make it yours <small>optional</small>
              </legend>
              <div className="addon-options">
                {itemAddons.map((addon) => (
                  <button
                    type="button"
                    key={addon.name}
                    className={selectedAddons.includes(addon.name) ? "selected" : ""}
                    onClick={() =>
                      setSelectedAddons((current) =>
                        current.includes(addon.name)
                          ? current.filter((name) => name !== addon.name)
                          : [...current, addon.name],
                      )
                    }
                  >
                    <i>{selectedAddons.includes(addon.name) && <Icon name="check" size={13} />}</i>
                    <span>{addon.name}</span>
                    <strong>+{inr(addon.price)}</strong>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <div className="allergen">
            <span>i</span> Prepared in a kitchen that handles dairy, gluten, and nuts.
          </div>
        </div>
        <div className="sheet-footer">
          <QtyStepper value={quantity} onChange={setQuantity} />
          <button
            className="button primary add-to-cart"
            onClick={() => onAdd(item, size, selectedAddons, quantity)}
          >
            Add to cart <span>— {inr(price)}</span>
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

function CartDrawer({
  open,
  onClose,
  cart,
  subtotal,
  delivery,
  total,
  updateCart,
  onClear,
  onCheckout,
  onBrowse,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  updateCart: (key: string, qty: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  onBrowse: () => void;
}) {
  const remaining = Math.max(0, 399 - subtotal);
  return (
    <div className={`cart-layer ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="cart-scrim" onClick={onClose} />
      <aside className="cart-drawer" aria-label="Your order">
        <header>
          <div>
            <p className="eyebrow">
              <i /> {cart.reduce((count, item) => count + item.qty, 0)} ITEMS
            </p>
            <h2>Your order.</h2>
          </div>
          <div>
            <button className="text-danger" onClick={onClear} disabled={!cart.length}>
              Clear
            </button>
            <button className="close-button in-header" aria-label="Close cart" onClick={onClose}>
              <Icon name="close" />
            </button>
          </div>
        </header>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="pizza-box">
              <span />
              <span />
              <i />
            </div>
            <h3>Nothing in here yet.</h3>
            <p>The menu is right there. We won't judge what happens next.</p>
            <button
              className="button ghost"
              onClick={() => {
                onClose();
                onBrowse();
              }}
            >
              Browse menu <Icon name="arrow" size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => {
                const key = `${item.id}-${item.size}-${item.addons.join("/")}`;
                return (
                  <article className="cart-line" key={key}>
                    <img src={item.image} alt="" />
                    <div className="cart-line-copy">
                      <div>
                        <h3>{item.name}</h3>
                        <button
                          aria-label={`Remove ${item.name}`}
                          onClick={() => updateCart(key, 0)}
                        >
                          <Icon name="close" size={15} />
                        </button>
                      </div>
                      <p>{itemOptionLabel(item)}</p>
                      <div>
                        <QtyStepper
                          compact
                          value={item.qty}
                          onChange={(qty) => updateCart(key, qty)}
                        />
                        <strong>{inr(item.unitPrice * item.qty)}</strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="delivery-progress">
              <div>
                <span>
                  {subtotal >= 399
                    ? "You unlocked free delivery"
                    : `${inr(remaining)} away from free delivery`}
                </span>
                <b>{inr(subtotal)} / ₹399</b>
              </div>
              <i>
                <i style={{ width: `${Math.min(100, (subtotal / 399) * 100)}%` }} />
              </i>
            </div>
            <div className="cart-summary">
              <p>
                <span>Subtotal</span>
                <strong>{inr(subtotal)}</strong>
              </p>
              <p>
                <span>Delivery</span>
                <strong className={delivery === 0 ? "success-text" : ""}>
                  {delivery === 0 ? "FREE" : inr(delivery)}
                </strong>
              </p>
              <p>
                <span>Taxes</span>
                <strong>Included</strong>
              </p>
              <div>
                <span>Total</span>
                <strong>{inr(total)}</strong>
              </div>
            </div>
            <button className="button primary checkout-button" onClick={onCheckout}>
              Checkout <span>{inr(total)}</span>
              <Icon name="arrow" size={18} />
            </button>
          </>
        )}
      </aside>
    </div>
  );
}

function Checkout({
  cart,
  total,
  subtotal,
  delivery,
  customerName,
  setCustomerName,
  onBack,
  onPlaceOrder,
}: {
  cart: CartItem[];
  total: number;
  subtotal: number;
  delivery: number;
  customerName: string;
  setCustomerName: (value: string) => void;
  onBack: () => void;
  onPlaceOrder: () => void;
}) {
  const [payment, setPayment] = useState("COD");
  const [scheduled, setScheduled] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  return (
    <main className="checkout-page">
      <nav className="checkout-nav">
        <button className="wordmark" onClick={onBack}>
          DILITE<span>.</span>
        </button>
        <button className="back-menu" onClick={onBack}>
          ← Back to menu
        </button>
        <div className="secure-checkout">
          <span>✓</span> Secure checkout
        </div>
      </nav>
      <div className="checkout-shell">
        <div className="checkout-main">
          <div className="checkout-intro">
            <p className="eyebrow">
              <i /> ALMOST THERE
            </p>
            <h1>Bring it home.</h1>
            <p>We’ll get your order rolling as soon as you hit the button.</p>
          </div>
          <CheckoutStep number="01" title="Delivery details" active>
            <div className="field-grid">
              <Field
                label="Your name"
                placeholder="e.g. Aaryan Sharma"
                value={customerName}
                onChange={setCustomerName}
              />
              <Field label="Phone number" prefix="+91" placeholder="98765 43210" mono />
            </div>
            <div className="field-grid address-grid">
              <SelectField
                label="Hostel"
                options={[
                  "Choose your hostel",
                  "Hostel A",
                  "Hostel B",
                  "Hostel C",
                  "Girls Hostel",
                  "Day Scholar",
                  "Other",
                ]}
              />
              <Field label="Room number" placeholder="e.g. B-214" />
            </div>
            <Field
              label="Landmark / delivery note"
              placeholder="Near the common room, blue door"
              helper="A tiny clue means a much faster drop-off."
            />
            <div className="schedule-switch">
              <button className={!scheduled ? "selected" : ""} onClick={() => setScheduled(false)}>
                Deliver now <small>~32 min</small>
              </button>
              <button className={scheduled ? "selected" : ""} onClick={() => setScheduled(true)}>
                Schedule <small>Pick a time</small>
              </button>
            </div>
            {scheduled && (
              <div className="time-pills">
                <button>Today · 10:30 PM</button>
                <button className="selected">Today · 11:00 PM</button>
                <button>Today · 11:30 PM</button>
              </div>
            )}
          </CheckoutStep>
          <CheckoutStep number="02" title="Payment">
            <div className="payment-options">
              {[
                ["COD", "Cash on delivery", "Pay when the food arrives."],
                ["UPI", "UPI", "Pay with any UPI app."],
                ["CARD", "Card", "Coming soon"],
              ].map(([value, title, desc]) => (
                <button
                  key={value}
                  disabled={value === "CARD"}
                  className={`${payment === value ? "selected" : ""} ${value === "CARD" ? "disabled" : ""}`}
                  onClick={() => setPayment(value)}
                >
                  <i>{payment === value && <Icon name="check" size={13} />}</i>
                  <span>
                    <b>{title}</b>
                    <small>{desc}</small>
                  </span>
                  {value === "CARD" && <em>SOON</em>}
                </button>
              ))}
            </div>
            {payment === "UPI" && (
              <Field
                label="UPI ID"
                placeholder="name@upi"
                helper="We’ll open your payment app after placing the order."
              />
            )}
          </CheckoutStep>
          <CheckoutStep number="03" title="Confirm the good stuff">
            <div className="coupon-row">
              <label>
                Coupon code
                <input
                  value={coupon}
                  placeholder="STUDENT10"
                  onChange={(event) => setCoupon(event.target.value.toUpperCase())}
                />
              </label>
              <button
                className="button secondary"
                onClick={() =>
                  setCouponStatus(
                    coupon === "STUDENT10"
                      ? "10% student discount applied."
                      : "Try STUDENT10 for this demo.",
                  )
                }
              >
                Apply
              </button>
            </div>
            {couponStatus && (
              <p className={`coupon-status ${coupon === "STUDENT10" ? "good" : ""}`}>
                {couponStatus}
              </p>
            )}
            <Field
              label="Order notes"
              textarea
              placeholder="Extra chilli, no onion, call on arrival..."
              helper="We’ll pass this straight to the kitchen."
            />
          </CheckoutStep>
        </div>
        <aside className="order-summary">
          <p className="eyebrow">
            <i /> YOUR ORDER
          </p>
          <h2>The tasty bit.</h2>
          {cart.length ? (
            <div className="summary-lines">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`}>
                  <img src={item.image} alt="" />
                  <span>
                    <b>
                      {item.qty} × {item.name}
                    </b>
                    <small>{itemOptionLabel(item)}</small>
                  </span>
                  <strong>{inr(item.unitPrice * item.qty)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="summary-empty">Your cart is waiting for a good idea.</p>
          )}
          <div className="summary-totals">
            <p>
              <span>Subtotal</span>
              <strong>{inr(subtotal)}</strong>
            </p>
            <p>
              <span>Delivery</span>
              <strong>{delivery ? inr(delivery) : "FREE"}</strong>
            </p>
            <div>
              <span>Total</span>
              <strong>{inr(total)}</strong>
            </div>
          </div>
          <div className="eta-note">
            <Icon name="clock" size={17} />
            <span>
              <b>Arrives in ~32 min</b>
              <small>Kitchen is taking orders</small>
            </span>
          </div>
          <button
            className="button primary place-order"
            disabled={!cart.length}
            onClick={onPlaceOrder}
          >
            Place order <span>— {inr(total)}</span>
            <Icon name="arrow" size={18} />
          </button>
          <p className="whatsapp-caption">You'll get a confirmation on WhatsApp.</p>
        </aside>
      </div>
    </main>
  );
}

function CheckoutStep({
  number,
  title,
  active,
  children,
}: {
  number: string;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`checkout-step ${active ? "active" : ""}`}>
      <header>
        <span>{number}</span>
        <h2>{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  prefix,
  helper,
  mono,
  textarea = false,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  prefix?: string;
  helper?: string;
  mono?: boolean;
  textarea?: boolean;
}) {
  const field = textarea ? (
    <textarea placeholder={placeholder} />
  ) : (
    <input
      className={mono ? "mono" : ""}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
    />
  );
  return (
    <label className={`form-field ${textarea ? "full-field" : ""}`}>
      <span>{label}</span>
      <div>
        {prefix && <b>{prefix}</b>}
        {field}
      </div>
      {helper && <small>{helper}</small>}
    </label>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <div>
        <select>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <Icon name="chevron" size={16} />
      </div>
    </label>
  );
}

function Success({
  orderNumber,
  total,
  onTrack,
  onMenu,
}: {
  orderNumber: string;
  total: number;
  onTrack: () => void;
  onMenu: () => void;
}) {
  return (
    <main className="success-page">
      <div className="success-noise" />
      <section className="success-content">
        <div className="success-check">
          <Icon name="check" size={47} />
        </div>
        <p className="eyebrow">
          <i /> THE KITCHEN HAS IT
        </p>
        <h1>Order placed.</h1>
        <button
          className="order-number"
          onClick={() => navigator.clipboard?.writeText(orderNumber)}
        >
          <span>#{orderNumber}</span>
          <Icon name="copy" size={15} />
        </button>
        <div className="success-eta">
          <div>
            <span>Arriving by</span>
            <strong>
              12:18 <small>AM</small>
            </strong>
          </div>
          <i>
            <i />
          </i>
          <p>
            <Icon name="fire" size={16} /> Your pizza is about to meet the oven.
          </p>
        </div>
        <div className="success-actions">
          <button className="button primary large" onClick={onTrack}>
            Track order <Icon name="arrow" size={18} />
          </button>
          <button className="button ghost" onClick={onMenu}>
            Back to menu
          </button>
        </div>
        <p className="success-total">
          Order total <b>{inr(total)}</b>
        </p>
      </section>
    </main>
  );
}

function Tracking({
  orderNumber,
  total,
  onMenu,
  onHistory,
}: {
  orderNumber: string;
  total: number;
  onMenu: () => void;
  onHistory: () => void;
}) {
  const steps = [
    ["Order received", "11:46 PM"],
    ["In the kitchen", "11:48 PM"],
    ["Out for delivery", "—"],
    ["Delivered", "—"],
  ];
  return (
    <main className="dark-page tracking-page">
      <SimpleNav onMenu={onMenu} onHistory={onHistory} />
      <div className="tracking-shell">
        <header className="tracking-header">
          <p className="eyebrow">
            <i /> LIVE ORDER TRACKING
          </p>
          <h1>We’re on it.</h1>
          <p>
            Order <b>#{orderNumber}</b> · Your late-night fix is being made fresh.
          </p>
        </header>
        <section className="tracking-card">
          <div className="tracking-card-top">
            <div>
              <span>ESTIMATED DELIVERY</span>
              <strong>12:18 AM</strong>
            </div>
            <div>
              <span>ORDER TOTAL</span>
              <strong>{inr(total)}</strong>
            </div>
          </div>
          <div className="tracking-timeline">
            {steps.map(([title, time], index) => (
              <div
                key={title}
                className={`track-step ${index < 2 ? "complete" : ""} ${index === 1 ? "current" : ""}`}
              >
                <div className="track-node">{index < 2 && <Icon name="check" size={14} />}</div>
                <div>
                  <b>{title}</b>
                  <small>{time}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="tracking-footer">
            <span>
              <i className="live-dot" /> Updated 12s ago
            </span>
            <button onClick={() => window.location.reload()}>Refresh</button>
          </div>
        </section>
        <div className="tracking-actions">
          <a className="button secondary" href="tel:+919410000000">
            <Icon name="phone" size={18} /> Call kitchen
          </a>
          <a className="button ghost whatsapp-button" href="https://wa.me/919410000000">
            <Icon name="whatsapp" size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

function SimpleNav({ onMenu, onHistory }: { onMenu: () => void; onHistory?: () => void }) {
  return (
    <nav className="simple-nav">
      <button className="wordmark" onClick={onMenu}>
        DILITE<span>.</span>
      </button>
      <div>
        {onHistory && <button onClick={onHistory}>My orders</button>}
        <button onClick={onMenu}>Menu</button>
      </div>
    </nav>
  );
}

function OrderHistory({ onMenu, onReorder }: { onMenu: () => void; onReorder: () => void }) {
  const [tab, setTab] = useState("Past");
  return (
    <main className="dark-page history-page">
      <SimpleNav onMenu={onMenu} />
      <div className="history-shell">
        <p className="eyebrow">
          <i /> A TASTE FOR GOOD DECISIONS
        </p>
        <h1>My orders.</h1>
        <div className="history-tabs">
          {["Active", "Past", "Cancelled"].map((item) => (
            <button
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
              key={item}
            >
              {item}
              {item === "Past" && <span>3</span>}
            </button>
          ))}
        </div>
        {tab === "Past" ? (
          <div className="history-list">
            <HistoryCard
              id="DLT-2481"
              date="Today · 11:46 PM"
              total="₹420"
              status="Delivered"
              images={menuItemsById("nonveg-pizza-chicken-bbq", "garlic-cheese")}
              onReorder={onReorder}
            />
            <HistoryCard
              id="DLT-1964"
              date="27 Feb · 10:21 PM"
              total="₹375"
              status="Delivered"
              images={menuItemsById("veg-pizza-margherita", "pasta-white-veg", "drink-oreo-shake")}
              onReorder={onReorder}
            />
            <HistoryCard
              id="DLT-1730"
              date="21 Feb · 11:09 PM"
              total="₹280"
              status="Delivered"
              images={menuItemsById("burger-chicken")}
              onReorder={onReorder}
            />
          </div>
        ) : (
          <div className="empty-history">
            <div>
              <Icon name="bag" size={34} />
            </div>
            <h2>Nothing here right now.</h2>
            <p>
              {tab === "Active"
                ? "Your next great decision will show up here."
                : "No cancelled orders. A clean record."}
            </p>
            <button className="button ghost" onClick={onMenu}>
              Browse menu
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function HistoryCard({
  id,
  date,
  total,
  status,
  images,
  onReorder,
}: {
  id: string;
  date: string;
  total: string;
  status: string;
  images: MenuItem[];
  onReorder: () => void;
}) {
  return (
    <article className="history-card">
      <div className="history-card-main">
        <div className="stacked-images">
          {images.map((item) => (
            <img key={item.id} src={item.image} alt="" />
          ))}
        </div>
        <div>
          <p>{date}</p>
          <h2>#{id}</h2>
          <span className="status delivered">
            <Icon name="check" size={12} /> {status}
          </span>
        </div>
      </div>
      <div className="history-card-end">
        <strong>{total}</strong>
        <button className="button ghost" onClick={onReorder}>
          Reorder <Icon name="arrow" size={15} />
        </button>
      </div>
    </article>
  );
}

function Admin({
  view,
  setView,
  onExit,
  addItemOpen,
  setAddItemOpen,
}: {
  view: "dashboard" | "orders" | "menu";
  setView: (view: "dashboard" | "orders" | "menu") => void;
  onExit: () => void;
  addItemOpen: boolean;
  setAddItemOpen: (open: boolean) => void;
}) {
  const nav = [
    ["dashboard", "Dashboard"],
    ["orders", "Live orders"],
    ["menu", "Menu items"],
  ] as const;
  return (
    <main className="admin-page">
      <aside className="admin-rail">
        <button className="wordmark">
          DILITE<span>.</span>
        </button>
        <p>ADMIN / KITCHEN</p>
        <nav>
          {nav.map(([key, label], index) => (
            <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>
              <span>0{index + 1}</span>
              {label}
            </button>
          ))}
          <button>
            <span>04</span>Categories
          </button>
          <button>
            <span>05</span>Customers
          </button>
        </nav>
        <button className="exit-admin" onClick={onExit}>
          ← Exit dashboard
        </button>
      </aside>
      <section className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">
              <i /> TUESDAY, 11:52 PM
            </p>
            <h1>
              {view === "dashboard"
                ? "Kitchen pulse."
                : view === "orders"
                  ? "Live orders."
                  : "Menu items."}
            </h1>
          </div>
          <div className="admin-user">
            <span>
              <i /> Kitchen open
            </span>
            <button>KS</button>
          </div>
        </header>
        {view === "dashboard" && <AdminDashboard />}
        {view === "orders" && <LiveOrders />}
        {view === "menu" && <AdminMenu onAdd={() => setAddItemOpen(true)} />}
      </section>
      {addItemOpen && <AddItemDrawer onClose={() => setAddItemOpen(false)} />}
    </main>
  );
}

function AdminDashboard() {
  const stats = [
    ["Today’s revenue", "₹8,460", "+18.2%"],
    ["Orders today", "34", "+12.4%"],
    ["Avg. order value", "₹249", "+4.6%"],
    ["Top item", "Chicken BBQ", "12 orders"],
  ];
  return (
    <div className="dashboard-view">
      <div className="stat-grid">
        {stats.map(([label, value, trend], index) => (
          <article className="stat-card" key={label}>
            <p>{label}</p>
            <strong className={index === 3 ? "item-stat" : ""}>{value}</strong>
            <span>{trend}</span>
            <div className={`spark spark-${index}`}>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>
        ))}
      </div>
      <div className="admin-main-grid">
        <section className="chart-panel">
          <header>
            <div>
              <h2>Revenue overview</h2>
              <p>Last 7 days</p>
            </div>
            <button>
              7 days <Icon name="chevron" size={14} />
            </button>
          </header>
          <div className="bar-chart">
            {[42, 58, 45, 72, 55, 88, 76].map((height, index) => (
              <div className={index === 5 ? "active" : ""} key={index}>
                <i style={{ height: `${height}%` }} />
                <span>{["W", "T", "F", "S", "S", "M", "T"][index]}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="hours-panel">
          <header>
            <h2>Busiest hours</h2>
            <span>Order volume</span>
          </header>
          <div className="heat-strip">
            {["5P", "6P", "7P", "8P", "9P", "10P", "11P", "12A", "1A"].map((hour, index) => (
              <div key={hour}>
                <i className={`heat heat-${index}`} />
                <span>{hour}</span>
              </div>
            ))}
          </div>
          <div className="hot-hour">
            <Icon name="fire" size={18} />
            <span>
              <b>11 PM is getting hot.</b>
              <small>Most orders arrive between 10:45–11:30 PM.</small>
            </span>
          </div>
        </section>
      </div>
      <section className="recent-orders">
        <header>
          <div>
            <h2>Fresh from the counter</h2>
            <p>Latest orders right now</p>
          </div>
          <button>
            View all <Icon name="arrow" size={15} />
          </button>
        </header>
        <div>
          <OrderRow
            id="DLT-2481"
            name="Aaryan Sharma"
            room="Hostel B · 214"
            total="₹480"
            status="New"
          />
          <OrderRow
            id="DLT-2480"
            name="Ananya Verma"
            room="Girls Hostel · 112"
            total="₹320"
            status="Preparing"
          />
          <OrderRow
            id="DLT-2479"
            name="Dev Mehta"
            room="Hostel A · 039"
            total="₹390"
            status="Out for delivery"
          />
        </div>
      </section>
    </div>
  );
}

function OrderRow({
  id,
  name,
  room,
  total,
  status,
}: {
  id: string;
  name: string;
  room: string;
  total: string;
  status: string;
}) {
  return (
    <article className="admin-order-row">
      <span className={`order-status-dot ${status.toLowerCase().replaceAll(" ", "-")}`} />
      <b>#{id}</b>
      <span>
        {name}
        <small>{room}</small>
      </span>
      <span>3 items</span>
      <strong>{total}</strong>
      <em className={status.toLowerCase().replaceAll(" ", "-")}>{status}</em>
      <button>
        <Icon name="chevron" size={16} />
      </button>
    </article>
  );
}

function LiveOrders() {
  const columns = [
    ["New", ["DLT-2481", "DLT-2483"]],
    ["Preparing", ["DLT-2480", "DLT-2478"]],
    ["Out for delivery", ["DLT-2479"]],
    ["Delivered", ["DLT-2477"]],
  ] as const;
  return (
    <div className="live-orders-view">
      <div className="board-meta">
        <span>
          <i className="live-dot" /> 6 orders being worked on
        </span>
        <button className="button secondary">Refresh board</button>
      </div>
      <div className="kanban">
        {columns.map(([title, orders]) => (
          <section key={title}>
            <header>
              <h2>{title}</h2>
              <span>{orders.length}</span>
            </header>
            <div>
              {orders.map((id, index) => (
                <article className="kanban-card" key={id}>
                  <div>
                    <b>#{id}</b>
                    <span className={index === 0 && title !== "Delivered" ? "hot-timer" : ""}>
                      {index === 0 && title !== "Delivered" ? "22 min" : "8 min"}
                    </span>
                  </div>
                  <strong>
                    {index % 2 === 0 ? "₹480" : "₹320"}{" "}
                    <small>· {index % 2 === 0 ? "4" : "2"} items</small>
                  </strong>
                  <p>{index % 2 === 0 ? "Hostel B · Room 214" : "Girls Hostel · Room 112"}</p>
                  <div className="kanban-food">
                    <img
                      src={index % 2 === 0 ? foodImages.chickenPizza : foodImages.pastaRed}
                      alt=""
                    />
                    <span>{index % 2 === 0 ? "Chicken BBQ + 3" : "Red Sauce Pasta + 1"}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function AdminMenu({ onAdd }: { onAdd: () => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const visibleItems = useMemo(
    () =>
      menuItems.filter((item) => {
        const matchesCategory = category === "All categories" || item.category === category;
        const searchable = `${item.name} ${item.description} ${item.category}`.toLowerCase();
        return matchesCategory && searchable.includes(query.trim().toLowerCase());
      }),
    [category, query],
  );

  return (
    <div className="menu-admin-view">
      <div className="menu-toolbar">
        <div className="menu-search">
          ⌕{" "}
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 85 dishes..."
            aria-label="Search menu items"
          />
        </div>
        <label className="admin-category-select">
          <span className="sr-only">Filter category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All categories</option>
            {categories.slice(3).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Icon name="chevron" size={14} />
        </label>
        <button className="button primary" onClick={onAdd}>
          Add item <Icon name="plus" size={17} />
        </button>
      </div>
      <p className="admin-result-count">
        Showing {visibleItems.length} of {menuItems.length} menu items
      </p>
      <div className="item-table">
        <div className="table-head">
          <span>Menu item</span>
          <span>Category</span>
          <span>Type</span>
          <span>Price</span>
          <span>Available</span>
          <span />
        </div>
        {visibleItems.length ? (
          visibleItems.map((item) => {
            const isAvailable = availability[item.id] ?? item.available;
            return (
              <div className="table-row" key={item.id}>
                <span className="admin-dish">
                  <img src={item.image} alt="" />
                  <b>
                    {item.name}
                    <small>{item.description}</small>
                  </b>
                </span>
                <span>
                  <i className="category-chip">{item.category}</i>
                </span>
                <span>
                  <VegMark veg={item.veg} />
                </span>
                <strong>{inr(item.price)}</strong>
                <button
                  className={`toggle ${isAvailable ? "on" : ""}`}
                  onClick={() =>
                    setAvailability((current) => ({ ...current, [item.id]: !isAvailable }))
                  }
                  aria-label={`Toggle availability for ${item.name}`}
                >
                  <i />
                </button>
                <button className="row-more">•••</button>
              </div>
            );
          })
        ) : (
          <div className="admin-empty-results">
            <Icon name="spark" size={18} />
            <div>
              <b>No dishes match that search.</b>
              <span>Try a name or switch back to all categories.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddItemDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="admin-drawer-layer">
      <div onClick={onClose} />
      <aside className="add-item-drawer">
        <header>
          <div>
            <p className="eyebrow">
              <i /> MENU MANAGEMENT
            </p>
            <h2>Add menu item</h2>
          </div>
          <button className="close-button in-header" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>
        <div className="add-item-form">
          <Field label="Dish name" placeholder="e.g. The Firestarter" />
          <SelectField label="Category" options={categories.slice(3)} />
          <Field label="Description" textarea placeholder="Tell them why it is delicious..." />
          <Field label="Base price" prefix="₹" placeholder="0" mono />
          <div className="veg-choice">
            <span>Dietary type</span>
            <button className="selected">
              <VegMark veg /> Veg
            </button>
            <button>
              <VegMark veg={false} /> Non-veg
            </button>
          </div>
          <label className="upload-zone">
            <Icon name="plus" size={22} />
            <b>Drop food image here</b>
            <small>PNG, JPG up to 10MB · 4:3 looks best</small>
          </label>
          <label className="available-switch">
            <span>
              <b>Available to order</b>
              <small>Customers can see and add this dish.</small>
            </span>
            <button className="toggle on">
              <i />
            </button>
          </label>
        </div>
        <footer>
          <button className="button ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="button primary" onClick={onClose}>
            Save menu item <Icon name="arrow" size={17} />
          </button>
        </footer>
      </aside>
    </div>
  );
}
