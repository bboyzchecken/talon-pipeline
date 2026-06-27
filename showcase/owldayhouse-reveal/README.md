# Owl Day House — Reveal Hero (showcase)

Showcase hero สำหรับ owldayhouse.com — เดโมความสามารถงาน interactive front-end
สร้างจาก prompt `lithos-prompt-lcp.md` (เทคนิค cursor-following spotlight reveal) แต่
**รีแบรนด์เป็น Owl Day House** ทั้งหมด โดยใช้ brand tokens จาก repo หลัก `talon-by-owldayhouse`
(`packages/brand` + `packages/ui`): **Owl Navy `#28254c`** · **Owl Gold `#e9a41b`** ·
navyDeep `#1b1938` · paper `#fbf8f1` · ฟอนต์ **Space Grotesk** (display/ตัวเลข) +
**IBM Plex Sans Thai** (ไทย) · โลโก้ = OwlMark จริงจาก `@odh/ui`.

## ไอเดีย
เลื่อนเคอร์เซอร์ = spotlight ส่องทะลุ **"พื้นผิวเว็บที่เสร็จสวย"** (`surface.svg`)
ลงไปเห็น **"โครงสร้างระบบเบื้องหลัง"** (`blueprint.svg`) — สื่อสาร pitch จริงของ ODH:
*"จากเว็บแรก ฿3,900 สู่ระบบระดับองค์กร"*

repo นี้ไม่มีไฟล์รูปจริง (design-system ตั้งใจไม่ขนรูป/โลโก้เก่ามา) → ภาพ 2 เลเยอร์
จึงเป็น **SVG ที่ออกแบบเองให้ตรงแบรนด์** ไม่พึ่งรูปภายนอก = self-contained + LCP ดี

## เทคนิค LCP (ตาม prompt)
- preload font เป็น `<link>` (ไม่ใช้ CSS `@import`) + preconnect
- preload `surface.svg` (LCP image) `fetchpriority="high"`
- reveal ใช้ CSS `radial-gradient` mask + CSS custom property (`--mx/--my`) ผ่าน rAF
  — ไม่ผ่าน React state, ไม่มี canvas/`toDataURL` → main thread ว่าง
- `@font-face` fallback + `size-adjust` ลด CLS

## รัน
```bash
npm install
npm run dev      # dev server
npm run build    # -> dist/ (static, hostable ทุก sub-path เพราะ base './')
```

## เชื่อมเข้าเว็บหลัก (talon-by-owldayhouse)
ตัว **source อยู่ที่นี่** (talon-pipeline) แต่ **build แล้ว copy** ไปฝังในเว็บหลัก
เพื่อให้เสิร์ฟพร้อม static export ที่ `owldayhouse.com/showcase/reveal/`:

```bash
npm run build
cp -r dist/* ../../../talon-by-owldayhouse/apps/web/public/showcase/reveal/
```

ในเว็บหลักเชื่อมไว้ 2 จุดแล้ว:
- **เมนู** — `apps/web/content/site.ts` → `navLinks` (label "โชว์เคส", `external: true` → render เป็น `<a>` ไม่ใช่ next/link) · Nav + Footer รองรับ flag นี้
- **ผลงาน** — `apps/web/content/portfolio.ts` → การ์ด "Interactive Showcase" (thumbnail = `surface.svg`, ปุ่ม "เปิดดูโชว์เคส" → `/showcase/reveal/`)

> แก้ showcase ครั้งใด ต้อง `npm run build` + copy ใหม่ แล้ว `pnpm --filter web build` ในเว็บหลัก
> (`public/showcase/**` ถูก ignore ใน eslint ของเว็บหลัก เพราะเป็น bundle สำเร็จรูป)
