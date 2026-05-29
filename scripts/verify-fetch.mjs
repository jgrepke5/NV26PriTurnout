/** Quick smoke test — run with: node scripts/verify-fetch.mjs */
const ID = "1vxtJSRNtDA6d8IG1UB-XDUuwKJOrk8xtDXazYEoLwG4";

const html = await fetch(
  `https://docs.google.com/spreadsheets/d/${ID}/htmlview`,
).then((r) => r.text());

const pattern =
  /items\.push\(\{name:\s*"([^"]+)",\s*pageUrl:[^,]+,\s*gid:\s*"([^"]+)"/g;
const tabs = [];
let m;
while ((m = pattern.exec(html)) !== null) {
  tabs.push({ name: m[1], gid: m[2] });
}

const publicTabs = tabs.filter((t) => t.name.toLowerCase() !== "data");
console.log("Tabs (excluding Data):", publicTabs.map((t) => t.name).join(", "));

for (const { name, gid } of publicTabs) {
  const raw = await fetch(
    `https://docs.google.com/spreadsheets/d/${ID}/gviz/tq?tqx=out:json&gid=${gid}`,
  ).then((r) => r.text());
  const match = raw.match(/\{[\s\S]*\}/);
  const data = JSON.parse(match[0]);
  console.log(`  ${name}: ${data.table.rows.length} data rows`);
}
