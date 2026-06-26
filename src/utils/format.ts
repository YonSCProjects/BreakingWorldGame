// Render a formula map as a subscripted chemical label, e.g. { H:2, O:1 } → "H₂O".
export function formulaLabel(formula: Record<string, number>): string {
  return Object.entries(formula)
    .map(([s, n]) => (n > 1 ? `${s}${toSub(n)}` : s))
    .join('')
}

function toSub(n: number): string {
  const subs = '₀₁₂₃₄₅₆₇₈₉'
  return String(n)
    .split('')
    .map((d) => subs[Number(d)])
    .join('')
}
