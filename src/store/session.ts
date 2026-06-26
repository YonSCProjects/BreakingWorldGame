import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ScanOutcome, Session } from '../types'
import { MISSIONS } from '../data/missions'
import { MOLECULES } from '../data/molecules'
import { evaluateScan, isFormulaComplete } from './verify'

// ── Phases of a single run, screen by screen ────────────────────────────
export type Phase = 'boot' | 'briefing' | 'hunt' | 'bond' | 'reveal'

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

  // actions
  namecell: (name: string) => void
  goto: (p: Phase) => void
  beginHunt: () => void
  claimCard: (raw: string) => ScanOutcome
  clearLastScan: () => void
  completeBond: () => void
  continueFromReveal: () => void
  resetSession: () => void
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
        set((s) => {
          const nextIndex = s.session.currentMissionIndex + 1
          const more = nextIndex < MISSIONS.length
          return {
            session: {
              ...s.session,
              currentMissionIndex: nextIndex,
              tray: [], // holding field cleared for the next target
            },
            revealedMoleculeId: null,
            // If the act is finished, linger on the Codex; otherwise next briefing.
            phase: more ? 'briefing' : 'briefing',
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
        }),
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
