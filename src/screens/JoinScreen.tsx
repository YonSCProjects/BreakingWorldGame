import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Role } from '../net/protocol'
import { useRoom } from '../net/roomClient'
import { useSession } from '../store/session'
import { hapticLight, hapticMedium } from '../utils/haptics'

// Both stations join by the same team name (which is also the cell's name).
export default function JoinScreen({ role, onBack }: { role: Role; onBack: () => void }) {
  const join = useRoom((s) => s.join)
  const setMode = useSession((s) => s.setMode)
  const goto = useSession((s) => s.goto)
  const [team, setTeam] = useState('')

  const isField = role === 'field'

  const connect = () => {
    const code = team.trim().toUpperCase()
    if (code.length < 2) return
    hapticMedium()
    if (isField) {
      setMode('field')
      goto('briefing')
      // the field device also names the cell when it joins
      join(code, 'field', code)
    } else {
      join(code, 'control')
    }
  }

  return (
    <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-7 px-7 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <span className="mono text-[10px] tracking-[0.35em] text-signal/60">
          ◈ {isField ? 'FIELD DEVICE' : 'CONTROL ROOM'}
        </span>
        <h1 className="mono text-xl uppercase tracking-[0.2em] text-signal text-glow">
          {isField ? 'Name your cell' : 'Tune to a cell'}
        </h1>
        <p className="mono mt-1 max-w-xs text-[11px] leading-relaxed text-[#bfefff]/60">
          {isField
            ? 'Choose a team name. Every device in your cell — field and control — uses this exact name to share one channel.'
            : 'Enter the exact team name the field device chose, to lock onto their channel.'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <input
          className="field-signal w-full px-4 py-4 text-base"
          placeholder="TEAM NAME"
          maxLength={18}
          value={team}
          onChange={(e) => setTeam(e.target.value.replace(/[^A-Za-z0-9_-]/g, ''))}
          onFocus={hapticLight}
          onKeyDown={(e) => e.key === 'Enter' && connect()}
          autoCapitalize="characters"
          autoCorrect="off"
        />
        <button className="btn-signal w-full text-sm" disabled={team.trim().length < 2} onClick={connect}>
          {isField ? 'Open the Channel' : 'Lock On'}
        </button>
        <button
          className="mono text-center text-[10px] tracking-[0.25em] text-signal/35 active:text-signal/70"
          onClick={onBack}
        >
          ‹ back
        </button>
      </motion.div>
    </div>
  )
}
