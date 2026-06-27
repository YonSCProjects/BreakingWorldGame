// 3D ball-and-stick geometry for the control-room view. Coordinates are
// roughly true to each molecule's real shape (bent, linear, tetrahedral).
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
