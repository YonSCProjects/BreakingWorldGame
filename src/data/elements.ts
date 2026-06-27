import type { Element } from '../types'

// The atoms the Lattice can still hold. Color is the glow each one casts.
// `name` + `codexEntry` are player-facing → Hebrew. `personality` is internal.
export const ELEMENTS: Record<string, Element> = {
  H: {
    symbol: 'H',
    name: 'מימן',
    valence: 1,
    color: '#eafcff',
    sizeScale: 0.6,
    personality: 'frantic, eager to cling',
    codexEntry:
      'הראשון והקטן ביותר. המימן זוכר את ראשית הכול, ונואש להיאחז בכל דבר. יד אחת בלבד — אבל הוא אף פעם לא מרפה.',
  },
  O: {
    symbol: 'O',
    name: 'חמצן',
    valence: 2,
    color: '#ff5e6c',
    sizeScale: 0.95,
    personality: 'greedy, two-handed, burning',
    codexEntry:
      'רעב ואדום. החמצן לוקח בשתי ידיים ומחזיר חום — או אש, אם מרגיזים אותו. רוב מה שהעולם נושם עובר דרך האחיזה שלו.',
  },
  C: {
    symbol: 'C',
    name: 'פחמן',
    valence: 4,
    color: '#9aa4b2',
    sizeScale: 1.0,
    personality: 'patient architect, four steady hands',
    codexEntry:
      'הבנאי. הפחמן מחזיק ארבעה קשרים בבת אחת, ואף פעם לא נמאס לו לבנות.',
  },
  N: {
    symbol: 'N',
    name: 'חנקן',
    valence: 3,
    color: '#5e8bff',
    sizeScale: 0.92,
    personality: 'cold, triple-locked, reluctant',
    codexEntry:
      'מרוחק וכחול. החנקן מתקשר בשלשות ומתנגד שיפרידו אותו. הוא ממלא את השמיים ולא מבקש כלום.',
  },
  Na: {
    symbol: 'Na',
    name: 'נתרן',
    valence: 1,
    color: '#c08bff',
    sizeScale: 1.1,
    personality: 'reckless, violet, throws itself at water',
    codexEntry:
      'רך, סגול, וחסר זהירות. הנתרן מוותר על הקשר היחיד שלו בנגיעה הקלה ביותר, ומתלקח כשהוא פוגש מים.',
  },
  Cl: {
    symbol: 'Cl',
    name: 'כלור',
    valence: 1,
    color: '#7dffae',
    sizeScale: 1.05,
    personality: 'sharp, green, hungry for one more',
    codexEntry:
      'ירוק חיוור וחד. הכלור רוצה בדיוק דבר אחד, ויסרוק חדר שלם כדי למצוא אותו.',
  },
  // ── The Nobles: sealed. Scanning one is a beautiful dead end. ──────────
  He: {
    symbol: 'He',
    name: 'הליום',
    valence: 0,
    color: '#ffd66e',
    sizeScale: 0.7,
    personality: 'sealed, golden, untouchable',
    trap: true,
    codexEntry:
      'זהוב ושלם. ההליום לא צריך כלום ולא מתקשר עם אף אחד. אוצר מושלם וחסר תועלת.',
  },
  Ne: {
    symbol: 'Ne',
    name: 'ניאון',
    valence: 0,
    color: '#ffce54',
    sizeScale: 0.85,
    personality: 'sealed, glowing, aloof',
    trap: true,
    codexEntry:
      'הוא זוהר כשהעולם בוער מסביבו, ונשאר בדיוק הוא עצמו. הניאון לא יושיט יד.',
  },
  Ar: {
    symbol: 'Ar',
    name: 'ארגון',
    valence: 0,
    color: '#f0b840',
    sizeScale: 1.0,
    personality: 'sealed, ancient, indifferent',
    trap: true,
    codexEntry:
      'העצלן. הארגון ממלא את האוויר כבר עידנים ואף פעם לא הצטרף לאף קשר. אין כאן מה לאסוף.',
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
