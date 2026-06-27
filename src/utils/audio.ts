// Narration player for ראש-המסדר's voice clips in public/audio/*.mp3.
//
// • Clips are OPTIONAL — a missing file (e.g. Hour-2, which isn't recorded) just
//   fails silently, so the game never depends on audio.
// • Mobile browsers block audio until a user gesture; we unlock on the first tap
//   and, if a clip was requested before that, play it then (so the very first
//   briefing speaks the moment a kid taps).
// • A single shared <audio> element means a new clip naturally replaces the old.
// • Mute is persisted; the field phone gets a ◉/◌ toggle.

const BASE = import.meta.env.BASE_URL // '/BreakingWorldGame/' in prod, '/' in dev
const MUTE_KEY = 'lattice-muted'
// A 0-sample silent WAV — played inside the first gesture to "prime" iOS audio.
const SILENT =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

type Clip = { name: string; next?: string }

const el: HTMLAudioElement | null = typeof Audio !== 'undefined' ? new Audio() : null
let unlocked = false
let pending: Clip | null = null
let muted = false
try {
  muted = localStorage.getItem(MUTE_KEY) === '1'
} catch {
  /* ignore */
}

function start(c: Clip) {
  if (!el || muted) return
  try {
    el.onended = null
    el.src = `${BASE}audio/${c.name}.mp3`
    el.currentTime = 0
    if (c.next) {
      const nx = c.next
      el.onended = () => {
        if (el) el.onended = null
        start({ name: nx })
      }
    }
    void el.play().catch(() => {
      /* blocked or file missing — ignore */
    })
  } catch {
    /* ignore */
  }
}

// Play a narration clip by base name, e.g. playNarration('m1-hydrogen-briefing').
// Pass `next` to chain a second clip after this one finishes (briefing → clue).
export function playNarration(name: string, next?: string) {
  if (!el || muted) return
  const clip: Clip = { name, next }
  if (!unlocked) {
    pending = clip
    return
  }
  start(clip)
}

export function stopNarration() {
  pending = null
  if (el) {
    try {
      el.pause()
    } catch {
      /* ignore */
    }
  }
}

export function isMuted(): boolean {
  return muted
}

export function setMuted(next: boolean): void {
  muted = next
  try {
    localStorage.setItem(MUTE_KEY, next ? '1' : '0')
  } catch {
    /* ignore */
  }
  if (next) stopNarration()
}

// Unlock audio on the first user gesture (mobile autoplay policy). Call once at
// app start. If a clip was queued while locked, it plays now.
export function armAudio(): void {
  if (!el || unlocked) return
  const onGesture = () => {
    if (unlocked) return
    unlocked = true
    window.removeEventListener('pointerdown', onGesture)
    window.removeEventListener('touchend', onGesture)
    window.removeEventListener('keydown', onGesture)
    const queued = pending
    pending = null
    if (queued && !muted) {
      start(queued)
    } else if (el && !muted) {
      // prime so later programmatic plays are allowed
      try {
        el.src = SILENT
        void el.play().then(() => el?.pause()).catch(() => {})
      } catch {
        /* ignore */
      }
    }
  }
  window.addEventListener('pointerdown', onGesture)
  window.addEventListener('touchend', onGesture)
  window.addEventListener('keydown', onGesture)
}
