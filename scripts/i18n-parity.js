// One-off audit: dump key paths from uk.json and en.json, diff them.
// Usage: node scripts/i18n-parity.js
const fs = require("node:fs");
const uk = JSON.parse(fs.readFileSync("messages/uk.json", "utf8"));
const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));

function walk(obj, path, out) {
  if (obj === null || typeof obj !== "object") {
    out.push(path);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => walk(v, `${path}[${i}]`, out));
    return;
  }
  for (const k of Object.keys(obj)) {
    walk(obj[k], path ? `${path}.${k}` : k, out);
  }
}

const ukList = [];
const enList = [];
walk(uk, "", ukList);
walk(en, "", enList);
const ukPaths = new Set(ukList);
const enPaths = new Set(enList);

const onlyUk = [...ukPaths].filter((p) => !enPaths.has(p));
const onlyEn = [...enPaths].filter((p) => !ukPaths.has(p));

console.log(`uk paths: ${ukPaths.size}  en paths: ${enPaths.size}`);
console.log(`\nMISSING IN en.json (${onlyUk.length}):`);
onlyUk.forEach((p) => console.log("  " + p));
console.log(`\nMISSING IN uk.json (${onlyEn.length}):`);
onlyEn.forEach((p) => console.log("  " + p));

// Also audit for empty / placeholder values.
function get(obj, path) {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((o, k) => (o == null ? o : o[k]), obj);
}
const emptyEn = [];
for (const p of ukPaths) {
  const v = get(en, p);
  if (typeof v === "string" && v.trim() === "") emptyEn.push(p);
  if (typeof v === "string" && /^(TODO|TBD|XXX)\b/i.test(v.trim()))
    emptyEn.push(`${p}  (placeholder: ${v})`);
}
console.log(`\nEMPTY/PLACEHOLDER VALUES in en.json (${emptyEn.length}):`);
emptyEn.forEach((p) => console.log("  " + p));
