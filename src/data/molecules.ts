import type { Molecule } from '../types'

// Everything the cell can stabilize. The Codex is built from this.
// Voice/flavor stays short and warm — this is for kids. Hour-1 molecules are in
// Hebrew; Hour-2 (oxygen/CO₂) codex prose stays English until the v2 rewrite.
// Atoms are "יחידות חומר" (feminine) in-world.
export const MOLECULES: Record<string, Molecule> = {
  hydrogen_gas: {
    id: 'hydrogen_gas',
    displayName: 'גז מימן',
    formula: { H: 2 },
    act: 1,
    centerSymbol: 'H',
    codexEntry:
      'שתי יחידות חומר לבנות קטנטנות שמחזיקות ידיים. המימן הוא הדבר הראשון שהיקום אי-פעם יצר — וגם הדבר הראשון שאתם יצרתם.',
  },
  salt: {
    id: 'salt',
    displayName: 'מלח',
    formula: { Na: 1, Cl: 1 },
    act: 1,
    centerSymbol: 'Na',
    codexEntry:
      'יחידת חומר סגולה פראית ויחידת חומר ירוקה חדה, שנצמדו יחד. כל אחת לבד היא צרה — ביחד הן המלח שעל הצ׳יפס.',
  },
  water: {
    id: 'water',
    displayName: 'מים',
    formula: { H: 2, O: 1 },
    act: 1,
    centerSymbol: 'O',
    codexEntry:
      'שתיים לבנות, אחת אדומה. המים הם הדבר הכי חשוב לחיים — כל צמח, כל חיה, וכל אחד מכם עשוי בעיקר מהם.',
  },
  ammonia: {
    id: 'ammonia',
    displayName: 'אמוניה',
    formula: { N: 1, H: 3 },
    act: 1,
    centerSymbol: 'N',
    codexEntry:
      'יחידת חומר כחולה רגועה אחת שמחזיקה שלוש לבנות. כבר הרחתם את זה פעם — העקיצה החריפה בתרסיס ניקוי.',
  },
  methane: {
    id: 'methane',
    displayName: 'מתאן',
    formula: { C: 1, H: 4 },
    act: 1,
    centerSymbol: 'C',
    codexEntry:
      'יחידת חומר אפורה אחת שאוחזת בארבע לבנות. המתאן הוא הגז שמדליק אש.',
  },
  oxygen_gas: {
    id: 'oxygen_gas',
    displayName: 'גז חמצן',
    formula: { O: 2 },
    act: 2,
    centerSymbol: 'O',
    codexEntry:
      'Two red sparks bound tight. Your cells burn food with this to make the energy to move — and plants make it fresh for you.',
  },
  carbon_dioxide: {
    id: 'carbon_dioxide',
    displayName: 'פחמן דו-חמצני',
    formula: { C: 1, O: 2 },
    act: 2,
    centerSymbol: 'C',
    codexEntry:
      'One grey, two red, in a straight line. The leftover when your cells make energy — and exactly what plants are hungry to drink in.',
  },
}

export const ALL_MOLECULE_IDS = Object.keys(MOLECULES)

// Count how many atoms of each element a molecule needs (total bonds = its size).
export function moleculeAtomCount(m: Molecule): number {
  return Object.values(m.formula).reduce((a, b) => a + b, 0)
}
