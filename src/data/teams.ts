// The three Orders. Each guards one of the three gifts that make life — so all
// three together "bring the world back to life". Picking from this fixed set
// (or a badge deep-link) means a field phone and its Seer always share a room.
//
// `name` is the join code + room key. Edit freely.
export type Team = { name: string; color: string; emoji: string; guards: string }

export const TEAMS: Team[] = [
  { name: 'EAGLE', color: '#ffce54', emoji: '🦅', guards: 'the Air' },
  { name: 'DOLPHIN', color: '#5ef2ff', emoji: '🐬', guards: 'the Water' },
  { name: 'LION', color: '#ffa23d', emoji: '🦁', guards: 'the Sun' },
]

export function teamByName(n: string | null | undefined): Team | undefined {
  if (!n) return undefined
  return TEAMS.find((t) => t.name === n.toUpperCase())
}
