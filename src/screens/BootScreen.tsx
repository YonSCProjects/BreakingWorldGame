import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from '../store/session'
import Typewriter from '../components/Typewriter'
import { hapticLight, hapticMedium } from '../utils/haptics'

const COLD_OPEN = `האות מצא אתכם. הוא מוצא תמיד רק את הנכונים.

אני ראש המסדר. קראתי לכם לכאן כי אתם לא רגילים — כל אחד מכם נושא מתנה שחסרה לעולם.

אתם עדיין לא רואים את הכוח שלכם. המשימה הזאת תראה לכם ממה אתם עשויים.

ביחד אתם חוליה. אמרו לי את שמה — ונתחיל.`

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
          ▓▓▒▒░░ מופעל ░░▒▒▓▓
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
            <span className="mono text-[10px] tracking-[0.35em] text-signal/70">
              ◈ ראש המסדר
            </span>
            <span className="mono text-[10px] tracking-[0.2em] text-signal/40">לעיניכם בלבד</span>
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
                placeholder="תנו שם לחוליה"
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
                הקימו חוליה
              </button>
              <p className="mono text-center text-[10px] tracking-[0.2em] text-signal/30">
                מכשיר אחד · חוליה אחת · מדורה אחת
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
