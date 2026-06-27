import type { Mission } from '../types'

// The Magister's voice ("ראש המסדר"): warm, short, believing in them. Hunts are
// described by COLOUR (two white, one red), never chemistry. Atoms are called
// "יחידות חומר" (feminine) in-world. Clues are friendly placeholders — tailor
// them to where YOU hide the cards.
//
// HOUR 1 (act 1): five quick builds, easy → bigger — "find your power". HEBREW.
// HOUR 2 (act 2): the circle of life — respiration ↔ photosynthesis. Still
// ENGLISH (its Hebrew is translated separately, after the v2 rewrite).
export const MISSIONS: Mission[] = [
  // ── HOUR 1 (Hebrew) ─────────────────────────────────────────────────
  {
    id: 'm1-hydrogen',
    order: 1,
    act: 1,
    targetMoleculeId: 'hydrogen_gas',
    briefingText:
      'המשימה הראשונה — ואחת קלה להתחלה. צרו מימן. מצאו שתי יחידות חומר לבנות וחברו אותן. אתם מסוגלים.',
    clueText:
      'יחידות חומר לבנות הן קטנטנות, ויש מהן המון. חפשו נמוך וקרוב — ממש ליד הרגליים שלכם.',
    revealText:
      'סיימתם! זהו מימן — הדבר הראשון שאי-פעם היה קיים. גרמתם לזה להיראות קל. בחרתי נכון.',
  },
  {
    id: 'm2-salt',
    order: 2,
    act: 1,
    targetMoleculeId: 'salt',
    briefingText:
      'הבא בתור: מלח — כן, זה שעל הצ׳יפס. מצאו יחידת חומר סגולה אחת ויחידת חומר ירוקה אחת. שני צבעים, צוות אחד.',
    clueText:
      'הסגולה נדירה וקצת פראית. הירוקה אוהבת להתחבא בפינות. התפזרו, ומי שמוצא — שיצעק!',
    revealText:
      'מלח! הסגולה והירוקה תפסו אחת את השנייה בן רגע. עבודת צוות יפה — וזו מתנה, שתדעו. תמשיכו.',
  },
  {
    id: 'm3-water',
    order: 3,
    act: 1,
    targetMoleculeId: 'water',
    briefingText:
      'עכשיו מים — הדבר הכי חשוב לחיים. שתי יחידות חומר לבנות ואחת אדומה. את הלבנות אתם כבר יודעים למצוא.',
    clueText:
      'האדומות זוהרות בחום. שתיים לבנות, אחת אדומה — אספו את שלושתן, וזהו, הגעתם.',
    revealText:
      'מים. כל יצור חי צריך אותם, ואתם יצרתם אותם כמעט מכלום. זה דרש ריכוז. אני מתרשם — קדימה, הלאה!',
  },
  {
    id: 'm4-ammonia',
    order: 4,
    act: 1,
    targetMoleculeId: 'ammonia',
    briefingText:
      'אחת קצת קשה: אמוניה — הריח החריף בתרסיס ניקוי. יחידת חומר כחולה אחת ושלוש לבנות. אתם יודעים לעשות דברים קשים.',
    clueText:
      'הכחולה רגועה, ומתחבאת דווקא במקום גלוי. שלוש לבנות זה הרבה — חלקו את החיפוש ביניכם.',
    revealText:
      'אמוניה — ארבעה חלקים, מחוברים חזק. הכי קשה עד עכשיו, ולא ויתרתם. זה מי שאתם, באמת. כמעט שם.',
  },
  {
    id: 'm5-methane',
    order: 5,
    act: 1,
    targetMoleculeId: 'methane',
    briefingText:
      'אחרונה לפני שאתם נחים: מתאן — הגז שמדליק אש. יחידת חומר אפורה אחת וארבע לבנות. בנייה גדולה. צוות גדול.',
    clueText:
      'האפורה כבדה ואיטית, אז היא לא תהיה רחוקה. ארבע לבנות זה הרבה — חלקו את העבודה וחפשו ביחד.',
    revealText:
      'מתאן! חמישה חלקים — הבנייה הכי גדולה שלכם עד היום. שעה ראשונה — הושלמה! עכשיו נוחו, שתו קצת מים, נערו את הרגליים. כשתחזרו, מתחיל הסוד האמיתי. הרווחתם את זה.',
  },

  // ── HOUR 2 · THE CIRCLE OF LIFE (English — Hebrew pending v2 rewrite) ──
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
