import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '../store/session'
import Typewriter from '../components/Typewriter'
import { hapticLight, hapticMedium } from '../utils/haptics'
import { audio } from '../audio/AudioEngine'
import { BOOT_COLD_OPEN } from '../audio/cues'

const COLD_OPEN = `If you are reading this, the channel held.

We are the LATTICE — what remains of the ones who keep matter bound. The world is coming apart at a scale below sight. Bonds are slipping. Water forgets to be water. We call it the UNBINDING.

This device is a window into that unraveling, and your hands are the last we have. You will go out into the real world, find the loose atoms before they dissolve, and teach them to hold together again.

First, tell us who you are. Every cell that still stands has a name.`

type Stage = 'dormant' | 'static' | 'lock' | 'transmit' | 'name'

export default function BootScreen() {
  const namecell = useSession((s) => s.namecell)
  const [stage, setStage] = useState<Stage>('dormant')
  const [woke, setWoke] = useState(false)
  const [name, setName] = useState('')

  // The power-on timeline only begins once the device has been WOKEN — the wake
  // tap is also the user gesture that unlocks audio (iOS blocks it otherwise).
  useEffect(() => {
    if (!woke) return
    const t1 = setTimeout(() => setStage('lock'), 1400)
    const t2 = setTimeout(() => {
      hapticMedium()
      setStage('transmit')
    }, 2900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [woke])

  // One tap: prime audio inside the gesture, let the Magister breathe, and start
  // the power-on sequence. unlock() resolves before we play so iOS lets it sound.
  const wakeDevice = async () => {
    hapticMedium()
    await audio.unlock()
    void audio.play(BOOT_COLD_OPEN)
    setStage('static')
    setWoke(true)
  }

  const engage = () => {
    hapticMedium()
    namecell(name)
  }

  return (
    <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-7 py-10">
      {/* dormant: a sleeping relic. The tap here wakes it AND unlocks audio. */}
      {stage === 'dormant' && (
        <motion.button
          type="button"
          onClick={wakeDevice}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center gap-7 outline-none"
          aria-label="Wake the device"
        >
          <motion.div
            animate={{ opacity: [0.25, 0.8, 0.25], scale: [0.95, 1, 0.95] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-28 w-28 items-center justify-center"
          >
            <span className="absolute inset-0 rounded-full border border-signal/40" />
            <span className="absolute inset-5 rounded-full bg-signal/10 blur-md" />
            <span className="text-3xl text-signal/80 text-glow">◈</span>
          </motion.div>
          <p className="mono max-w-[15rem] text-center text-[11px] leading-[2] tracking-[0.25em] text-signal/45">
            THE DEVICE SLEEPS
            <br />
            PRESS YOUR PALM TO THE SIGIL
          </p>
        </motion.button>
      )}

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
              ◈ LATTICE // INCOMING
            </span>
            <span className="mono text-[10px] tracking-[0.2em] text-signal/40">CH·001</span>
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
