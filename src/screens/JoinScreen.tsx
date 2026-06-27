import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Role } from '../net/protocol'
import { useRoom } from '../net/roomClient'
import { useSession } from '../store/session'
import { TEAMS } from '../data/teams'
import { STAFF_MODE } from '../utils/staff'
import { hapticLight, hapticMedium } from '../utils/haptics'

// Both stations pick from the SAME fixed list of cells, so a field phone and its
// control room can never drift into different rooms. Staff get a custom field.
export default function JoinScreen({ role, onBack }: { role: Role; onBack: () => void }) {
  const join = useRoom((s) => s.join)
  const setMode = useSession((s) => s.setMode)
  const goto = useSession((s) => s.goto)
  const [custom, setCustom] = useState('')

  const isField = role === 'field'

  const connect = (name: string) => {
    const code = name.trim().toUpperCase()
    if (code.length < 2) return
    hapticMedium()
    if (isField) {
      setMode('field')
      goto('briefing')
      join(code, 'field', code) // the field device also names the cell
    } else {
      join(code, 'control')
    }
  }

  return (
    <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-6 px-7 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <span className="mono text-[10px] tracking-[0.35em] text-signal/60">
          ◈ {isField ? 'FIELD DEVICE' : 'CONTROL ROOM'}
        </span>
        <h1 className="mono text-xl uppercase tracking-[0.2em] text-signal text-glow">
          {isField ? 'Which cell are you?' : 'Tune to a cell'}
        </h1>
        <p className="mono mt-1 max-w-xs text-[11px] leading-relaxed text-[#bfefff]/60">
          {isField
            ? 'Tap the cell your team was given. Your control room taps the same one to share your channel.'
            : 'Tap the same cell your field team was given, to lock onto their channel.'}
        </p>
      </motion.div>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {TEAMS.map((t, i) => (
          <motion.button
            key={t.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
            onClick={() => connect(t.name)}
            className="hud-frame flex items-center justify-center gap-2 rounded-sm bg-void-800/50 py-4 active:bg-signal/5"
            style={{ borderColor: `${t.color}55` }}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color, boxShadow: `0 0 10px ${t.color}` }} />
            <span className="mono text-sm uppercase tracking-[0.2em]" style={{ color: t.color }}>
              {t.name}
            </span>
          </motion.button>
        ))}
      </div>

      {STAFF_MODE && (
        <div className="flex w-full max-w-sm items-center gap-2">
          <input
            className="field-signal flex-1 px-3 py-2 text-sm"
            placeholder="STAFF · CUSTOM CELL"
            maxLength={18}
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^A-Za-z0-9_-]/g, ''))}
            onFocus={hapticLight}
            onKeyDown={(e) => e.key === 'Enter' && connect(custom)}
            autoCapitalize="characters"
            autoCorrect="off"
          />
          <button className="btn-ghost text-xs" disabled={custom.trim().length < 2} onClick={() => connect(custom)}>
            Join
          </button>
        </div>
      )}

      <button
        className="mono text-[10px] tracking-[0.25em] text-signal/35 active:text-signal/70"
        onClick={onBack}
      >
        ‹ back
      </button>
    </div>
  )
}
