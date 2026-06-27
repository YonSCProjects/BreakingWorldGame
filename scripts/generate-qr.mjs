// Batch-generate the physical atom kit: one QR per unique card id, plus a
// print-ready HTML sheet of in-world cards — each shows the atom (drawn like the
// app), its HEBREW name, the QR, and a tiny id — that you print and cut out.
//
//   npm run qr            → writes qr-kit/<ID>.png + qr-kit/print-sheet.html
//
// Edit KIT below to change how many of each atom the kit contains.
import QRCode from 'qrcode'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'qr-kit')
mkdirSync(OUT, { recursive: true })

// element symbol → { he, count, color, valence }. Keep in sync with
// src/data/elements.ts — EXCEPT `color`, which is print-tuned here: several app
// colours are set for a dark background and wash out on white paper (Hydrogen
// #eafcff is almost white!), so we use readable siblings + a dark outline.
//
// Sized for the 8 builds INCLUDING the GLUCOSE bonus (C₆H₁₂O₆, 24 atoms). One
// team's full run consumes H23/O11/C8/N3/Na1/Cl1 distinct cards (a card can't be
// re-scanned within a team). All 3 teams scan the SAME shared cards (each has its
// own server room), so this ONE set with margin covers everyone — AS LONG AS the
// cards stay hidden in place and aren't pocketed. (If kids remove them, you'd
// need ~3× per element.) A few Noble "trap" cards (He/Ne/Ar) are fun dead-ends.
const KIT = {
  H:  { he: 'מימן',  count: 28, color: '#6fc0f5', valence: 1 }, // app #eafcff → readable blue
  O:  { he: 'חמצן',  count: 14, color: '#ff5e6c', valence: 2 },
  C:  { he: 'פחמן',  count: 10, color: '#8b95a6', valence: 4 },
  N:  { he: 'חנקן',  count: 4,  color: '#5e8bff', valence: 3 },
  Na: { he: 'נתרן',  count: 3,  color: '#c08bff', valence: 1 },
  Cl: { he: 'כלור',  count: 3,  color: '#3fcf85', valence: 1 }, // app #7dffae → deeper green
  He: { he: 'הליום', count: 2,  color: '#e0a92e', valence: 0 }, // golds darkened for white
  Ne: { he: 'ניאון', count: 2,  color: '#d99a1f', valence: 0 },
  Ar: { he: 'ארגון', count: 2,  color: '#c5871a', valence: 0 },
}

// Multiply an #rrggbb hex toward black by factor f (0..1) — for outlines/edges.
function darken(hex, f) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * f)
  const g = Math.round(((n >> 8) & 255) * f)
  const b = Math.round((n & 255) * f)
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

// A static, print-tuned reproduction of src/components/AtomGlyph.tsx: a
// radial-gradient sphere, `valence` radiating "hands", a dark outline so even
// pale atoms read on white, and the centred symbol. (No animation / heavy blur.)
function atomSvg(sym, color, valence) {
  const size = 54
  const box = Math.round(size * 2.4)
  const c = box / 2
  const r = size / 2
  const edge = darken(color, 0.62)
  const stroke = darken(color, 0.5)

  let hands = ''
  for (let i = 0; i < valence; i++) {
    const a = (-90 + (360 / valence) * i) * (Math.PI / 180)
    const x1 = (c + Math.cos(a) * r * 0.9).toFixed(1)
    const y1 = (c + Math.sin(a) * r * 0.9).toFixed(1)
    const x2 = (c + Math.cos(a) * r * 1.55).toFixed(1)
    const y2 = (c + Math.sin(a) * r * 1.55).toFixed(1)
    hands +=
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ` +
      `stroke-width="${(size * 0.06).toFixed(1)}" stroke-linecap="round"/>` +
      `<circle cx="${x2}" cy="${y2}" r="${(size * 0.07).toFixed(1)}" fill="${edge}"/>`
  }

  const fontSize = (size * (sym.length > 1 ? 0.42 : 0.52)).toFixed(1)
  return `<svg viewBox="0 0 ${box} ${box}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g-${sym}" cx="38%" cy="34%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="38%" stop-color="${color}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${edge}" stop-opacity="1"/>
    </radialGradient>
  </defs>
  ${hands}
  <circle cx="${c}" cy="${c}" r="${r}" fill="url(#g-${sym})" stroke="${stroke}" stroke-width="${Math.max(1, size * 0.03).toFixed(1)}"/>
  <text x="${c}" y="${c}" text-anchor="middle" dominant-baseline="central" font-family="'Space Mono', monospace" font-weight="700" font-size="${fontSize}" fill="#0a0c12">${sym}</text>
</svg>`
}

const glyphBySym = {}
for (const [sym, m] of Object.entries(KIT)) glyphBySym[sym] = atomSvg(sym, m.color, m.valence)

const ids = []
for (const [sym, { count }] of Object.entries(KIT)) {
  for (let i = 1; i <= count; i++) ids.push(`${sym}-${String(i).padStart(3, '0')}`)
}

const cards = []
for (const id of ids) {
  const sym = id.split('-')[0]
  const meta = KIT[sym]
  // PNG file (kept for staff: build a custom layout / upload a bare QR elsewhere)
  await QRCode.toFile(join(OUT, `${id}.png`), id, {
    margin: 1,
    width: 480,
    color: { dark: '#05060a', light: '#ffffff' },
  })
  // inline SVG QR for the self-contained print sheet
  const svg = await QRCode.toString(id, { type: 'svg', margin: 1 })
  cards.push({ id, sym, he: meta.he, svg })
}

const cardHtml = cards
  .map(
    (c) => `
    <div class="card">
      <span class="id">${c.id}</span>
      <div class="atom">${glyphBySym[c.sym]}</div>
      <div class="name" dir="rtl">${c.he}</div>
      <div class="qr">${c.svg}</div>
    </div>`,
  )
  .join('')

const html = `<!doctype html>
<html lang="he"><head><meta charset="utf-8"><title>The Lattice — Atom Kit</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  @page { margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Space Mono', ui-monospace, monospace; background:#fff; color:#05060a; margin:0; padding:6mm; }
  h1 { font-size:13px; letter-spacing:.18em; text-transform:uppercase; }
  p.hint { font-size:11px; color:#555; max-width:60ch; }
  .grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:6mm; margin-top:5mm; }
  .card { position:relative; border:1.5px dashed #bbb; border-radius:8px; padding:5mm 4mm; display:flex; flex-direction:column; align-items:center; gap:2.5mm; break-inside:avoid; }
  .id { position:absolute; top:2mm; left:3mm; font-size:8px; color:#aab; letter-spacing:.05em; }
  .atom svg { width:38mm; height:38mm; display:block; }
  .name { font-family:'Heebo', system-ui, 'Segoe UI', sans-serif; font-weight:700; font-size:20px; direction:rtl; line-height:1; }
  .qr svg { width:30mm; height:30mm; display:block; }
  @media print { .no-print { display:none; } body { padding:0; } }
</style></head>
<body>
  <h1>The Lattice — Physical Atom Kit · ערכת יחידות החומר</h1>
  <p class="hint no-print">${cards.length} cards. Print, cut along the dashed lines, and tag each physical atom piece. Each QR encodes a unique id (e.g. <b>H-014</b>); the app rejects any id scanned twice. The tiny id (top-left) is for staff — players read the colour + Hebrew name.</p>
  <div class="grid">${cardHtml}</div>
</body></html>`

writeFileSync(join(OUT, 'print-sheet.html'), html)
console.log(`Generated ${cards.length} QR cards → qr-kit/  (open print-sheet.html to print)`)
