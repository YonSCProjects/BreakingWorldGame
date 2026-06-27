import type { Mission } from '../types'

// The Magister's voice: warm, short, believing in them. Hunts are described by
// COLOUR (two white, one red), never chemistry. Every line is encouraging and
// easy to read. Clues are friendly placeholders — tailor them to where YOU hide
// the cards. (Written in English; Hebrew translation happens later.)
//
// HOUR 1 (act 1): five quick builds, easy → bigger — "find your power".
// HOUR 2 (act 2): the breath of the world — breathing ↔ photosynthesis.
export const MISSIONS: Mission[] = [
  // ── HOUR 1 ──────────────────────────────────────────────────────────
  {
    id: 'm1-hydrogen',
    order: 1,
    act: 1,
    targetMoleculeId: 'hydrogen_gas',
    briefingText:
      'First task, CELL — and an easy one to start. Make HYDROGEN. Find two white sparks and bring them together. You’ve got this.',
    clueText:
      'White sparks are tiny and there are lots of them. Look low, look close — start right near where you’re standing.',
    revealText:
      'Done! That’s HYDROGEN — the very first thing that ever existed. You made it look easy. I chose well.',
  },
  {
    id: 'm2-salt',
    order: 2,
    act: 1,
    targetMoleculeId: 'salt',
    briefingText:
      'Next: SALT — yes, the kind on your fries. Find one violet spark and one green one. Two colours, one team.',
    clueText:
      'Violet is rare and a little wild. Green likes to hide in corners. Spread out and shout when you spot one.',
    revealText:
      'SALT! The violet and the green grabbed each other in a flash. Nice teamwork — that’s a gift, you know. Keep going.',
  },
  {
    id: 'm3-water',
    order: 3,
    act: 1,
    targetMoleculeId: 'water',
    briefingText:
      'Now WATER — the most important thing alive. Two white sparks and one red one. You already know how to find white.',
    clueText:
      'Red ones glow warm. Two white, one red — gather all three and you’re there.',
    revealText:
      'WATER. Every living thing needs it, and you made it from almost nothing. That took focus. I’m impressed — next!',
  },
  {
    id: 'm4-ammonia',
    order: 4,
    act: 1,
    targetMoleculeId: 'ammonia',
    briefingText:
      'A tricky one: AMMONIA — the sharp smell in cleaning spray. One blue spark and THREE white. You can do hard things.',
    clueText:
      'Blue is calm and hides out in the open. Three whites is a lot — split the hunt between you.',
    revealText:
      'AMMONIA — four pieces, locked tight. The hardest yet, and you didn’t quit. THAT is who you are. Almost there.',
  },
  {
    id: 'm5-methane',
    order: 5,
    act: 1,
    targetMoleculeId: 'methane',
    briefingText:
      'Last one before you rest: METHANE — the gas that makes fire. One grey spark and FOUR white. Big build. Big team.',
    clueText:
      'Grey is heavy and slow, so it won’t be far. Four whites is a lot — share the load and hunt together.',
    revealText:
      'METHANE! Five pieces — your biggest build yet. Hour one is COMPLETE. Rest now, drink some water, shake out your legs. When you come back, the real secret begins. You earned it.',
  },

  // ── HOUR 2 · THE CIRCLE OF LIFE (cellular respiration ↔ photosynthesis) ─
  {
    id: 'm6-oxygen',
    order: 6,
    act: 2,
    targetMoleculeId: 'oxygen_gas',
    briefingText:
      'Welcome back, CELL. Here’s the real secret: ENERGY. To run, to move, even to think, your body burns food using OXYGEN — that’s respiration. Let’s make some oxygen: find two red sparks.',
    clueText: 'Red ones are warm and glowing. You only need two. Go!',
    revealText:
      'OXYGEN — half of your fuel. Your cells burn food WITH this to make the energy to move. And when they do, they let something out… come, I’ll show you.',
  },
  {
    id: 'm7-co2',
    order: 7,
    act: 2,
    targetMoleculeId: 'carbon_dioxide',
    briefingText:
      'When your cells burn food for energy, they let out CARBON DIOXIDE — you make it every second you’re alive. Build it: one grey, two red.',
    clueText: 'One grey, two red. You’ve found both colours before — you know what to do.',
    revealText:
      'CARBON DIOXIDE — the leftover from making your energy. You let it out… and plants? Plants are HUNGRY for it. Watch what happens next.',
  },
  {
    id: 'm8-water-plant',
    order: 8,
    act: 2,
    targetMoleculeId: 'water',
    briefingText:
      'Making energy also makes WATER — and plants drink it up. Plants take your carbon dioxide, your water, and sunlight to build new food and fresh oxygen. Bring the water: two white, one red.',
    clueText: 'Two white, one red — same as before. You’re fast at this now.',
    revealText:
      'Now the plant has it all — your carbon dioxide, your water, and the sun. It makes FOOD and fresh OXYGEN… the very things your cells need to make energy. One last build, and the circle closes.',
  },
  {
    id: 'm9-breath',
    order: 9,
    act: 2,
    targetMoleculeId: 'oxygen_gas',
    briefingText:
      'The finale, CELL. The plant makes OXYGEN and food, so you can make energy and live — and the circle closes. Make the last oxygen: two red sparks. Make it count.',
    clueText: 'Two red. You know exactly where to look. Finish strong, together.',
    revealText:
      'There it is — the CIRCLE OF LIFE. Your cells burn food and oxygen to make energy, and let out carbon dioxide and water. Plants drink those in, catch the sunlight, and make food and oxygen again — for you. Round and round, forever — and the sun powers it all.\n\nAnd the plant needs THREE gifts: air, water, and sun. Eagle, Dolphin, Lion. Alone, each is one piece. Together, you are life itself.\n\nYou restarted the circle, CELL. The world is alive — because of you, together.',
  },
]

export function missionByIndex(i: number): Mission | undefined {
  return MISSIONS[i]
}
