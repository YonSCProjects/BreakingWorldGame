# The Lattice — *Atoms to Molecules* (v1)

A mobile **PWA game master** for a real-world, physically-played adventure. Teams move through real locations, hunt for physical **atom cards** tagged with QR codes, scan them to gather atoms, and perform a shared **bonding ritual** on the phone to assemble molecules. The app issues missions, tells the story, verifies builds, and celebrates them.

This is not a scanner utility. It is meant to feel like a **device the players' faction (the Lattice) handed them** — a window into a world dissolving at the molecular level. One phone is shared per team (their "campfire").

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173  (and exposed on your LAN for phones)
```

Open it on a phone on the same network using the **Network** URL Vite prints.

> **📷 Camera needs HTTPS (or localhost).** Browsers only grant camera access on a *secure context*. `localhost` works for desktop testing, but to scan QR codes **on a phone** you need either:
> - the **Network** dev URL opened in a way the browser trusts (some phones block camera on plain-`http` LAN IPs), or
> - a real **HTTPS deploy** (recommended — see below).

### Build & preview

```bash
npm run build      # type-checks, bundles, and emits the PWA service worker
npm run preview    # serve the production build locally
```

### Deploy (any static host with HTTPS)

The build in `dist/` is fully static — drop it on **Netlify, Vercel, GitHub Pages**, Cloudflare Pages, etc. All of these serve HTTPS by default, which satisfies the camera-access requirement. The Vite `base` is relative (`./`), so it works from a subpath too.

---

## Print the physical atom kit

```bash
npm run qr
```

Generates `qr-kit/`:
- one **PNG per card** (`H-001.png … H-014.png`, `O-001.png …`, etc.), and
- **`print-sheet.html`** — open it in a browser and print. Cut along the dashed lines and tag each physical atom piece.

Each QR encodes a **unique id** like `H-014`. Duplicates of the same element are still unique (`H-014`, `H-015`, …) so the app can reject a card scanned twice. Edit the `KIT` map at the top of [`scripts/generate-qr.mjs`](scripts/generate-qr.mjs) to change quantities.

---

## How a mission plays (the core loop)

1. **Boot** — the device powers on, a signal locks in, the Lattice transmits the stakes. Name your cell.
2. **Briefing** — a typed transmission sets the scene; the target molecule appears as a glowing schematic with empty slots; a clue points to where atoms hide.
3. **Hunt** — full-screen camera scanner. Scan physical atom cards; each valid atom *materializes* into the holding field as a glowing creature with hands (= its valence).
4. **Bond ritual** — once the exact set is gathered, **press and hold** (more fingers = faster) to charge the lattice until it **SNAPS**.
5. **Reveal** — the molecule is named, flavor text decodes, a Codex card flips in.
6. **Codex** — a gallery of everything stabilized, with locked silhouettes for the rest. Reachable any time from the `◈ CODEX` control.

Everything is **client-side** and **persisted to `localStorage`** — a refresh resumes where you were.

### Testing without printed cards

On the Hunt screen, tap **`◇ TEST INJECTOR`** in the holding field to inject atoms by hand. Each press mints a fresh unique id, so the duplicate-rejection and verification logic behave exactly as they would with real QR codes. This stands in for the camera while developing.

---

## The verification logic (the part that has to be right)

When a card is scanned, [`src/store/verify.ts`](src/store/verify.ts) decides the outcome — a single pure function:

1. Parse `cardId` → `element` (`"H-014"` → `H`). Unparseable → *the signal is noise*.
2. Already in `claimedCardIds` → **reject** (*"This atom is already bound — find another."*) — stops a team faking a build by scanning one card twice.
3. A **Noble** (valence 0) → a sealed dead end.
4. The current target doesn't need this element, **or** the tray already holds enough → reject gently.
5. Otherwise add it; if the tray now matches the target `formula` **exactly** → enable the bond ritual.

On bond completion: the molecule joins `codexMolecules`, new elements join `codexElements`, the tray clears, and the mission advances.

The physical stick geometry guarantees a valid arrangement in the real world, so the app verifies the **right set of atoms via the ledger** — no image recognition needed.

---

## Adding content (no code required)

All game content is typed data:

| File | What it holds |
|------|----------------|
| [`src/data/elements.ts`](src/data/elements.ts) | atoms: symbol, valence, color, size, personality, codex entry |
| [`src/data/molecules.ts`](src/data/molecules.ts) | molecules: formula (`{H:2, O:1}`), codex entry, schematic hint |
| [`src/data/missions.ts`](src/data/missions.ts) | the linear mission chain: briefing / clue / reveal transmissions |

Add a molecule + a mission and it appears in the loop and the Codex automatically. Add the card ids to the `KIT` in the QR script and reprint.

**Seeded content (Act I):** Water `{H:2,O:1}` → Oxygen gas `{O:2}` → Carbon dioxide `{C:1,O:2}`. (Methane `{C:1,H:4}` is defined and shows as a locked Codex silhouette.) Elements: H, O, C, N, Na, Cl, plus the Nobles He / Ne / Ar as sealed trap cards.

---

## Tech

- **Vite + React + TypeScript** — static SPA, deploys anywhere.
- **Tailwind CSS** + custom keyframes + **Framer Motion** for the "alive" feel.
- **html5-qrcode** for camera scanning (wrapped with custom chrome in [`src/components/Scanner.tsx`](src/components/Scanner.tsx)).
- **Zustand** + `persist` middleware → `localStorage`.
- **vite-plugin-pwa** → web manifest, installable, offline precache.
- **Haptics** via `navigator.vibrate` — progressive enhancement (Android browsers; **iOS Safari ignores it**, so it's never load-bearing).

### Project layout

```
src/
  data/         elements, molecules, missions  (all content lives here)
  store/        session.ts (zustand+persist) · verify.ts (pure scan logic)
  components/   AtomGlyph · MoleculeSchematic · Scanner · Typewriter ·
                Background · ParticleField · ScanToast · CodexCard
  screens/      Boot · Briefing · Hunt · Bond · Reveal · Codex
scripts/
  generate-qr.mjs      → printable atom kit
  generate-icons.mjs   → PWA icons (dependency-free PNG encoder)
```

---

## Install as an app (add to home screen)

Open the deployed (HTTPS) URL on a phone → browser menu → **Add to Home Screen**. It launches standalone, full-bleed, dark — like a device from the world.

---

## Scope (v1)

**In:** intro + name; briefing with molecule picture + clue; QR scanning; holding field + visual progress; the press-and-hold bond; reveal + Codex; local persistence; installable PWA.

**Deferred:** any backend/accounts; multi-team sync/leaderboards; image-recognition of the physical model; audio/voice; the atmospheric world-map; per-mission countdown.
