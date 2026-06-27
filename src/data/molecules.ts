import type { Molecule } from '../types'

// Everything the cell can stabilize. The Codex is built from this.
// Voice/flavor stays short and warm — this is for kids.
export const MOLECULES: Record<string, Molecule> = {
  hydrogen_gas: {
    id: 'hydrogen_gas',
    displayName: 'Hydrogen Gas',
    formula: { H: 2 },
    act: 1,
    centerSymbol: 'H',
    codexEntry:
      'Two tiny white sparks holding hands. Hydrogen is the very first thing the universe ever made — and the first thing you made too.',
  },
  salt: {
    id: 'salt',
    displayName: 'Salt',
    formula: { Na: 1, Cl: 1 },
    act: 1,
    centerSymbol: 'Na',
    codexEntry:
      'A wild violet spark and a sharp green one, snapped together. On their own they are trouble — together they are the salt on your fries.',
  },
  water: {
    id: 'water',
    displayName: 'Water',
    formula: { H: 2, O: 1 },
    act: 1,
    centerSymbol: 'O',
    codexEntry:
      'Two white, one red. Water is the most important thing alive — every plant, every animal, every one of you is mostly this.',
  },
  ammonia: {
    id: 'ammonia',
    displayName: 'Ammonia',
    formula: { N: 1, H: 3 },
    act: 1,
    centerSymbol: 'N',
    codexEntry:
      'One calm blue spark holding three white ones. You have smelled it before — the sharp bite in cleaning spray.',
  },
  methane: {
    id: 'methane',
    displayName: 'Methane',
    formula: { C: 1, H: 4 },
    act: 1,
    centerSymbol: 'C',
    codexEntry:
      'One grey builder gripping four white sparks. Methane is the gas that makes fire — the first whisper of everything that can burn and glow.',
  },
  oxygen_gas: {
    id: 'oxygen_gas',
    displayName: 'Oxygen Gas',
    formula: { O: 2 },
    act: 2,
    centerSymbol: 'O',
    codexEntry:
      'Two red sparks bound tight. Your cells burn food with this to make the energy to move — and plants make it fresh for you.',
  },
  carbon_dioxide: {
    id: 'carbon_dioxide',
    displayName: 'Carbon Dioxide',
    formula: { C: 1, O: 2 },
    act: 2,
    centerSymbol: 'C',
    codexEntry:
      'One grey, two red, in a straight line. The leftover when your cells make energy — and exactly what plants are hungry to drink in.',
  },
}

export const ALL_MOLECULE_IDS = Object.keys(MOLECULES)

// Count how many atoms of each element a molecule needs (total bonds = its size).
export function moleculeAtomCount(m: Molecule): number {
  return Object.values(m.formula).reduce((a, b) => a + b, 0)
}
