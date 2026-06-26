import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '../store/session'
import Typewriter from '../components/Typewriter'
import Code from '../components/Code'
import { hapticLight, hapticMedium } from '../utils/haptics'
import { audio } from '../audio/AudioEngine'
import { BOOT_COLD_OPEN } from '../audio/cues'

// First-draft Hebrew (Yon to polish). Keep the blank-line paragraph breaks and
// the "—" em-dashes: the Typewriter paces its pauses on "." "—" "?".
const COLD_OPEN = `אם אתם קוראים את זה — הערוץ החזיק.

אנחנו הסריג — מה שנותר מאלה ששומרים על קשר החומר. העולם מתפרק בקנה מידה שמתחת לסף הראייה. הקשרים נשמטים. מים שוכחים להיות מים. אנחנו קוראים לזה — ההתרה.

המכשיר הזה הוא חלון אל ההתפרקות, וידיכם הן האחרונות שנותרו לנו. צאו אל העולם הממשי, מצאו את האטומים המשוחררים בטרם יתמוססו, ולמדו אותם לאחוז זה בזה מחדש.

ראשית, ספרו לנו מי אתם. לכל תא שעודנו ניצב — יש שם.`

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
          aria-label="העירו את המכשיר"
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
          <p className="mono max-w-[15rem] text-center text-[12px] leading-[2] tracking-[0.25em] text-signal/45">
            המכשיר רדום
            <br />
            הניחו כף יד על החותם
          </p>
        </motion.button>
      )}

      {/* power-on static flash — keep the bar framing LTR, only the word is Hebrew */}
      {stage === 'static' && (
        <motion.div
          dir="ltr"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.2, 1, 0.4, 1] }}
          transition={{ duration: 1.3, times: [0, 0.2, 0.35, 0.5, 0.7, 1] }}
          className="mono text-center text-xs tracking-[0.3em] text-signal/70"
        >
          ▓▓▒▒░░ מתאתחל ░░▒▒▓▓
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
          <p className="mono soft-pulse text-sm tracking-[0.3em] text-signal text-glow">
            נעילת אות
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
            <span className="mono text-[11px] tracking-[0.2em] text-signal/70">
              ◈ הסריג · שידור נכנס
            </span>
            <span className="mono text-[11px] tracking-[0.2em] text-signal/40">
              <Code>CH·001</Code>
            </span>
          </header>

          <Typewriter
            text={COLD_OPEN}
            speed={16}
            className="mono whitespace-pre-wrap text-[15px] leading-relaxed text-[#bfefff]/90"
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
                placeholder="שם הַתָּא"
                maxLength={18}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={hapticLight}
              />
              <button
                className="btn-signal w-full text-sm"
                disabled={name.trim().length < 2}
                onClick={engage}
              >
                הקימו את התא
              </button>
              <p className="mono text-center text-[11px] tracking-[0.2em] text-signal/30">
                מכשיר אחד · תא אחד · מדורה אחת
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
