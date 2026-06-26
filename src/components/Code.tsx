import type { ReactNode } from 'react'

// Isolate a Latin / numeric / formula run inside RTL Hebrew so it keeps its own
// left-to-right order (a slash, a "+", a subscript won't jump sides). By default
// it also gets the monospace "transmission" look; pass `plain` to keep the Hebrew
// font and only bidi-isolate (e.g. a user-typed cell name).
export default function Code({
  children,
  plain = false,
  className = '',
}: {
  children: ReactNode
  plain?: boolean
  className?: string
}) {
  const cls = [plain ? '' : 'code', className].filter(Boolean).join(' ')
  return <bdi className={cls || undefined}>{children}</bdi>
}
