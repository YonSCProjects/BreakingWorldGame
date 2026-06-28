// Generate the printable Order badges. Each carries a deep-link QR that drops a
// phone straight into its Order + station — no menus, no typing.
//
//   npm run badges   → qr-kit/badges/*.png + qr-kit/badges/badges.html
//
// The QR encodes the RAW url (https://…?team=EAGLE&role=field) so a camera opens
// it as a link. (Do NOT pre-encode the url — that yields https%3A%2F%2F… which
// scans as plain text, not a link.)
import QRCode from 'qrcode'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const APP = 'https://yonscprojects.github.io/BreakingWorldGame/'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'qr-kit', 'badges')
mkdirSync(OUT, { recursive: true })

// Hebrew Order names + print-safe accent colours (the app colours are tuned for a
// dark background, so they're darkened here for text/borders on white paper).
const ORDERS = [
  { name: 'EAGLE',   emoji: '🦅', heb: 'מסדר הנשרים',    gift: 'שומר האוויר', accent: '#b8860b' },
  { name: 'DOLPHIN', emoji: '🐬', heb: 'מסדר הדולפינים', gift: 'שומר המים',   accent: '#0e7d8c' },
  { name: 'LION',    emoji: '🦁', heb: 'מסדר האריות',    gift: 'שומר השמש',   accent: '#cf6f1a' },
]
const ROLES = [
  { role: 'field',   heb: 'אביר' },   // every kid
  { role: 'control', heb: 'הרואה' },  // one per team, for the control laptop
]

const cards = []
for (const r of ROLES) {
  for (const o of ORDERS) {
    const url = `${APP}?team=${o.name}&role=${r.role}` // RAW — never encode
    await QRCode.toFile(join(OUT, `badge-${o.name.toLowerCase()}-${r.role}.png`), url, {
      margin: 1,
      width: 600,
      color: { dark: '#05060a', light: '#ffffff' },
    })
    const svg = await QRCode.toString(url, { type: 'svg', margin: 1 })
    cards.push({ o, r, svg })
  }
}

const cardHtml = cards
  .map(
    ({ o, r, svg }) => `
    <div class="badge" style="--accent:${o.accent}">
      <div class="role">${r.heb}</div>
      <div class="crest">${o.emoji}</div>
      <div class="order">${o.heb}</div>
      <div class="gift">${o.gift}</div>
      <div class="qr">${svg}</div>
      <div class="name"><span class="lbl">שם:</span><span class="line"></span></div>
    </div>`,
  )
  .join('')

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><title>תגי המסדר</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  @page { margin: 8mm; }
  * { box-sizing: border-box; }
  body { font-family:'Heebo', system-ui, 'Segoe UI', sans-serif; direction:rtl; background:#fff; color:#0a0c14; margin:0; padding:6mm; }
  h1 { font-size:15px; letter-spacing:.06em; text-align:center; margin:0 0 2mm; }
  p.note { font-size:11px; line-height:1.5; color:#555; text-align:center; max-width:75ch; margin:0 auto 6mm; }
  .grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:6mm; }
  .badge { border:2.5px solid var(--accent); border-radius:16px; padding:5mm 4mm 4mm; text-align:center; display:flex; flex-direction:column; align-items:center; gap:1.5mm; break-inside:avoid; background:#fff; }
  .role { font-size:11px; font-weight:700; letter-spacing:.12em; color:var(--accent); }
  .crest { font-size:56px; line-height:1; }
  .order { font-size:19px; font-weight:800; color:var(--accent); }
  .gift { font-size:11px; color:#777; margin-bottom:1mm; }
  .qr svg { width:34mm; height:34mm; display:block; background:#fff; padding:4px; }
  .name { display:flex; align-items:flex-end; gap:5px; width:100%; font-size:13px; margin-top:2.5mm; }
  .name .lbl { font-weight:700; }
  .name .line { flex:1; height:14px; border-bottom:1.6px solid #888; }
  @media print { body { padding:0; } }
</style></head>
<body>
  <h1>◈ תגי המסדר — שלושת המסדרים ◈</h1>
  <p class="note">
    הדפיסו כמה עותקים. <b>שורת האבירים</b> — תג לכל ילד (תג המסדר שלו). <b>שורת הרואים</b> —
    תג אחד לקבוצה, למחשב הבקרה. כתבו את שם הילד על השורה. סריקת התג פותחת את המשחק
    ישירות במסדר ובתפקיד הנכונים.
  </p>
  <div class="grid">${cardHtml}</div>
</body></html>`

writeFileSync(join(OUT, 'badges.html'), html)
console.log(`Generated ${cards.length} badge QRs → qr-kit/badges/  (open badges.html to print)`)
