import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

type Props = {
  active: boolean
  onResult: (text: string) => void
}

// Wraps html5-qrcode's raw camera engine (not its built-in UI) so the viewport
// can wear the Lattice's chrome. Handles permission denial gracefully and
// debounces repeat reads of the same card while it sits in frame.
export default function Scanner({ active, onResult }: Props) {
  const elId = useRef(`scan-${Math.random().toString(36).slice(2)}`)
  const engineRef = useRef<Html5Qrcode | null>(null)
  const lastRef = useRef<{ text: string; at: number }>({ text: '', at: 0 })
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult

  const [status, setStatus] = useState<'idle' | 'starting' | 'live' | 'denied' | 'error'>(
    'idle',
  )

  useEffect(() => {
    if (!active) return
    let cancelled = false
    const engine = new Html5Qrcode(elId.current, { verbose: false })
    engineRef.current = engine
    setStatus('starting')

    const handle = (text: string) => {
      const now = Date.now()
      // Ignore the same payload re-decoded within 2.5s (it stays in frame).
      if (text === lastRef.current.text && now - lastRef.current.at < 2500) return
      lastRef.current = { text, at: now }
      onResultRef.current(text)
    }

    engine
      .start(
        { facingMode: 'environment' },
        {
          fps: 12,
          qrbox: (vw, vh) => {
            const m = Math.floor(Math.min(vw, vh) * 0.72)
            return { width: m, height: m }
          },
          aspectRatio: window.innerHeight / window.innerWidth,
        },
        handle,
        () => {
          /* per-frame decode misses are normal; ignore */
        },
      )
      .then(() => {
        if (!cancelled) setStatus('live')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const msg = String(err)
        setStatus(/permission|denied|NotAllowed/i.test(msg) ? 'denied' : 'error')
      })

    return () => {
      cancelled = true
      const e = engineRef.current
      if (e) {
        // stop() rejects if it never fully started; swallow either way.
        e.stop()
          .then(() => e.clear())
          .catch(() => {
            try {
              e.clear()
            } catch {
              /* noop */
            }
          })
      }
    }
  }, [active])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* html5-qrcode injects the <video> here */}
      <div id={elId.current} className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />

      {/* darken + dim the raw feed so the world reads as a "sensor", not a camera */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void-900/60 via-transparent to-void-900/85" />

      {(status === 'denied' || status === 'error') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="mono text-sm text-warn text-glow">
            {status === 'denied'
              ? 'החיישן עיוור.'
              : 'החיישן כושל.'}
          </p>
          <p className="mono text-xs leading-relaxed text-[#ffc2cd]/80">
            {status === 'denied'
              ? 'תנו למטריקס לראות — אשרו גישה למצלמה בדפדפן, ואז פתחו מחדש את השדה. (ראייה דורשת חיבור מאובטח: HTTPS או localhost.)'
              : 'לא ניתן לפתוח ערוץ אופטי במכשיר הזה.'}
          </p>
        </div>
      )}

      {status === 'starting' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="mono soft-pulse text-xs text-signal/80">פותח ערוץ אופטי…</p>
        </div>
      )}
    </div>
  )
}
