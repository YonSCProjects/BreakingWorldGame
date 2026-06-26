// Dependency-free PWA icon generator. Draws the Lattice sigil — a hex ring with
// a glowing core on the void — straight into an RGBA buffer and encodes a PNG
// with Node's built-in zlib. No native deps, runs anywhere Node runs.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public')
mkdirSync(OUT, { recursive: true })

// ── tiny PNG encoder ────────────────────────────────────────────────────
function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  // raw scanlines, each prefixed with filter byte 0
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── draw the sigil ──────────────────────────────────────────────────────
function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)))
}
function draw(size) {
  const buf = Buffer.alloc(size * size * 4)
  const cx = size / 2
  const cy = size * 0.46
  const R = size * 0.34 // hex radius
  // hexagon vertices (flat-ish top)
  const verts = []
  for (let i = 0; i < 6; i++) {
    const a = (-90 + i * 60) * (Math.PI / 180)
    verts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R])
  }
  const distToSeg = (px, py, a, b) => {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const l2 = dx * dx + dy * dy
    let t = ((px - a[0]) * dx + (py - a[1]) * dy) / l2
    t = Math.max(0, Math.min(1, t))
    const x = a[0] + t * dx
    const y = a[1] + t * dy
    return Math.hypot(px - x, py - y)
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      // base: void
      let r = 5
      let g = 6
      let b = 10

      // central core glow
      const dCore = Math.hypot(x - cx, y - cy)
      const coreGlow = Math.exp(-(dCore * dCore) / (2 * (size * 0.1) ** 2))
      r += 94 * coreGlow + 130 * Math.max(0, 1 - dCore / (size * 0.05))
      g += 200 * coreGlow + 110 * Math.max(0, 1 - dCore / (size * 0.05))
      b += 220 * coreGlow + 120 * Math.max(0, 1 - dCore / (size * 0.05))

      // hex ring
      let ring = Infinity
      for (let k = 0; k < 6; k++) ring = Math.min(ring, distToSeg(x, y, verts[k], verts[(k + 1) % 6]))
      const ringGlow = Math.exp(-(ring * ring) / (2 * (size * 0.012) ** 2))
      r += 94 * ringGlow * 0.7
      g += 200 * ringGlow * 0.7
      b += 220 * ringGlow * 0.7

      buf[i] = clamp(r)
      buf[i + 1] = clamp(g)
      buf[i + 2] = clamp(b)
      buf[i + 3] = 255
    }
  }
  return buf
}

for (const size of [192, 512]) {
  const png = encodePNG(size, size, draw(size))
  writeFileSync(join(OUT, `icon-${size}.png`), png)
  console.log(`wrote public/icon-${size}.png (${png.length} bytes)`)
}
// apple touch icon (180px is the common size)
const png180 = encodePNG(180, 180, draw(180))
writeFileSync(join(OUT, 'apple-touch-icon.png'), png180)
console.log('wrote public/apple-touch-icon.png')
