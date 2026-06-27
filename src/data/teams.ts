// The three Orders. Each guards one of the three gifts that make life — so all
// three together "bring the world back to life". Picking from this fixed set
// (or a badge deep-link) means a field phone and its Seer always share a room.
//
// `name` is the join code + room key (keep ASCII). `heb` is the Hebrew Order
// name and `guards` the Hebrew gift, both shown in the ceremony.
export type Team = { name: string; heb: string; color: string; emoji: string; guards: string }

export const TEAMS: Team[] = [
  { name: 'EAGLE', heb: 'הנשרים', color: '#ffce54', emoji: '🦅', guards: 'האוויר' },
  { name: 'DOLPHIN', heb: 'הדולפינים', color: '#5ef2ff', emoji: '🐬', guards: 'המים' },
  { name: 'LION', heb: 'האריות', color: '#ffa23d', emoji: '🦁', guards: 'השמש' },
]

export function teamByName(n: string | null | undefined): Team | undefined {
  if (!n) return undefined
  return TEAMS.find((t) => t.name === n.toUpperCase())
}
