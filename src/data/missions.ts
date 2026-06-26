import type { Mission } from '../types'

// Act I — a linear descent. One glorious chain: Water → Oxygen gas → Carbon dioxide.
// Voice: a transmission from the Lattice. Urgent, sci-fi, never instructional.
export const MISSIONS: Mission[] = [
  {
    id: 'm1-water',
    order: 1,
    act: 1,
    targetMoleculeId: 'water',
    briefingText:
      'CELL — the Unbinding has reached the lowlands. Bonds are slipping; matter is forgetting how to hold itself. We need an anchor, and the oldest anchor is WATER. Two of Hydrogen, one of Oxygen. Bring them into the holding field and we will teach them to clasp again. Move before the ground does.',
    clueText:
      'Hydrogen runs frantic where things are small and many — count the loose ones, gather two. Oxygen burns red and waits where the air feels hot. One mouth, two hands: that is all Water asks.',
    revealText:
      'It holds. The first stable shape in days — two small hands locked to one red mouth, and the static draws back from the edges of the world. WATER stands. The Lattice can breathe through it now. You have bought us ground to stand on. Do not waste it.',
  },
  {
    id: 'm2-oxygen',
    order: 2,
    act: 1,
    targetMoleculeId: 'oxygen_gas',
    briefingText:
      'The anchor holds, but the cell is starving — the air itself is coming apart. We need OXYGEN GAS: two hungers bound to each other so the rest can breathe. Find two of Oxygen and bring them close. They will not want to let go of you. That is exactly right.',
    clueText:
      'Twice the red. Where heat gathers and breath comes short, two Oxygens drift apart and ache to pair. Take both. A single one will only reach for your hand instead.',
    revealText:
      'They snap together with a sound like a held breath released — a double bond drawn tight, and suddenly the air around you means something again. OXYGEN GAS stabilized. The cell breathes. The Unbinding hates a thing that gives life away this freely. Good.',
  },
  {
    id: 'm3-co2',
    order: 3,
    act: 1,
    targetMoleculeId: 'carbon_dioxide',
    briefingText:
      'Last of the descent, CELL. To seal this lowland we need CARBON DIOXIDE — the quiet line that fire leaves behind. One Carbon, the patient architect with four hands, pinned between two of Oxygen’s appetites. Find the builder. Find two hungers. Bring them to the field together.',
    clueText:
      'Carbon waits where things have burned and gone still — charcoal-grey, four-handed, in no hurry. Flank it with two Oxygens, one to each side. The architect will hold them both at arm’s length, and the line will go straight.',
    revealText:
      'Carbon takes an Oxygen in each grip and the three lock into a single quiet line — straight, balanced, finished. CARBON DIOXIDE stabilized. The lowland stops dissolving. Three shapes stand where there was only static. The Lattice marks this cell. The descent is yours.',
  },
]

export function missionByIndex(i: number): Mission | undefined {
  return MISSIONS[i]
}
