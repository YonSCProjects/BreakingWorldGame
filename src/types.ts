// ── The shape of the world ──────────────────────────────────────────────
// All game *content* is data. Adding a molecule or a mission needs no code.

export type Element = {
  symbol: string // "H"
  name: string // "Hydrogen"
  valence: number // bonds/sticks: H 1, O 2, N 3, C 4, Nobles 0
  color: string // hex glow, e.g. "#FFFFFF"
  sizeScale: number // relative ball size, e.g. H 0.6, C 1.0
  personality: string // short flavor for the materialize moment
  codexEntry: string // in-world description of the atom
  trap?: boolean // nobles: scanning one is a dead end
}

export type Molecule = {
  id: string // "water"
  displayName: string // "Water"
  formula: Record<string, number> // { H: 2, O: 1 }  (symbol -> count)
  act: number
  codexEntry: string // in-world: what it is and what it does
  // A hint for drawing the schematic: which element sits at the center.
  // If omitted, the app picks the highest-valence atom as the core.
  centerSymbol?: string
}

export type Mission = {
  id: string
  order: number
  act: number
  targetMoleculeId: string
  briefingText: string // the Lattice transmission
  clueText: string // riddle pointing to where atoms hide
  revealText: string // what the app says after the bond forms
}

// ── Runtime session (persisted to localStorage) ─────────────────────────

export type TrayAtom = { cardId: string; element: string }

export type Session = {
  cellName: string
  currentMissionIndex: number
  tray: TrayAtom[] // atoms gathered for the CURRENT molecule
  claimedCardIds: string[] // every card ever claimed (anti-double-scan)
  codexMolecules: string[] // molecule ids completed
  codexElements: string[] // element symbols discovered
}

// Result of attempting to claim a scanned card — drives the in-world toast.
export type ScanOutcome =
  | { kind: 'accepted'; element: string; cardId: string; ready: boolean }
  | { kind: 'duplicate'; cardId: string }
  | { kind: 'wrong-element'; element: string }
  | { kind: 'already-full'; element: string }
  | { kind: 'noble'; element: string }
  | { kind: 'unknown'; raw: string }
