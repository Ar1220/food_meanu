// DILITE — customer receipt: printable (save as PDF) and plain-text download
import type { ApiOrder } from "./api";

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function receiptText(order: ApiOrder): string {
  const line = "-".repeat(42);
  const items = order.items
    .map((item) => {
      const option = [item.size, ...item.addons].filter(Boolean).join(", ");
      return `  ${item.qty} x ${item.name}${option ? ` (${option})` : ""}\n` +
        `     ${inr(item.unitPrice)} each — ${inr(item.unitPrice * item.qty)}`;
    })
    .join("\n");

  return [
    "        DILITE · BIDHOLI, DEHRADUN",
    "        Do good. Be nice. Order pizza. Repeat.",
    line,
    `Order        : #${order.id}`,
    `Placed       : ${order.createdAt} (${new Date(order.createdAtISO).toLocaleDateString("en-IN")})`,
    `Arriving by  : ${order.estimatedDelivery}`,
    `Status       : ${order.status}`,
    line,
    `Customer     : ${order.customer.name}`,
    `Phone        : ${order.customer.phone}`,
    `Deliver to   : ${order.customer.hostel} · Room ${order.customer.room}`,
    order.customer.landmark ? `Landmark     : ${order.customer.landmark}` : "",
    line,
    "ITEMS",
    items,
    line,
    `Subtotal     : ${inr(order.subtotal)}`,
    `Delivery     : ${order.deliveryFee === 0 ? "FREE" : inr(order.deliveryFee)}`,
    order.discount ? `Discount     : -${inr(order.discount)}` : "",
    `TOTAL        : ${inr(order.total)}`,
    `Payment      : ${order.payment.method} · ${order.payment.status}`,
    order.notes ? `Notes        : ${order.notes}` : "",
    line,
    "Prices include taxes. Keep this receipt for your records.",
    "Questions? Call +91 94100 00000",
  ]
    .filter(Boolean)
    .join("\n");
}

export function downloadReceipt(order: ApiOrder) {
  const blob = new Blob([receiptText(order)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `DILITE-receipt-${order.id}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printReceipt(order: ApiOrder) {
  const rows = order.items
    .map((item) => {
      const option = [item.size, ...item.addons].filter(Boolean).join(", ");
      return `<tr>
        <td>${item.qty}×</td>
        <td>${item.name}${option ? `<small>${option}</small>` : ""}</td>
        <td class="r">${inr(item.unitPrice * item.qty)}</td>
      </tr>`;
    })
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8">
  <title>DILITE receipt ${order.id}</title>
  <style>
    @page { margin: 14mm; }
    * { box-sizing: border-box; }
    body { font: 13px/1.5 "SF Mono", ui-monospace, Consolas, monospace; color: #111; max-width: 420px; margin: 0 auto; padding: 24px; }
    h1 { font: 700 24px/1.1 system-ui, sans-serif; letter-spacing: -0.5px; margin: 0 0 2px; }
    .muted { color: #666; font-size: 11px; }
    hr { border: 0; border-top: 1px dashed #bbb; margin: 14px 0; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 4px 0; vertical-align: top; }
    td small { display: block; color: #666; font-size: 10px; }
    .r { text-align: right; white-space: nowrap; }
    .row { display: flex; justify-content: space-between; padding: 2px 0; }
    .total { font-weight: 700; font-size: 16px; border-top: 1px solid #111; margin-top: 8px; padding-top: 8px; }
    .id { font-size: 15px; font-weight: 700; }
    @media print { body { padding: 0; } }
  </style></head><body>
    <h1>DILITE.</h1>
    <div class="muted">Bidholi, Dehradun · Serving UPES hostels</div>
    <hr>
    <div class="row"><span>Order</span><span class="id">#${order.id}</span></div>
    <div class="row"><span>Placed</span><span>${order.createdAt} · ${new Date(order.createdAtISO).toLocaleDateString("en-IN")}</span></div>
    <div class="row"><span>Arriving by</span><span>${order.estimatedDelivery}</span></div>
    <div class="row"><span>Status</span><span>${order.status}</span></div>
    <hr>
    <div><b>${order.customer.name}</b> · ${order.customer.phone}</div>
    <div>${order.customer.hostel} · Room ${order.customer.room}</div>
    ${order.customer.landmark ? `<div class="muted">${order.customer.landmark}</div>` : ""}
    <hr>
    <table>${rows}</table>
    <hr>
    <div class="row"><span>Subtotal</span><span>${inr(order.subtotal)}</span></div>
    <div class="row"><span>Delivery</span><span>${order.deliveryFee === 0 ? "FREE" : inr(order.deliveryFee)}</span></div>
    ${order.discount ? `<div class="row"><span>Discount</span><span>-${inr(order.discount)}</span></div>` : ""}
    <div class="row total"><span>TOTAL</span><span>${inr(order.total)}</span></div>
    <div class="row"><span>Payment</span><span>${order.payment.method} · ${order.payment.status}</span></div>
    ${order.notes ? `<hr><div class="muted">Note: ${order.notes}</div>` : ""}
    <hr>
    <div class="muted">Prices include taxes. Questions? +91 94100 00000</div>
  </body></html>`;

  const win = window.open("", "_blank", "width=520,height=760");
  if (!win) {
    downloadReceipt(order);
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 350);
}
