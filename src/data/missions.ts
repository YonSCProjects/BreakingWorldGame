import type { Mission } from '../types'

// The Magister's voice ("ראש המסדר"): warm, short, believing in them. Hunts are
// described by COLOUR (two white, one red), never chemistry. Atoms are called
// "יחידות חומר" (feminine) in-world. Clues are friendly placeholders — tailor
// them to where YOU hide the cards.
//
// One ~hour of app play (all act 1): eight builds, easy → bigger. M1–M5 are in
// Hebrew; M6–M8 (oxygen, CO₂, and the GLUCOSE bonus) are still English until
// translated. Glucose (C₆H₁₂O₆ = 24 atoms) is the giant "champions" build for
// teams that race ahead.
export const MISSIONS: Mission[] = [
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
      'מתאן — הגז שמדליק אש. יחידת חומר אפורה אחת וארבע לבנות. בנייה גדולה, צוות גדול.',
    clueText:
      'האפורה כבדה ואיטית, אז היא לא תהיה רחוקה. ארבע לבנות זה הרבה — חלקו את העבודה וחפשו ביחד.',
    revealText:
      'מתאן! חמישה חלקים — הבנייה הכי גדולה שלכם עד עכשיו. אתם מכונה משומנת. ממשיכים!',
  },

  // ── Oxygen, CO₂, and the GLUCOSE bonus (English — Hebrew pending) ──────
  {
    id: 'm6-oxygen',
    order: 6,
    act: 1,
    targetMoleculeId: 'oxygen_gas',
    briefingText:
      'Next: OXYGEN — the air every animal breathes. Two red sparks, that’s all. Easy after methane.',
    clueText: 'Red ones glow warm — you’ve grabbed them before. Just two this time. Go!',
    revealText:
      'OXYGEN! The air in your lungs this very second. You made the thing that keeps every animal alive. Nice — keep rolling.',
  },
  {
    id: 'm7-co2',
    order: 7,
    act: 1,
    targetMoleculeId: 'carbon_dioxide',
    briefingText:
      'Now CARBON DIOXIDE — the gas you breathe OUT. One grey spark and two red. You know both colours.',
    clueText: 'One grey, two red. Grey is heavy and stays low; red glows warm. Grab all three.',
    revealText:
      'CARBON DIOXIDE! You breathe this out with every breath, and plants drink it in. You’re flying today — one giant build left.',
  },
  {
    id: 'm8-glucose',
    order: 8,
    act: 1,
    targetMoleculeId: 'glucose',
    briefingText:
      'The CHAMPIONS’ build, only for the fastest teams: GLUCOSE — the sugar that fuels every living thing. It’s massive: six grey, twelve white, six red. Split up and go big.',
    clueText:
      'Twenty-four pieces — the biggest yet. Some hunt grey, some white, some red, and bring them all back together.',
    revealText:
      'GLUCOSE! Twenty-four pieces — the largest thing you have ever built. This is the sugar inside every plant, and inside you. You are LEGENDS of the Order. Rest now — you earned every bit of it.',
  },
]

export function missionByIndex(i: number): Mission | undefined {
  return MISSIONS[i]
}
