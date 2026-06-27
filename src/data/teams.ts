// The cells (teams) for an event. Picking from a fixed list means a field phone
// and its control room ALWAYS land in the same room — no typos, no two devices
// drifting into different rooms. Assign one distinct cell per group of players.
//
// To change names/colours/count, just edit this list.
export type Team = { name: string; color: string }

export const TEAMS: Team[] = [
  { name: 'AURORA', color: '#5ef2ff' },
  { name: 'EMBER', color: '#ff7a5e' },
  { name: 'COMET', color: '#5e8bff' },
  { name: 'ORION', color: '#c08bff' },
  { name: 'TITAN', color: '#7dffae' },
  { name: 'PHOENIX', color: '#ffce54' },
]
