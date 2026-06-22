#!/usr/bin/env node
/**
 * scripts/places-fetch.js
 * ใช้:  node scripts/places-fetch.js "ชื่อร้าน ย่าน" [slug]
 * ดึง Google Places (New) → เขียน leads/<slug>/brief.md + โหลดรูปลง images/
 * ต้องมี GOOGLE_PLACES_KEY ใน .env (root ของ repo) — ไม่ต้องลง dependency ใด ๆ
 * ต้องใช้ Node 18+ (มี fetch ในตัว)
 */
const { writeFileSync, mkdirSync, existsSync, readFileSync } = require("fs");
const { join } = require("path");

const ROOT = join(__dirname, ".."); // repo root

// --- โหลด .env แบบไม่ต้องลง dependency ---
(function loadEnv() {
  const p = join(ROOT, ".env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
})();

const KEY = process.env.GOOGLE_PLACES_KEY;
const query = process.argv[2];
let slug = process.argv[3];

if (!KEY) { console.error("❌ ไม่พบ GOOGLE_PLACES_KEY ใน .env (วางที่ root ของ repo)"); process.exit(1); }
if (!query) { console.error('❌ ใช้:  node scripts/places-fetch.js "ชื่อร้าน ย่าน" [slug]'); process.exit(1); }

const FIELD_MASK = [
  "places.id", "places.displayName", "places.formattedAddress", "places.rating",
  "places.userRatingCount", "places.websiteUri", "places.nationalPhoneNumber",
  "places.primaryTypeDisplayName", "places.regularOpeningHours", "places.reviews", "places.photos",
].join(",");

function slugify(s) {
  return s.toLowerCase().trim()
    .replace(/[\/\\'"]+/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    .slice(0, 40) || "lead";
}
const bullet = (a) => (a && a.length ? a.map((x) => `- ${x}`).join("\n") : "- (ไม่มีข้อมูลจาก Google)");

async function main() {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": FIELD_MASK },
    body: JSON.stringify({ textQuery: query, languageCode: "th", regionCode: "TH", maxResultCount: 1 }),
  });
  const data = await res.json();
  if (!res.ok) { console.error("❌ Places error:", data.error?.message || res.status); process.exit(1); }

  const p = (data.places || [])[0];
  if (!p) { console.error("❌ ไม่พบร้านจาก:", query); process.exit(1); }

  const name = p.displayName?.text || query;
  slug = slug || slugify(name);
  const dir = join(ROOT, "leads", slug);
  const imgDir = join(dir, "images");
  mkdirSync(imgDir, { recursive: true });

  const reviews = (p.reviews || []).map((r) => r.text?.text).filter(Boolean).slice(0, 5);
  const hours = p.regularOpeningHours?.weekdayDescriptions || [];

  // โหลดรูป (สูงสุด 4) — ทำได้เพราะรันบนเครื่องเราเอง (key อยู่ใน .env ไม่ถูก publish)
  const photos = (p.photos || []).slice(0, 4);
  const saved = [];
  for (let i = 0; i < photos.length; i++) {
    try {
      const url = `https://places.googleapis.com/v1/${photos[i].name}/media?maxWidthPx=1280&key=${KEY}`;
      const r = await fetch(url);
      if (r.ok) {
        writeFileSync(join(imgDir, `photo-${i + 1}.jpg`), Buffer.from(await r.arrayBuffer()));
        saved.push(`images/photo-${i + 1}.jpg`);
      }
    } catch (_) { /* ข้ามรูปที่โหลดไม่ได้ */ }
  }

  const md = `# Brief: ${name}

> ดึงจาก Google Places (query: "${query}") — ส่วนที่ Google ไม่มี ให้เติมในหัวข้อ "⬜ ต้องเติมมือ"

## ข้อมูลจาก Google (อัตโนมัติ)
- ชื่อร้าน: ${name}
- ประเภท: ${p.primaryTypeDisplayName?.text || "-"}
- คะแนน: ${p.rating || "-"} (${p.userRatingCount || 0} รีวิว)
- เบอร์: ${p.nationalPhoneNumber || "-"}
- ที่อยู่: ${p.formattedAddress || "-"}
- เว็บเดิม: ${p.websiteUri || "ไม่มี"}

### เวลาเปิด-ปิด
${bullet(hours)}

### รูป (โหลดไว้แล้วใน images/)
${saved.length ? saved.map((s) => `- ${s}`).join("\n") : "- (Google ไม่มีรูป — ใส่รูปเองใน images/)"}

### รีวิวจริง (ใช้สรุปจุดขาย — ห้ามก๊อปทั้งดุ้นลงเว็บ)
${bullet(reviews)}

## ⬜ ต้องเติมมือ (Google ไม่มี)
- ลิงก์ Facebook Messenger (m.me/...): 
- LINE ID / ลิงก์: 
- สี / มู้ดที่ต้องการ: 
- เมนู / บริการเด่นที่อยากโชว์: 
- เรื่องราวร้าน / จุดขายที่อยากเน้น: 
- รูปคุณภาพดีเพิ่ม (ใส่ใน images/): 
`;

  writeFileSync(join(dir, "brief.md"), md, "utf8");

  console.log(`✅ ดึงข้อมูลแล้ว → leads/${slug}/brief.md`);
  console.log(`   ${name} · ★${p.rating || "-"} (${p.userRatingCount || 0}) · เว็บเดิม: ${p.websiteUri ? "มี" : "ไม่มี"}`);
  console.log(`   รูปที่โหลด: ${saved.length} รูป`);
  console.log(`   ⬜ อย่าลืมเติมมือ: FB Messenger, LINE, สี/มู้ด, เมนู/บริการ ใน brief.md`);
  if (p.websiteUri) console.log(`   ⚠️ ร้านนี้มีเว็บอยู่แล้ว — อาจไม่ใช่ลีดที่ดี`);
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
