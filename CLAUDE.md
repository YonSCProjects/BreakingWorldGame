# The Lattice — Atoms to Molecules

A mobile **PWA game master** for a real-world, physically-played adventure: teams hunt
physical **QR-tagged atom cards**, scan them with the phone camera to gather atoms, and
perform a shared press-and-hold **bonding ritual** to assemble molecules. One phone is
shared per team (their "campfire"). It must feel like an **in-world device the players'
faction (the Lattice) gave them**, not a scanner utility.

## Commands
- `npm install` — install dependencies (Node ≥ 18; see `.nvmrc` → 22 LTS)
- `npm run dev` — Vite dev server (localhost + LAN URL for phones)
- `npm run build` — type-check + production build to `dist/` (emits the PWA service worker)
- `npm run preview` — serve the production build locally
- `npm run qr` — regenerate the printable QR atom-kit into `qr-kit/` (gitignored)

> **Camera needs HTTPS or localhost.** Scanning won't work over plain-`http` on a phone;
> deploy the static `dist/` to any HTTPS host (Netlify/Vercel/Cloudflare Pages).

## Architecture
- **All game content is typed data** in `src/data/` (`elements.ts`, `molecules.ts`,
  `missions.ts`) — add a molecule + mission **without writing code**; it flows into the
  loop and the Codex automatically.
- **Pure scan-verification** lives in `src/store/verify.ts` (`evaluateScan`,
  `isFormulaComplete`) — the "get this right" core: parse → reject duplicate/noble/
  wrong-element/already-full → accept → check exact formula match. Keep it pure & tested.
- **Session + localStorage persistence** in `src/store/session.ts` (Zustand + `persist`).
- **Screens** in `src/screens/` (Boot, Briefing, Hunt, Bond, Reveal, Codex); the active
  screen is driven by `phase` in the store, switched in `src/App.tsx`.
- **Reusable visuals** in `src/components/` (AtomGlyph, MoleculeSchematic, Scanner,
  Typewriter, Background, ParticleField, ScanToast, CodexCard).
- **Scripts** in `scripts/` generate the QR kit and the PWA icons (dependency-free).
- Shared types in `src/types.ts`. Small helpers in `src/utils/`.

## Conventions (hard requirements)
- **Immersive in-world aesthetic & voice is load-bearing, not decoration.** Every screen
  reads as a device from the world; all copy is in-character ("A Hydrogen is flickering
  nearby — lock it down," never "Scan the QR code").
- Prefer custom CSS keyframes / SVG / canvas + **Framer Motion** over generic UI kits.
  No default Material/Bootstrap look.
- Stack: Vite + React + TypeScript, Tailwind, html5-qrcode, Zustand. Strict TS — the
  build fails on unused locals/params.
- Haptics (`navigator.vibrate`) are progressive enhancement only (iOS Safari ignores
  them); never load-bearing.

## QR payload format
Each card encodes a unique id `<ELEMENT>-<NNN>` (e.g. `H-014`, `O-007`, `Na-002`).
Duplicates of an element are still unique ids so the app can reject a card scanned twice.
Edit the `KIT` map in `scripts/generate-qr.mjs` to change kit quantities.

## Scope — deferred to v2 (do NOT build unless explicitly asked)
Backend/accounts; multi-team sync / leaderboards / shared clock; camera image-recognition
of the physical model (v1 verifies by QR + recipe); audio/voice; the atmospheric
world-map (v1 is linear missions); per-mission countdown timer.
