// ── useMagister ─────────────────────────────────────────────────────────
// One hook, mounted once in App.tsx. It watches the same store fields that
// already drive the screens and speaks the right line at the right moment.
// It only ever calls the audio engine, which is a silent no-op until unlocked —
// so this never blocks or duplicates the game loop.

import { useEffect, useRef } from 'react'
import { useSession } from '../store/session'
import { MISSIONS } from '../data/missions'
import { audio } from './AudioEngine'
import {
  BOND_CUE,
  READY_CUE,
  SCAN_CUES,
  briefingCue,
  pickCue,
  revealCue,
} from './cues'

export function useMagister(): null {
  const phase = useSession((s) => s.phase)
  const lastScan = useSession((s) => s.lastScan)
  const missionIndex = useSession((s) => s.session.currentMissionIndex)
  const revealedId = useSession((s) => s.revealedMoleculeId)

  // Don't re-speak a phase line on every render — remember the last one voiced.
  const spokenKey = useRef<string | null>(null)
  // Scan reactions fire on a NEW scan only (the store stamps each with .ts).
  const lastScanTs = useRef(0)

  // A returning session skips the Boot sigil, so audio would never unlock. Prime
  // it on the first tap anywhere (a genuine user gesture); harmless if already on.
  useEffect(() => {
    if (audio.ready) return
    const prime = () => void audio.unlock()
    window.addEventListener('pointerdown', prime, { once: true })
    return () => window.removeEventListener('pointerdown', prime)
  }, [])

  // Phase-entry lines: briefing (per mission), the bond rite, the reveal.
  useEffect(() => {
    if (!audio.ready) return

    if (phase === 'briefing') {
      const mission = MISSIONS[missionIndex]
      if (!mission) return
      speakOnce(spokenKey, `briefing:${mission.id}`, briefingCue(mission.id))
    } else if (phase === 'bond') {
      speakOnce(spokenKey, 'bond', BOND_CUE)
    } else if (phase === 'reveal') {
      if (!revealedId) return
      speakOnce(spokenKey, `reveal:${revealedId}`, revealCue(revealedId))
    }
    // 'boot' is voiced by the wake tap itself; 'hunt' speaks only via scans.
  }, [phase, missionIndex, revealedId])

  // Scan reactions: acknowledge a find, celebrate a completed set, sting on the
  // noble dead-end, and so on — one line per fresh scan.
  useEffect(() => {
    if (!audio.ready || !lastScan) return
    if (lastScan.ts === lastScanTs.current) return
    lastScanTs.current = lastScan.ts

    if (lastScan.kind === 'accepted') {
      void audio.play(lastScan.ready ? READY_CUE : pickCue(SCAN_CUES.accepted))
      return
    }
    const cues = SCAN_CUES[lastScan.kind]
    if (cues?.length) void audio.play(pickCue(cues))
  }, [lastScan])

  return null
}

function speakOnce(
  ref: { current: string | null },
  key: string,
  cue: Parameters<typeof audio.play>[0],
): void {
  if (ref.current === key) return
  ref.current = key
  void audio.play(cue)
}
