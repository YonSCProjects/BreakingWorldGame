// ── The Magister's lines, as DATA ───────────────────────────────────────
// Like elements/molecules/missions, a voice line is content, not code. Audio
// lives in public/vo/ and is served at <base>vo/<file>. A cue's file is named
// after its stable id, so adding a line is: drop the .mp3 in, reference it here.
// Per-mission / per-molecule cues resolve by id convention, so a new molecule +
// its recording flows in with no code change — mirroring the data-driven promise.

import type { Cue } from './AudioEngine'
import type { ScanOutcome } from '../types'

const vo = (file: string): string => `${import.meta.env.BASE_URL}vo/${file}`

// Pick a variant so the Magister doesn't sound like a parrot on repeated cues.
export function pickCue(cues: Cue[]): Cue {
  return cues[Math.floor(Math.random() * cues.length)]
}

// The Magister's first breath as the cell wakes the device (fired by the Boot
// screen's "press your palm to the sigil" tap, which also unlocks audio).
export const BOOT_COLD_OPEN: Cue = {
  id: 'boot-cold-open',
  src: vo('boot-cold-open.mp3'),
  placeholder: 'wake',
}

// Reactions to a scanned card, keyed 1:1 to ScanOutcome['kind']. The high-
// frequency "accepted" and the memorable "noble" trap get variants.
type ScanKind = ScanOutcome['kind']

export const SCAN_CUES: Record<ScanKind, Cue[]> = {
  accepted: [
    { id: 'scan-accepted-a', src: vo('scan-accepted-a.mp3'), placeholder: 'accept' },
    { id: 'scan-accepted-b', src: vo('scan-accepted-b.mp3'), placeholder: 'accept' },
    { id: 'scan-accepted-c', src: vo('scan-accepted-c.mp3'), placeholder: 'accept' },
  ],
  duplicate: [{ id: 'scan-duplicate', src: vo('scan-duplicate.mp3'), placeholder: 'dud' }],
  'wrong-element': [
    { id: 'scan-wrong-element', src: vo('scan-wrong-element.mp3'), placeholder: 'reject' },
  ],
  'already-full': [
    { id: 'scan-already-full', src: vo('scan-already-full.mp3'), placeholder: 'dud' },
  ],
  noble: [
    { id: 'scan-noble-a', src: vo('scan-noble-a.mp3'), placeholder: 'noble' },
    { id: 'scan-noble-b', src: vo('scan-noble-b.mp3'), placeholder: 'noble' },
  ],
  unknown: [{ id: 'scan-unknown', src: vo('scan-unknown.mp3'), placeholder: 'neutral' }],
}

// The set is now complete — distinct from a plain "accepted".
export const READY_CUE: Cue = {
  id: 'scan-ready',
  src: vo('scan-ready.mp3'),
  placeholder: 'ready',
}

// The press-and-hold bonding ritual — a building incantation (Phase 4 will gate
// layers by hold progress; for now one line on entering the rite).
export const BOND_CUE: Cue = {
  id: 'bond',
  src: vo('bond.mp3'),
  placeholder: 'briefing',
}

// Resolve-by-convention: a mission's briefing line and a molecule's reveal line
// are named after their data id. Add the mission/molecule + drop the file — done.
export const briefingCue = (missionId: string): Cue => ({
  id: `briefing-${missionId}`,
  src: vo(`briefing-${missionId}.mp3`),
  placeholder: 'briefing',
})

export const revealCue = (moleculeId: string): Cue => ({
  id: `reveal-${moleculeId}`,
  src: vo(`reveal-${moleculeId}.mp3`),
  placeholder: 'reveal',
})
