import type { Element } from '../types'

// The atoms the Lattice can still hold. Color is the glow each one casts.
export const ELEMENTS: Record<string, Element> = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    valence: 1,
    color: '#eafcff',
    sizeScale: 0.6,
    personality: 'frantic, eager to cling',
    codexEntry:
      'The first and smallest. Hydrogen remembers the beginning of everything and is desperate to hold on to anything. One hand only — but it never lets go.',
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    valence: 2,
    color: '#ff5e6c',
    sizeScale: 0.95,
    personality: 'greedy, two-handed, burning',
    codexEntry:
      'Hungry and red. Oxygen takes with both hands and gives warmth in return — or fire, if provoked. Most of what the world breathes passes through its grip.',
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    valence: 4,
    color: '#9aa4b2',
    sizeScale: 1.0,
    personality: 'patient architect, four steady hands',
    codexEntry:
      'The builder. Carbon holds four bonds at once and never tires of construction. Every living lattice the Unbinding is unraveling was, at its heart, Carbon’s work.',
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    valence: 3,
    color: '#5e8bff',
    sizeScale: 0.92,
    personality: 'cold, triple-locked, reluctant',
    codexEntry:
      'Aloof and blue. Nitrogen binds in threes and resists being split. It fills the sky and asks for nothing, which is exactly why it is so hard to recruit.',
  },
  Na: {
    symbol: 'Na',
    name: 'Sodium',
    valence: 1,
    color: '#c08bff',
    sizeScale: 1.1,
    personality: 'reckless, violet, throws itself at water',
    codexEntry:
      'Soft, violet, and reckless. Sodium gives away its single bond at the slightest touch and flares when it meets water. Handle the memory of it carefully.',
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    valence: 1,
    color: '#7dffae',
    sizeScale: 1.05,
    personality: 'sharp, green, hungry for one more',
    codexEntry:
      'Pale green and sharp-edged. Chlorine wants exactly one thing and will scour a room to find it. Paired well it preserves; paired wrong it corrodes.',
  },
  // ── The Nobles: sealed. Scanning one is a beautiful dead end. ──────────
  He: {
    symbol: 'He',
    name: 'Helium',
    valence: 0,
    color: '#ffd66e',
    sizeScale: 0.7,
    personality: 'sealed, golden, untouchable',
    trap: true,
    codexEntry:
      'Golden and complete. Helium needs nothing and bonds with no one. A perfect, useless treasure — the Lattice cannot build with what is already whole.',
  },
  Ne: {
    symbol: 'Ne',
    name: 'Neon',
    valence: 0,
    color: '#ffce54',
    sizeScale: 0.85,
    personality: 'sealed, glowing, aloof',
    trap: true,
    codexEntry:
      'It glows when the world burns around it, and stays exactly itself. Neon will not lend a hand. Note its location and move on.',
  },
  Ar: {
    symbol: 'Ar',
    name: 'Argon',
    valence: 0,
    color: '#f0b840',
    sizeScale: 1.0,
    personality: 'sealed, ancient, indifferent',
    trap: true,
    codexEntry:
      'The lazy one. Argon has filled the air for eons and never once joined a bond. A sealed vault of gold. There is nothing here to gather.',
  },
}

// Parse the element symbol out of a card id like "H-014" or "Na-002".
export function parseElement(cardId: string): string | null {
  const match = cardId.trim().match(/^([A-Z][a-z]?)-\d+$/)
  if (!match) return null
  const symbol = match[1]
  return ELEMENTS[symbol] ? symbol : null
}

export const ALL_ELEMENT_SYMBOLS = Object.keys(ELEMENTS)
