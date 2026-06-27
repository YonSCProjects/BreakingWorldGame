// 3D ball-and-stick geometry for the control-room view. Coordinates are
// roughly true to each molecule's real shape (bent, linear, tetrahedral). A
// procedural fallback (structureFor) covers molecules with no entry, e.g. the
// big glucose bonus build.
import { MOLECULES } from './molecules'

export type Atom3D = { symbol: string; pos: [number, number, number] }
export type Bond3D = { a: number; b: number; order: 1 | 2 }
export type Structure3D = { atoms: Atom3D[]; bonds: Bond3D[] }

export const STRUCTURES: Record<string, Structure3D> = {
  // a simple pair
  hydrogen_gas: {
    atoms: [
      { symbol: 'H', pos: [-0.45, 0, 0] },
      { symbol: 'H', pos: [0.45, 0, 0] },
    ],
    bonds: [{ a: 0, b: 1, order: 1 }],
  },
  // a violet–green pair
  salt: {
    atoms: [
      { symbol: 'Na', pos: [-0.72, 0, 0] },
      { symbol: 'Cl', pos: [0.72, 0, 0] },
    ],
    bonds: [{ a: 0, b: 1, order: 1 }],
  },
  // bent ~104.5°
  water: {
    atoms: [
      { symbol: 'O', pos: [0, 0, 0] },
      { symbol: 'H', pos: [0.76, 0.59, 0] },
      { symbol: 'H', pos: [-0.76, 0.59, 0] },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 },
    ],
  },
  // trigonal pyramid
  ammonia: {
    atoms: [
      { symbol: 'N', pos: [0, 0.18, 0] },
      { symbol: 'H', pos: [0.82, -0.2, 0] },
      { symbol: 'H', pos: [-0.41, -0.2, 0.71] },
      { symbol: 'H', pos: [-0.41, -0.2, -0.71] },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
    ],
  },
  // tetrahedral
  methane: {
    atoms: [
      { symbol: 'C', pos: [0, 0, 0] },
      { symbol: 'H', pos: [0.63, 0.63, 0.63] },
      { symbol: 'H', pos: [-0.63, -0.63, 0.63] },
      { symbol: 'H', pos: [-0.63, 0.63, -0.63] },
      { symbol: 'H', pos: [0.63, -0.63, -0.63] },
    ],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
    ],
  },
  // double-bonded pair
  oxygen_gas: {
    atoms: [
      { symbol: 'O', pos: [-0.62, 0, 0] },
      { symbol: 'O', pos: [0.62, 0, 0] },
    ],
    bonds: [{ a: 0, b: 1, order: 2 }],
  },
  // linear O=C=O
  carbon_dioxide: {
    atoms: [
      { symbol: 'C', pos: [0, 0, 0] },
      { symbol: 'O', pos: [-1.16, 0, 0] },
      { symbol: 'O', pos: [1.16, 0, 0] },
    ],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 2 },
    ],
  },
}

// Geometry for a molecule: a hand-authored structure if we have one, otherwise
// a procedural ball-cluster (atoms on a golden-spiral sphere, no sticks) so
// large molecules like glucose still render instead of showing an empty panel.
export function structureFor(id: string): Structure3D | null {
  const explicit = STRUCTURES[id]
  if (explicit) return explicit
  const m = MOLECULES[id]
  if (!m) return null
  const flat: string[] = []
  for (const [sym, n] of Object.entries(m.formula)) for (let i = 0; i < n; i++) flat.push(sym)
  const N = flat.length
  const R = 1.0 + N * 0.035
  const golden = Math.PI * (3 - Math.sqrt(5))
  const atoms: Atom3D[] = flat.map((symbol, i) => {
    const y = N <= 1 ? 0 : 1 - (i / (N - 1)) * 2
    const rad = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    return { symbol, pos: [Math.cos(theta) * rad * R, y * R, Math.sin(theta) * rad * R] }
  })
  return { atoms, bonds: [] }
}
