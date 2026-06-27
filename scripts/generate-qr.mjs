// Batch-generate the physical atom kit: one QR per unique card id, plus a
// print-ready HTML sheet of labelled cards you can print and cut out.
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

// element symbol → { name, count, color }. Matches src/data/elements.ts.
//
// Sized for the 9-mission arc. One team needs H13/O8/C2/N1/Na1/Cl1; because each
// team has its own room on the server, ALL teams can scan the SAME physical
// cards, so this is ONE shared set with margin (no need to print per-team).
// A few Noble "trap" cards (He/Ne/Ar) are sprinkled in as fun dead-ends.
const KIT = {
  H: { name: 'Hydrogen', count: 18, color: '#9fdfff' },
  O: { name: 'Oxygen', count: 12, color: '#ff5e6c' },
  C: { name: 'Carbon', count: 4, color: '#9aa4b2' },
  N: { name: 'Nitrogen', count: 3, color: '#5e8bff' },
  Na: { name: 'Sodium', count: 3, color: '#c08bff' },
  Cl: { name: 'Chlorine', count: 3, color: '#7dffae' },
  He: { name: 'Helium', count: 2, color: '#ffd66e' },
  Ne: { name: 'Neon', count: 2, color: '#ffce54' },
  Ar: { name: 'Argon', count: 2, color: '#f0b840' },
}

const ids = []
for (const [sym, { count }] of Object.entries(KIT)) {
  for (let i = 1; i <= count; i++) ids.push(`${sym}-${String(i).padStart(3, '0')}`)
}

const cards = []
for (const id of ids) {
  const sym = id.split('-')[0]
  const meta = KIT[sym]
  // PNG file (for printing individually or building a custom layout)
  await QRCode.toFile(join(OUT, `${id}.png`), id, {
    margin: 1,
    width: 480,
    color: { dark: '#05060a', light: '#ffffff' },
  })
  // inline SVG for the self-contained print sheet
  const svg = await QRCode.toString(id, { type: 'svg', margin: 1 })
  cards.push({ id, sym, name: meta.name, color: meta.color, svg })
}

const cardHtml = cards
  .map(
    (c) => `
    <div class="card">
      <div class="qr">${c.svg}</div>
      <div class="meta">
        <span class="sym" style="color:${c.color}">${c.sym}</span>
        <span class="name">${c.name}</span>
        <span class="id">${c.id}</span>
      </div>
    </div>`,
  )
  .join('')

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Atom Kit — Print Sheet</title>
<style>
  @page { margin: 12mm; }
  body { font-family: 'Space Mono', ui-monospace, monospace; background:#fff; color:#05060a; }
  h1 { font-size:14px; letter-spacing:.2em; text-transform:uppercase; }
  p.hint { font-size:11px; color:#555; }
  .grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:8mm; }
  .card { border:1.5px dashed #bbb; border-radius:6px; padding:6mm; display:flex; flex-direction:column; align-items:center; gap:3mm; break-inside:avoid; }
  .qr svg { width:34mm; height:34mm; display:block; }
  .meta { text-align:center; }
  .sym { font-size:20px; font-weight:700; display:block; }
  .name { font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:#333; display:block; }
  .id { font-size:9px; color:#999; display:block; margin-top:2px; }
  @media print { .no-print { display:none; } }
</style></head>
<body>
  <h1>The Lattice — Physical Atom Kit</h1>
  <p class="hint no-print">${cards.length} cards. Print, cut along the dashed lines, and tag each physical atom piece. Each QR encodes a unique id (e.g. <b>H-014</b>); the app rejects any id scanned twice.</p>
  <div class="grid">${cardHtml}</div>
</body></html>`

writeFileSync(join(OUT, 'print-sheet.html'), html)
console.log(`Generated ${cards.length} QR cards → qr-kit/  (open print-sheet.html to print)`)
