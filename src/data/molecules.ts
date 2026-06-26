import type { Molecule } from '../types'

// Everything the Lattice knows how to stabilize. The Codex is built from this.
export const MOLECULES: Record<string, Molecule> = {
  water: {
    id: 'water',
    displayName: 'Water',
    formula: { H: 2, O: 1 },
    act: 1,
    centerSymbol: 'O',
    codexEntry:
      'Two small hands and one hungry mouth. Water is where the world keeps its memory — the first stable thing, and the last to let go. With it, the Lattice can hold a shape again.',
  },
  oxygen_gas: {
    id: 'oxygen_gas',
    displayName: 'Oxygen Gas',
    formula: { O: 2 },
    act: 1,
    centerSymbol: 'O',
    codexEntry:
      'Two hungers, bound to each other so the rest of the world can breathe. A double bond, taut as a drawn wire. Volatile, generous, alive.',
  },
  carbon_dioxide: {
    id: 'carbon_dioxide',
    displayName: 'Carbon Dioxide',
    formula: { C: 1, O: 2 },
    act: 1,
    centerSymbol: 'C',
    codexEntry:
      'The architect, pinned between two appetites. Carbon Dioxide is what remains when fire has finished its work — a straight, quiet line. The world exhales it and the world drinks it back.',
  },
  methane: {
    id: 'methane',
    displayName: 'Methane',
    formula: { C: 1, H: 4 },
    act: 1,
    centerSymbol: 'C',
    codexEntry:
      'One architect, four eager hands clasped tight. Methane is the simplest thing Carbon builds, and the first whisper of everything that can burn, grow, or live.',
  },
}

export const ALL_MOLECULE_IDS = Object.keys(MOLECULES)

// Count how many atoms of each element a molecule needs (total bonds = its size).
export function moleculeAtomCount(m: Molecule): number {
  return Object.values(m.formula).reduce((a, b) => a + b, 0)
}
