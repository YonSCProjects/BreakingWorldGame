// ── Magister VO batch generator ─────────────────────────────────────────
// Turns scripts/vo-lines.csv into raw Magister voice files in public/vo/.
// Dependency-free: uses Node's built-in fetch (Node >= 18) against the
// ElevenLabs REST API — no SDK to drift out of date.
//
// USAGE (PowerShell):
//   $env:ELEVENLABS_API_KEY = '<your api key>'
//   $env:MAGISTER_VOICE_ID  = '<the saved Magister-HE-v1 voice id>'
//   node scripts/generate-vo.mjs
//
// USAGE (bash):
//   ELEVENLABS_API_KEY=<key> MAGISTER_VOICE_ID=<id> node scripts/generate-vo.mjs
//
// It writes "<cue-id>.raw.mp3" for every CSV row that HAS Hebrew text. Fill the
// `text` column in vo-lines.csv incrementally — empty rows are skipped, so you
// can generate a few lines at a time. Rows whose .raw.mp3 already exists are
// skipped too, so re-running never re-spends credits (delete a file to redo it).
//
// AFTER this, run the ffmpeg loop (see public/vo/README.md) to turn each
// "<id>.raw.mp3" master into the app-ready "<id>.mp3" (mono, ~96 kbps, -16 LUFS).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.MAGISTER_VOICE_ID
const MODEL = process.env.MODEL ?? 'eleven_v3' // Hebrew needs v3; override if the id changes
const OUTPUT_FORMAT = process.env.OUTPUT_FORMAT ?? 'mp3_44100_128'

// Lock the same delivery across the whole library. NOTE: v3's "Natural/Robust/
// Creative" map onto numeric stability roughly as 0.5 / 1.0 / 0.0. If the API
// rejects voice_settings on v3, set SEND_SETTINGS=0 to fall back to the saved
// voice's own defaults.
const VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75, style: 0 }
const SEND_SETTINGS = process.env.SEND_SETTINGS !== '0'

const CSV = new URL('./vo-lines.csv', import.meta.url)
const OUT_DIR = new URL('../public/vo/', import.meta.url)

if (!API_KEY || !VOICE_ID) {
  console.error('Missing env. Set ELEVENLABS_API_KEY and MAGISTER_VOICE_ID first.')
  process.exit(1)
}

mkdirSync(OUT_DIR, { recursive: true })

// Parse: split on the FIRST comma only, so Hebrew text may contain commas.
const rows = readFileSync(CSV, 'utf8')
  .split(/\r?\n/)
  .slice(1) // drop header
  .map((line) => {
    const i = line.indexOf(',')
    if (i === -1) return null
    return { id: line.slice(0, i).trim(), text: line.slice(i + 1).trim() }
  })
  .filter((r) => r && r.id && r.text)

if (rows.length === 0) {
  console.log('Nothing to do — fill the `text` column in scripts/vo-lines.csv first.')
  process.exit(0)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let written = 0
let skipped = 0
const failed = []

for (const { id, text } of rows) {
  const out = new URL(`${id}.raw.mp3`, OUT_DIR)
  if (existsSync(out)) {
    skipped++
    console.log(`· skip   ${id} (already exists)`)
    continue
  }

  const body = { text, model_id: MODEL }
  if (SEND_SETTINGS) body.voice_settings = VOICE_SETTINGS

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`,
      {
        method: 'POST',
        headers: { 'xi-api-key': API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    if (!res.ok) {
      const detail = await res.text()
      failed.push(id)
      console.error(`✗ fail   ${id} — HTTP ${res.status}: ${detail.slice(0, 200)}`)
      continue
    }
    writeFileSync(out, Buffer.from(await res.arrayBuffer()))
    written++
    console.log(`✓ wrote  ${id}.raw.mp3`)
  } catch (err) {
    failed.push(id)
    console.error(`✗ error  ${id} — ${err.message}`)
  }

  await sleep(400) // be polite to the API
}

console.log(`\nDone. ${written} written, ${skipped} skipped, ${failed.length} failed.`)
if (written > 0) {
  console.log('Next: run the ffmpeg loop in public/vo/README.md to make the final *.mp3 files.')
}
if (failed.length > 0) process.exit(1)
