import type { Element } from '../types'

// The atoms the Lattice can still hold. Color is the glow each one casts.
// Hebrew copy is a first draft (Yon to polish); symbol/valence/color/size are data.
export const ELEMENTS: Record<string, Element> = {
  H: {
    symbol: 'H',
    name: 'מימן',
    valence: 1,
    color: '#eafcff',
    sizeScale: 0.6,
    personality: 'נרעש, נואש להיאחז',
    codexEntry:
      'הראשון והקטן מכולם. המימן זוכר את ראשית הכול, ונואש להיאחז בכל דבר. יד אחת בלבד — אך לעולם אינו מרפה.',
  },
  O: {
    symbol: 'O',
    name: 'חמצן',
    valence: 2,
    color: '#ff5e6c',
    sizeScale: 0.95,
    personality: 'חמדן, דו-ידני, בוער',
    codexEntry:
      'רעב ואדום. החמצן לוקח בשתי ידיים ומשיב חום — או אש, אם מקניטים אותו. רוב מה שהעולם נושם עובר דרך אחיזתו.',
  },
  C: {
    symbol: 'C',
    name: 'פחמן',
    valence: 4,
    color: '#9aa4b2',
    sizeScale: 1.0,
    personality: 'אדריכל סבלני, ארבע ידיים יציבות',
    codexEntry:
      'הבונה. הפחמן אוחז ארבעה קשרים בעת ובעונה אחת ולעולם אינו עייף מבנייה. כל סריג חי שההתרה מפוררת היה, בלִבו, מעשה ידי הפחמן.',
  },
  N: {
    symbol: 'N',
    name: 'חנקן',
    valence: 3,
    color: '#5e8bff',
    sizeScale: 0.92,
    personality: 'קר, נעול-משולש, מסויג',
    codexEntry:
      'מתנשא וכחול. החנקן נקשר בשלשות ומתנגד להיפרד. הוא ממלא את השמיים ואינו מבקש דבר — וזו בדיוק הסיבה שכה קשה לגייסו.',
  },
  Na: {
    symbol: 'Na',
    name: 'נתרן',
    valence: 1,
    color: '#c08bff',
    sizeScale: 1.1,
    personality: 'פזיז, סגול, מטיל עצמו אל המים',
    codexEntry:
      'רך, סגול ופזיז. הנתרן מוסר את קשרו היחיד בנגיעה הקלה ביותר, ומתלקח כשהוא פוגש מים. נהגו בזיכרונו בזהירות.',
  },
  Cl: {
    symbol: 'Cl',
    name: 'כלור',
    valence: 1,
    color: '#7dffae',
    sizeScale: 1.05,
    personality: 'חד, ירוק, רעב לעוד אחד',
    codexEntry:
      'ירקרק וחד-זווית. הכלור רוצה דבר אחד בדיוק, וישוטט בחדר כולו כדי למצוא אותו. בזיווג נכון הוא משמר; בזיווג שגוי הוא מאכל.',
  },
  // ── The Nobles: sealed. Scanning one is a beautiful dead end. ──────────
  He: {
    symbol: 'He',
    name: 'הליום',
    valence: 0,
    color: '#ffd66e',
    sizeScale: 0.7,
    personality: 'חתום, זהוב, בל יוגע',
    trap: true,
    codexEntry:
      'זהוב ושלם. ההליום אינו זקוק לדבר ואינו נקשר לאיש. אוצר מושלם וחסר תועלת — הסריג אינו יכול לבנות ממה שכבר שלם.',
  },
  Ne: {
    symbol: 'Ne',
    name: 'נאון',
    valence: 0,
    color: '#ffce54',
    sizeScale: 0.85,
    personality: 'חתום, זוהר, מתנשא',
    trap: true,
    codexEntry:
      'הוא זוהר כשהעולם סביבו עולה באש, ונשאר בדיוק הוא עצמו. הנאון לא יושיט יד. סמנו את מיקומו והמשיכו הלאה.',
  },
  Ar: {
    symbol: 'Ar',
    name: 'ארגון',
    valence: 0,
    color: '#f0b840',
    sizeScale: 1.0,
    personality: 'חתום, עתיק, אדיש',
    trap: true,
    codexEntry:
      'העצלן. הארגון מילא את האוויר במשך עידנים ומעולם לא הצטרף לקשר. כספת חתומה של זהב. אין כאן דבר לאסוף.',
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
