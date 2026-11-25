// Readable database report for the Dilite project (run via: mongosh dilite --file scripts/db-report.js)
const pad = (value, width) => String(value ?? "").padEnd(width).slice(0, width);

print("\n--- COLLECTION COUNTS ---");
print("menu_items : " + db.menu_items.countDocuments());
print("categories : " + db.categories.countDocuments());
print("orders     : " + db.orders.countDocuments());

print("\n--- MENU BY CATEGORY ---");
db.menu_items
  .aggregate([{ $group: { _id: "$category", n: { $sum: 1 } } }, { $sort: { _id: 1 } }])
  .forEach((row) => print("  " + pad(row._id, 18) + row.n));

print("\n--- LATEST ORDERS ---");
db.orders
  .find(
    {},
    {
      orderNumber: 1,
      "customer.name": 1,
      total: 1,
      status: 1,
      "payment.status": 1,
      _id: 0,
    },
  )
  .sort({ createdAt: -1 })
  .limit(10)
  .forEach((order) =>
    print(
      "  " +
        pad(order.orderNumber, 10) +
        pad(order.customer?.name, 18) +
        pad("Rs " + order.total, 8) +
        pad(order.status, 18) +
        (order.payment?.status ?? ""),
    ),
  );

print("\n--- MOST RECENT ORDER IN FULL ---");
const latest = db.orders.find().sort({ createdAt: -1 }).limit(1).toArray()[0];
if (!latest) {
  print("  no orders yet");
} else {
  printjson({
    id: latest.orderNumber,
    status: latest.status,
    total: latest.total,
    customer: latest.customer,
    items: latest.items.map((item) => `${item.qty}x ${item.name} @ ${item.unitPrice}`),
    payment: latest.payment,
    notes: latest.notes,
    placedAt: latest.createdAt,
  });
}
