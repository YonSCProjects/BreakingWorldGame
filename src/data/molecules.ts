import type { Molecule } from '../types'

// Everything the cell can stabilize. The Codex is built from this.
// Voice/flavor stays short and warm — this is for kids. ALL builds are Hour-1
// (act 1) now; GLUCOSE is the giant bonus build for teams that finish early.
// Atoms are "יחידות חומר" (feminine) in-world. New (oxygen/CO₂/glucose) prose is
// English until translated to Hebrew.
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
    act: 1,
    centerSymbol: 'O',
    codexEntry:
      'שתי יחידות חומר אדומות, צמודות זו לזו חזק. זהו גז החמצן שבכל נשימה — האוויר ששומר על כל בעל חיים בחיים.',
  },
  carbon_dioxide: {
    id: 'carbon_dioxide',
    displayName: 'פחמן דו-חמצני',
    formula: { C: 1, O: 2 },
    act: 1,
    centerSymbol: 'C',
    codexEntry:
      'יחידת חומר אפורה אחת בין שתי אדומות, בקו ישר. הגז שאתם נושפים החוצה בכל נשימה — והגז שהצמחים רעבים ללגום פנימה.',
  },
  glucose: {
    id: 'glucose',
    displayName: 'גלוקוז',
    formula: { C: 6, H: 12, O: 6 },
    act: 1,
    centerSymbol: 'C',
    codexEntry:
      'שש יחידות חומר אפורות, שתים עשרה לבנות ושש אדומות — עשרים וארבע יחידות חומר בטבעת אחת. גלוקוז הוא סוכר: הדלק שמפעיל כל יצור חי, מעלה דשא ועד אליכם.',
  },
}

export const ALL_MOLECULE_IDS = Object.keys(MOLECULES)

// Count how many atoms of each element a molecule needs (total bonds = its size).
export function moleculeAtomCount(m: Molecule): number {
  return Object.values(m.formula).reduce((a, b) => a + b, 0)
}
