import type { Molecule, ScanOutcome, TrayAtom } from '../types'
import { ELEMENTS, parseElement } from '../data/elements'

// Tally how many of each element currently sit in the holding field.
export function trayCounts(tray: TrayAtom[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const a of tray) counts[a.element] = (counts[a.element] ?? 0) + 1
  return counts
}

// Does the tray hold EXACTLY the target formula — no more, no less?
export function isFormulaComplete(tray: TrayAtom[], target: Molecule): boolean {
  const have = trayCounts(tray)
  const need = target.formula
  // every needed element present in the right amount...
  for (const [sym, n] of Object.entries(need)) {
    if ((have[sym] ?? 0) !== n) return false
  }
  // ...and nothing extra floating around.
  for (const sym of Object.keys(have)) {
    if (!(sym in need)) return false
  }
  return true
}

// The single source of truth for "what happens when this card is scanned".
// Pure: takes the world, returns an outcome. The store applies it.
export function evaluateScan(
  raw: string,
  claimedCardIds: string[],
  tray: TrayAtom[],
  target: Molecule,
): ScanOutcome {
  const cardId = raw.trim()
  const element = parseElement(cardId)

  // 0. Gibberish / unknown element → not one of ours.
  if (!element) return { kind: 'unknown', raw: cardId }

  // 1. Already bound elsewhere → no double-scanning a card to fake a build.
  if (claimedCardIds.includes(cardId)) return { kind: 'duplicate', cardId }

  // 2. A sealed Noble → a beautiful dead end.
  if (ELEMENTS[element]?.trap) return { kind: 'noble', element }

  const need = target.formula[element] ?? 0
  // 3a. The current molecule doesn't call for this element at all.
  if (need === 0) return { kind: 'wrong-element', element }

  // 3b. We already hold enough of it for this bond.
  const have = trayCounts(tray)[element] ?? 0
  if (have >= need) return { kind: 'already-full', element }

  // 4. Accept it. 5. Is the set now complete?
  const nextTray = [...tray, { cardId, element }]
  return {
    kind: 'accepted',
    element,
    cardId,
    ready: isFormulaComplete(nextTray, target),
  }
}
