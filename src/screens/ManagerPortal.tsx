import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TEAMS, teamByName } from '../data/teams'

// Staff-only (?manage). Two jobs:
//  1) Roster: load the recorded name clips, then place each knight in an Order
//     and mark the one Seer (control) per team.
//  2) Ceremony: a full-screen view for the big TV — press "Call the next Knight",
//     their recording plays and their crest + Order appear.
// All client-side; the roster is saved to localStorage. Audio clips are loaded
// each session (object URLs can't persist).

type Role = 'field' | 'control'
type Knight = { name: string; team: string | null; role: Role }

const STORE_KEY = 'lattice-ceremony-roster'

function loadRoster(): Knight[] {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as Knight[]) : []
  } catch {
    return []
  }
}

export default function ManagerPortal({ onExit }: { onExit: () => void }) {
  const [voices, setVoices] = useState<Record<string, string>>({})
  const [roster, setRoster] = useState<Knight[]>(loadRoster)
  const [manual, setManual] = useState('')
  const [ceremony, setCeremony] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(roster))
  }, [roster])

  const fileToName = (f: File) => f.name.replace(/\.[^.]+$/, '').trim()

  const onLoadVoices = (files: FileList | null) => {
    if (!files) return
    const next: Record<string, string> = { ...voices }
    const additions: Knight[] = []
    for (const f of Array.from(files)) {
      const name = fileToName(f)
      if (!name) continue
      next[name] = URL.createObjectURL(f)
      if (!roster.some((k) => k.name === name)) additions.push({ name, team: null, role: 'field' })
    }
    setVoices(next)
    if (additions.length) setRoster((r) => [...r, ...additions])
  }

  const addManual = () => {
    const name = manual.trim()
    if (!name || roster.some((k) => k.name === name)) return setManual('')
    setRoster((r) => [...r, { name, team: null, role: 'field' }])
    setManual('')
  }

  const setTeam = (name: string, team: string) =>
    setRoster((r) => r.map((k) => (k.name === name ? { ...k, team: k.team === team ? null : team } : k)))
  const toggleSeer = (name: string) =>
    setRoster((r) => r.map((k) => (k.name === name ? { ...k, role: k.role === 'control' ? 'field' : 'control' } : k)))
  const remove = (name: string) => setRoster((r) => r.filter((k) => k.name !== name))

  const placed = roster.filter((k) => k.team)
  const counts = useMemo(() => {
    const c: Record<string, { field: number; seer: number }> = {}
    for (const t of TEAMS) c[t.name] = { field: 0, seer: 0 }
    for (const k of placed) if (k.team && c[k.team]) k.role === 'control' ? c[k.team].seer++ : c[k.team].field++
    return c
  }, [placed])

  return (
    <div className="relative z-10 mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-5 py-6">
      <header className="flex items-center justify-between border-b border-signal/20 pb-3">
        <span className="mono text-sm uppercase tracking-[0.3em] text-signal text-glow">◈ THE MAGISTER · CEREMONY</span>
        <button className="mono text-[10px] tracking-[0.25em] text-signal/35 active:text-signal/70" onClick={onExit}>
          ▸ exit
        </button>
      </header>

      {/* 1 · recordings */}
      <section className="hud-frame rounded-sm bg-void-900/40 p-4">
        <p className="mono mb-2 text-[10px] tracking-[0.3em] text-signal/55">1 · LOAD THE NAME RECORDINGS</p>
        <p className="mono mb-3 text-[11px] leading-relaxed text-[#bfefff]/60">
          Select the Magister’s name clips (one <span className="text-signal">name.mp3</span> per student). Each
          becomes a knight below.
        </p>
        <label className="btn-ghost inline-block cursor-pointer text-xs">
          Load recordings…
          <input type="file" accept="audio/*" multiple className="hidden" onChange={(e) => onLoadVoices(e.target.files)} />
        </label>
        <span className="mono ml-3 text-[11px] text-signal/60">{Object.keys(voices).length} loaded</span>
      </section>

      {/* 2 · place knights */}
      <section className="hud-frame rounded-sm bg-void-900/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="mono text-[10px] tracking-[0.3em] text-signal/55">2 · PLACE EACH KNIGHT</p>
          <span className="mono text-[10px] text-signal/50">{placed.length}/{roster.length} placed</span>
        </div>

        <div className="mb-3 flex gap-2">
          <input
            className="field-signal flex-1 px-3 py-2 text-left text-xs"
            style={{ textAlign: 'left', textTransform: 'none', letterSpacing: 'normal' }}
            placeholder="Add a name by hand (if no recording)…"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addManual()}
          />
          <button className="btn-ghost text-xs" onClick={addManual}>
            Add
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {roster.length === 0 && (
            <p className="mono text-[11px] tracking-[0.2em] text-signal/30">— no knights yet —</p>
          )}
          {roster.map((k) => (
            <div key={k.name} className="flex flex-wrap items-center gap-2 rounded-sm border border-signal/10 bg-void-800/40 px-2 py-1.5">
              <span className="mono min-w-[7rem] flex-1 text-[13px] text-[#eaf6ff]">
                {k.name}
                <span className="ml-1.5 text-[10px]" style={{ color: voices[k.name] ? '#7dffae' : '#ff8a8a' }}>
                  {voices[k.name] ? '♪' : 'no clip'}
                </span>
              </span>
              {TEAMS.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTeam(k.name, t.name)}
                  title={t.name}
                  className="rounded-sm border px-2 py-1 text-base leading-none"
                  style={{
                    borderColor: k.team === t.name ? t.color : 'rgba(255,255,255,0.12)',
                    background: k.team === t.name ? `${t.color}22` : 'transparent',
                    opacity: k.team === t.name ? 1 : 0.5,
                  }}
                >
                  {t.emoji}
                </button>
              ))}
              <button
                onClick={() => toggleSeer(k.name)}
                className="mono rounded-sm border px-2 py-1 text-[10px] tracking-[0.1em]"
                style={{
                  borderColor: k.role === 'control' ? '#8b7bff' : 'rgba(255,255,255,0.12)',
                  color: k.role === 'control' ? '#c9beff' : 'rgba(255,255,255,0.4)',
                }}
              >
                SEER
              </button>
              <button onClick={() => remove(k.name)} className="mono px-1 text-[12px] text-warn/60 active:text-warn">
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* counts + start */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {TEAMS.map((t) => (
            <span key={t.name} className="mono text-[11px] tracking-[0.1em]" style={{ color: t.color }}>
              {t.emoji} {t.name} · {counts[t.name].field + counts[t.name].seer}
              {counts[t.name].seer ? ' (Seer ✓)' : ' (no Seer)'}
            </span>
          ))}
        </div>
        <button className="btn-signal text-sm disabled:opacity-40" disabled={placed.length === 0} onClick={() => setCeremony(true)}>
          ⟡ Begin the Ceremony
        </button>
      </section>

      <p className="mono text-[10px] leading-relaxed text-signal/30">
        BADGES: print the join QRs with <span className="text-signal/60">npm run badges</span> → one per Order × role.
        A badge QR drops a phone straight into its Order. Clear the roster only when you’re done:
        <button className="ml-2 text-warn/50 active:text-warn" onClick={() => confirm('Clear the whole roster?') && setRoster([])}>
          clear roster
        </button>
      </p>

      <AnimatePresence>
        {ceremony && <Ceremony roster={placed} voices={voices} onClose={() => setCeremony(false)} />}
      </AnimatePresence>
    </div>
  )
}

