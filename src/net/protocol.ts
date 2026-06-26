// Shared wire protocol between the app (field phone + control PC) and the
// Cloudflare Worker "team room". Imported by BOTH sides so message shapes can
// never drift. Keep this file free of any browser/React/DOM imports — the
// Worker bundles it too.
import type { TrayAtom, ScanOutcome } from '../types'

export type Role = 'field' | 'control'

export type Hint = { text: string; ts: number; from: Role }

// The authoritative team state the server owns and broadcasts.
export type RoomState = {
  cellName: string
  currentMissionIndex: number
  tray: TrayAtom[]
  claimedCardIds: string[]
  codexMolecules: string[]
  codexElements: string[]
  hints: Hint[]
  ready: boolean // tray exactly matches the current target molecule
  presence: { field: number; control: number }
}

// ── client → server ────────────────────────────────────────────────────
export type ClientMsg =
  | { type: 'setName'; cellName: string }
  | { type: 'scan'; cardId: string } // a field device scanned/injected an atom
  | { type: 'hint'; text: string } // control room sends a transmission
  | { type: 'staffConfirm' } // staff confirmed the physical build → seal + advance
  | { type: 'reset' }

// ── server → client ────────────────────────────────────────────────────
export type ServerMsg =
  | { type: 'state'; state: RoomState } // full authoritative snapshot
  | { type: 'scanResult'; outcome: ScanOutcome; cardId: string } // transient, for FX
  | { type: 'hint'; hint: Hint } // transient ping so the field surfaces it
  | { type: 'sealed'; moleculeId: string } // transient, for the seal celebration
  | { type: 'error'; message: string }

export function freshRoomState(): RoomState {
  return {
    cellName: '',
    currentMissionIndex: 0,
    tray: [],
    claimedCardIds: [],
    codexMolecules: [],
    codexElements: [],
    hints: [],
    ready: false,
    presence: { field: 0, control: 0 },
  }
}
