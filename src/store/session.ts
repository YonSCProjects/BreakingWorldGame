import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ScanOutcome, Session } from '../types'
import type { RoomState } from '../net/protocol'
import { MISSIONS } from '../data/missions'
import { MOLECULES } from '../data/molecules'
import { evaluateScan, isFormulaComplete } from './verify'

// ── Phases of a single run, screen by screen ────────────────────────────
export type Phase = 'boot' | 'briefing' | 'hunt' | 'bond' | 'reveal'

// 'solo' = the offline v1 loop (single phone, local state — the safety net).
// 'field' = a networked field device whose data is mirrored from its team room.
export type Mode = 'solo' | 'field'

type Store = {
  // persisted session
  session: Session
  // transient UI phase (NOT persisted across the loop boundaries we control)
  phase: Phase
  // the last scan result, so the Hunt screen can flash an in-world toast
  lastScan: (ScanOutcome & { ts: number }) | null
  // molecule just revealed (drives the Reveal screen)
  revealedMoleculeId: string | null
  hasBooted: boolean
  mode: Mode

  // actions
  namecell: (name: string) => void
  goto: (p: Phase) => void
  beginHunt: () => void
  claimCard: (raw: string) => ScanOutcome
  clearLastScan: () => void
  completeBond: () => void
  continueFromReveal: () => void
  resetSession: () => void

  // ── networked-mode hooks (no-ops for solo) ──────────────────────────
  setMode: (m: Mode) => void
  // mirror the authoritative team state from the room into the view-model
  syncFromRoom: (rs: RoomState) => void
  // surface a server-decided scan outcome (drives the same toast/FX as solo)
  pushScan: (o: ScanOutcome) => void
  // jump straight to the reveal for a just-sealed molecule (server-driven)
  revealMolecule: (moleculeId: string) => void
}

const freshSession: Session = {
  cellName: '',
  currentMissionIndex: 0,
  tray: [],
  claimedCardIds: [],
  codexMolecules: [],
  codexElements: [],
}

export const useSession = create<Store>()(
  persist(
    (set, get) => ({
      session: freshSession,
      phase: 'boot',
      lastScan: null,
      revealedMoleculeId: null,
      hasBooted: false,
      mode: 'solo',

      namecell: (name) =>
        set((s) => ({
          session: { ...s.session, cellName: name.trim().toUpperCase() || 'UNNAMED CELL' },
          hasBooted: true,
          phase: 'briefing',
        })),

      goto: (p) => set({ phase: p }),

      beginHunt: () => set({ phase: 'hunt', lastScan: null }),

      claimCard: (raw) => {
        const { session } = get()
        const mission = MISSIONS[session.currentMissionIndex]
        if (!mission) {
          const outcome: ScanOutcome = { kind: 'unknown', raw }
          set({ lastScan: { ...outcome, ts: stamp() } })
          return outcome
        }
        const target = MOLECULES[mission.targetMoleculeId]
        const outcome = evaluateScan(
          raw,
          session.claimedCardIds,
          session.tray,
          target,
        )

        if (outcome.kind === 'accepted') {
          set((s) => ({
            session: {
              ...s.session,
              tray: [...s.session.tray, { cardId: outcome.cardId, element: outcome.element }],
              claimedCardIds: [...s.session.claimedCardIds, outcome.cardId],
              codexElements: s.session.codexElements.includes(outcome.element)
                ? s.session.codexElements
                : [...s.session.codexElements, outcome.element],
            },
            lastScan: { ...outcome, ts: stamp() },
          }))
        } else {
          set({ lastScan: { ...outcome, ts: stamp() } })
        }
        return outcome
      },

      clearLastScan: () => set({ lastScan: null }),

      completeBond: () => {
        const { session } = get()
        const mission = MISSIONS[session.currentMissionIndex]
        if (!mission) return
        const target = MOLECULES[mission.targetMoleculeId]
        // Guard: never seal an incomplete set.
        if (!isFormulaComplete(session.tray, target)) return

        set((s) => ({
          session: {
            ...s.session,
            codexMolecules: s.session.codexMolecules.includes(target.id)
              ? s.session.codexMolecules
              : [...s.session.codexMolecules, target.id],
          },
          revealedMoleculeId: target.id,
          phase: 'reveal',
        }))
      },

      continueFromReveal: () => {
        const { mode } = get()
        // In field mode the room already advanced the mission + cleared the
        // tray; we only step the local UI back to the briefing.
        if (mode === 'field') {
          set({ phase: 'briefing', revealedMoleculeId: null })
          return
        }
        set((s) => {
          const nextIndex = s.session.currentMissionIndex + 1
          return {
            session: {
              ...s.session,
              currentMissionIndex: nextIndex,
              tray: [], // holding field cleared for the next target
            },
            revealedMoleculeId: null,
            phase: 'briefing',
          }
        })
      },

      resetSession: () =>
        set({
          session: freshSession,
          phase: 'boot',
          lastScan: null,
          revealedMoleculeId: null,
          hasBooted: false,
          mode: 'solo',
        }),

      // ── networked-mode hooks ────────────────────────────────────────
      setMode: (m) => set({ mode: m }),

      syncFromRoom: (rs) =>
        set((s) => ({
          session: {
            ...s.session,
            cellName: rs.cellName || s.session.cellName,
            currentMissionIndex: rs.currentMissionIndex,
            tray: rs.tray,
            claimedCardIds: rs.claimedCardIds,
            codexMolecules: rs.codexMolecules,
            codexElements: rs.codexElements,
          },
        })),

      pushScan: (o) => set({ lastScan: { ...o, ts: stamp() } }),

      revealMolecule: (moleculeId) =>
        set({ revealedMoleculeId: moleculeId, phase: 'reveal' }),
    }),
    {
      name: 'lattice-session-v1',
      // Persist the durable bits. Phase + hasBooted let a refresh land you
      // back roughly where you were instead of replaying the cold open.
      partialize: (s) => ({
        session: s.session,
        phase: s.phase,
        hasBooted: s.hasBooted,
        revealedMoleculeId: s.revealedMoleculeId,
      }),
    },
  ),
)

// Date.now via a tiny helper so the intent reads clearly at call sites.
function stamp(): number {
  return Date.now()
}