// ── The full-screen initiation, for the big TV ──────────────────────────
function Ceremony({ roster, voices, onClose }: { roster: Knight[]; voices: Record<string, string>; onClose: () => void }) {
  const [i, setI] = useState(-1) // -1 = title card, roster.length = finished
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const callNext = () => {
    const next = i + 1
    setI(next)
    const k = roster[next]
    if (k && voices[k.name]) {
      audioRef.current?.pause()
      const a = new Audio(voices[k.name])
      audioRef.current = a
      a.play().catch(() => {})
    }
  }

  const current = i >= 0 && i < roster.length ? roster[i] : null
  const team = current ? teamByName(current.team) : undefined
  const done = i >= roster.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black px-8 text-center"
    >
      <div className="void-bg" />
      <button onClick={onClose} className="mono absolute right-5 top-5 z-10 text-[10px] tracking-[0.25em] text-signal/30 active:text-signal/70">
        ▸ close
      </button>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6">
        {i === -1 && (
          <>
            <p className="mono text-sm tracking-[0.5em] text-signal/70">THE INITIATION</p>
            <p className="mono max-w-lg text-[13px] leading-relaxed text-[#bfefff]/70">
              When you are ready, call the chosen — one by one — and let their Order claim them.
            </p>
          </>
        )}

        <AnimatePresence mode="wait">
          {current && team && (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-[120px] leading-none" style={{ filter: `drop-shadow(0 0 40px ${team.color})` }}>
                {team.emoji}
              </span>
              <span className="text-4xl font-bold tracking-wide text-[#f3fbff]" style={{ textShadow: `0 0 24px ${team.color}` }}>
                {current.name}
              </span>
              <span className="mono text-base uppercase tracking-[0.25em]" style={{ color: team.color }}>
                {current.role === 'control' ? 'Seer' : 'Knight'} of the Order of the {team.name}
              </span>
              <span className="mono text-[11px] tracking-[0.2em] text-[#bfefff]/40">guardian of {team.guards}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {done && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
            <p className="mono text-2xl uppercase tracking-[0.2em] text-signal text-glow">The Order is whole</p>
            <p className="mono text-sm text-[#bfefff]/70">{roster.length} knights have risen. Rise — and bring the world back to life.</p>
          </motion.div>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 pb-10">
        {!done ? (
          <button onClick={callNext} className="btn-signal soft-pulse px-8 text-base">
            {i === -1 ? '⟡ Begin the Initiation' : '⟡ Call the next Knight'}
          </button>
        ) : (
          <button onClick={onClose} className="btn-ghost text-sm">
            Close
          </button>
        )}
        {i >= 0 && !done && (
          <span className="mono text-[11px] tracking-[0.3em] text-signal/40">
            {i + 1} / {roster.length}
          </span>
        )}
      </div>
    </motion.div>
  )
}
