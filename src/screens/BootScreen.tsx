import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '../store/session'
import Typewriter from '../components/Typewriter'
import { hapticLight, hapticMedium } from '../utils/haptics'

const COLD_OPEN = `The signal found you. It only ever finds the right ones.

I am the Magister. I called you here because you are not ordinary — each of you carries a gift the world has been missing.

You can’t see your power yet. This mission will show you what you’re made of.

Together you are a CELL. Tell me its name — and we begin.`

type Stage = 'static' | 'lock' | 'transmit' | 'name'

export default function BootScreen() {
  const namecell = useSession((s) => s.namecell)
  const [stage, setStage] = useState<Stage>('static')
  const [name, setName] = useState('')

  useEffect(() => {
    const t1 = setTimeout(() => setStage('lock'), 1400)
    const t2 = setTimeout(() => {
      hapticMedium()
      setStage('transmit')
    }, 2900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const engage = () => {
    hapticMedium()
    namecell(name)
  }

  return (
    <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-7 py-10">
      {/* power-on static flash */}
      {stage === 'static' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.2, 1, 0.4, 1] }}
          transition={{ duration: 1.3, times: [0, 0.2, 0.35, 0.5, 0.7, 1] }}
          className="mono text-center text-xs tracking-[0.3em] text-signal/70"
        >
          ▓▓▒▒░░ POWERING ON ░░▒▒▓▓
        </motion.div>
      )}

      {stage === 'lock' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="relative h-16 w-16">
            <span className="absolute inset-0 rounded-full border border-signal/60" />
            <span className="absolute inset-0 animate-pulse-ring rounded-full border border-signal/60" />
            <span className="absolute inset-3 rounded-full bg-signal/20 blur-md" />
          </div>
          <p className="mono soft-pulse text-xs tracking-[0.3em] text-signal text-glow">
            SIGNAL LOCK
          </p>
        </motion.div>
      )}

      {(stage === 'transmit' || stage === 'name') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex w-full max-w-md flex-col gap-6"
        >
          <header className="flex items-center justify-between border-b border-signal/20 pb-2">
            <span className="mono text-[10px] tracking-[0.35em] text-signal/70">
              ◈ THE MAGISTER
            </span>
            <span className="mono text-[10px] tracking-[0.2em] text-signal/40">FOR YOUR EYES</span>
          </header>

          <Typewriter
            text={COLD_OPEN}
            speed={16}
            className="mono whitespace-pre-wrap text-[13px] leading-relaxed text-[#bfefff]/90"
            onDone={() => setStage('name')}
          />

          {stage === 'name' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <input
                className="field-signal w-full px-4 py-4 text-base"
                placeholder="NAME YOUR CELL"
                maxLength={18}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={hapticLight}
                autoCapitalize="characters"
              />
              <button
                className="btn-signal w-full text-sm"
                disabled={name.trim().length < 2}
                onClick={engage}
              >
                Establish Cell
              </button>
              <p className="mono text-center text-[10px] tracking-[0.2em] text-signal/30">
                ONE DEVICE · ONE CELL · ONE CAMPFIRE
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
