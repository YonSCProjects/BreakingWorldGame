// Generate the badge join-QRs. Each QR is a deep link that drops a phone
// straight into its Order + station — no menus. One per Order × role.
//
//   npm run badges   → qr-kit/badges/*.png + qr-kit/badges/badges.html
//
// Put the matching QR on each badge (Knights get the Knight QR for their Order;
// the one Seer per team gets the Seer QR). Re-used across all kids in that role.
import QRCode from 'qrcode'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const APP = 'https://yonscprojects.github.io/BreakingWorldGame/'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'qr-kit', 'badges')
mkdirSync(OUT, { recursive: true })

const ORDERS = [
  { name: 'EAGLE', emoji: '🦅', guards: 'the Air', color: '#ffce54' },
  { name: 'DOLPHIN', emoji: '🐬', guards: 'the Water', color: '#5ef2ff' },
  { name: 'LION', emoji: '🦁', guards: 'the Sun', color: '#ffa23d' },
]
const ROLES = [
  { role: 'field', label: 'KNIGHT' },
  { role: 'control', label: 'SEER' },
]

const cards = []
for (const o of ORDERS) {
  for (const r of ROLES) {
    const url = `${APP}?team=${o.name}&role=${r.role}`
    const file = `badge-${o.name.toLowerCase()}-${r.role}.png`
    await QRCode.toFile(join(OUT, file), url, { margin: 1, width: 600, color: { dark: '#05060a', light: '#ffffff' } })
    const svg = await QRCode.toString(url, { type: 'svg', margin: 1 })
    cards.push({ ...o, ...r, svg, url })
  }
}

const cardHtml = cards
  .map(
    (c) => `
    <div class="card" style="border-color:${c.color}">
      <div class="crest">${c.emoji}</div>
      <div class="order" style="color:${c.color}">ORDER OF THE ${c.name}</div>
      <div class="role">${c.label}</div>
      <div class="qr">${c.svg}</div>
      <div class="hint">guardian of ${c.guards}</div>
    </div>`,
  )
  .join('')

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Order Badges</title>
<style>
  body { font-family:'Space Mono',ui-monospace,monospace; background:#05060a; color:#eaf6ff; padding:18px; }
  h1 { font-size:14px; letter-spacing:.25em; }
  p.hint { font-size:11px; color:#9fb3c8; max-width:60ch; }
  .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .card { border:2px solid; border-radius:12px; padding:14px; text-align:center; background:#0a0c14; break-inside:avoid; }
  .crest { font-size:54px; line-height:1; }
  .order { font-size:11px; letter-spacing:.18em; margin-top:6px; }
  .role { font-size:18px; font-weight:700; letter-spacing:.2em; margin:2px 0 8px; }
  .qr svg { width:42mm; height:42mm; background:#fff; padding:6px; border-radius:6px; }
  .hint { font-size:10px; color:#7e93a8; margin-top:6px; }
  @media print { body { background:#fff; color:#000 } .card{ background:#fff } }
</style></head><body>
  <h1>◈ THE THREE ORDERS — JOIN BADGES</h1>
  <p class="hint">Put the matching QR on each knight's badge. Most kids are KNIGHTS (their Order's Knight QR). Pick ONE SEER per team (the Seer QR). Scanning the badge opens the game already in that Order + station.</p>
  <div class="grid">${cardHtml}</div>
</body></html>`

writeFileSync(join(OUT, 'badges.html'), html)
console.log(`Generated ${cards.length} badge QRs → qr-kit/badges/  (open badges.html)`)
