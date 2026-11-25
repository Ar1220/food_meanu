// Splice new Tracking + OrderHistory components into src/App.tsx
import fs from "node:fs";

const file = "src/App.tsx";
let src = fs.readFileSync(file, "utf8");
const tracking = fs.readFileSync(".tmp/Tracking.txt", "utf8");
const history = fs.readFileSync(".tmp/OrderHistory.txt", "utf8");

function splice(startMarker, endMarker, replacement) {
  const start = src.indexOf(startMarker);
  const end = src.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`markers not found: ${startMarker} / ${endMarker}`);
  }
  src = src.slice(0, start) + replacement + "\n" + src.slice(end);
  console.log("replaced", startMarker.trim(), "→", endMarker.trim());
}

splice("function Tracking({", "function SimpleNav(", tracking);
splice("function OrderHistory({", "function HistoryCard({", history);

fs.writeFileSync(file, src);
console.log("App.tsx updated:", src.length, "chars");
