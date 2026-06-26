import type { Molecule } from '../types'

// Everything the Lattice knows how to stabilize. The Codex is built from this.
// Hebrew copy is a first draft (Yon to polish); id/formula/act/center are data.
export const MOLECULES: Record<string, Molecule> = {
  water: {
    id: 'water',
    displayName: 'מים',
    formula: { H: 2, O: 1 },
    act: 1,
    centerSymbol: 'O',
    codexEntry:
      'שתי ידיים קטנות ופה רעב אחד. המים הם המקום שבו העולם שומר את זיכרונו — הדבר היציב הראשון, והאחרון להרפות. עִמם, הסריג יכול שוב לאחוז בצורה.',
  },
  oxygen_gas: {
    id: 'oxygen_gas',
    displayName: 'גז חמצן',
    formula: { O: 2 },
    act: 1,
    centerSymbol: 'O',
    codexEntry:
      'שני רעבים, קשורים זה לזה כדי שכל היתר יוכל לנשום. קשר כפול, מתוח כמו תיל דרוך. הפכפך, נדיב, חי.',
  },
  carbon_dioxide: {
    id: 'carbon_dioxide',
    displayName: 'פחמן דו-חמצני',
    formula: { C: 1, O: 2 },
    act: 1,
    centerSymbol: 'C',
    codexEntry:
      'האדריכל, נעוץ בין שני תאבונות. הפחמן הדו-חמצני הוא מה שנותר כשהאש סיימה את מלאכתה — קו שקט וישר. העולם נושף אותו, והעולם שותה אותו בחזרה.',
  },
  methane: {
    id: 'methane',
    displayName: 'מתאן',
    formula: { C: 1, H: 4 },
    act: 1,
    centerSymbol: 'C',
    codexEntry:
      'אדריכל אחד, ארבע ידיים להוטות אחוזות היטב. המתאן הוא הדבר הפשוט ביותר שהפחמן בונה, והלחישה הראשונה של כל מה שיכול לבעור, לצמוח או לחיות.',
  },
}

export const ALL_MOLECULE_IDS = Object.keys(MOLECULES)

// Count how many atoms of each element a molecule needs (total bonds = its size).
export function moleculeAtomCount(m: Molecule): number {
  return Object.values(m.formula).reduce((a, b) => a + b, 0)
}
