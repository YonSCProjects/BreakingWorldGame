// ── The Magister's breath ───────────────────────────────────────────────
// A tiny imperative audio engine. It is a SINGLETON MODULE, not a Zustand
// store, on purpose: it holds non-serializable Web Audio handles (AudioContext,
// buffers, nodes) that must never touch `persist`. Like haptics.ts, the voice
// is progressive enhancement — every method degrades to a silent no-op rather
// than throwing into the game loop. Text on screen stays the load-bearing
// channel; this only ever adds to it.

// While the real recordings don't exist yet, a missing file plays a short
// synthesized motif chosen by the cue's `placeholder` profile — so each kind of
// moment (accept, the noble sting, a reveal) sounds distinct during testing.
export type PlaceholderProfile =
  | 'wake'
  | 'accept'
  | 'ready'
  | 'reject'
  | 'dud'
  | 'noble'
  | 'reveal'
  | 'briefing'
  | 'neutral'

export type Cue = {
  id: string
  src: string
  gain?: number // 0..1 relative level for this cue (default 1)
  placeholder?: PlaceholderProfile // tone played until a real recording exists
}

type Motif = {
  wave: OscillatorType
  peak: number
  notes: { f: number; t: number; d: number }[] // freq, start offset, duration (s)
}

// Mid-range fundamentals so small phone speakers actually reproduce them.
const PLACEHOLDERS: Record<PlaceholderProfile, Motif> = {
  wake: { wave: 'triangle', peak: 0.32, notes: [{ f: 392, t: 0, d: 0.5 }, { f: 587, t: 0.16, d: 0.5 }] },
  accept: { wave: 'triangle', peak: 0.3, notes: [{ f: 659, t: 0, d: 0.22 }] },
  ready: {
    wave: 'triangle',
    peak: 0.3,
    notes: [{ f: 523, t: 0, d: 0.5 }, { f: 659, t: 0.12, d: 0.5 }, { f: 784, t: 0.24, d: 0.55 }],
  },
  reject: { wave: 'sawtooth', peak: 0.22, notes: [{ f: 392, t: 0, d: 0.16 }, { f: 262, t: 0.13, d: 0.26 }] },
  dud: { wave: 'square', peak: 0.13, notes: [{ f: 330, t: 0, d: 0.08 }, { f: 330, t: 0.13, d: 0.08 }] },
  noble: { wave: 'sawtooth', peak: 0.17, notes: [{ f: 233, t: 0, d: 1.0 }, { f: 330, t: 0, d: 1.0 }] },
  reveal: {
    wave: 'triangle',
    peak: 0.28,
    notes: [{ f: 523, t: 0, d: 0.9 }, { f: 659, t: 0.18, d: 0.9 }, { f: 1046, t: 0.36, d: 1.0 }],
  },
  briefing: { wave: 'sine', peak: 0.24, notes: [{ f: 349, t: 0, d: 0.8 }] },
  neutral: { wave: 'triangle', peak: 0.26, notes: [{ f: 440, t: 0, d: 0.3 }] },
}

type WindowWithWebkit = Window & {
  webkitAudioContext?: typeof AudioContext
}

class MagisterAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private buffers = new Map<string, AudioBuffer>()
  private voice: AudioBufferSourceNode | null = null
  private placeholders: OscillatorNode[] = []
  private muted = false
  private unlocked = false
  private resumeBound = false

  /** True once a user gesture has primed audio and it is safe to play. */
  get ready(): boolean {
    return this.unlocked && !!this.ctx
  }

  // Must be called from a real user gesture (a tap). On iOS Safari nothing will
  // sound until this runs: it creates/resumes the context and primes it with a
  // single silent frame. Safe to call more than once.
  async unlock(): Promise<void> {
    try {
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext
        if (!Ctor) return // unsupported browser — stay silent, never throw
        this.ctx = new Ctor()
        this.master = this.ctx.createGain()
        this.master.gain.value = this.muted ? 0 : 1
        this.master.connect(this.ctx.destination)
      }
      if (this.ctx.state === 'suspended') await this.ctx.resume()

      // The iOS unlock trick: play one silent sample inside the gesture.
      const silent = this.ctx.createBufferSource()
      silent.buffer = this.ctx.createBuffer(1, 1, 22050)
      silent.connect(this.master!)
      silent.start(0)

      this.unlocked = true
      this.bindResume()
    } catch {
      // Never let audio break the boot flow.
    }
  }

  // A PWA in standalone mode suspends its AudioContext when backgrounded; wake
  // it again when the device returns to the foreground.
  private bindResume(): void {
    if (this.resumeBound || typeof document === 'undefined') return
    this.resumeBound = true
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.ctx?.state === 'suspended') {
        void this.ctx.resume()
      }
    })
  }

  setMuted(m: boolean): void {
    this.muted = m
    if (this.master) this.master.gain.value = m ? 0 : 1
  }

  isMuted(): boolean {
    return this.muted
  }

  // Fetch + decode a cue ahead of time so playback is instant.
  async preload(cue: Cue): Promise<void> {
    if (!this.ctx) return
    try {
      await this.load(cue.src)
    } catch {
      // A missing file is fine — play() falls back to a placeholder motif.
    }
  }

  // Play a voice cue. Interrupts any line already speaking. Returns the clip's
  // duration so callers (e.g. the Typewriter) can pace a caption to the voice.
  async play(cue: Cue): Promise<{ durationMs: number }> {
    if (this.muted || !this.ready || !this.ctx || !this.master) {
      return { durationMs: 0 }
    }
    this.stopVoice()
    try {
      const buffer = await this.load(cue.src)
      const src = this.ctx.createBufferSource()
      src.buffer = buffer
      const trim = this.route(cue, src)
      src.start(0)
      this.voice = src
      src.onended = () => {
        if (this.voice === src) this.voice = null
        trim?.disconnect()
      }
      return { durationMs: Math.round(buffer.duration * 1000) }
    } catch {
      // No recording yet (Phase 2) or a decode error — synthesize a profile
      // motif so the right cue is still audibly distinguishable end to end.
      return { durationMs: this.synthPlaceholder(cue.placeholder) }
    }
  }

  stopVoice(): void {
    safeStop(this.voice)
    this.voice = null
    for (const osc of this.placeholders) safeStop(osc)
    this.placeholders = []
  }

  // ── internals ──────────────────────────────────────────────────────────

  // Connect a source to the master bus, inserting a per-cue gain node only when
  // the cue asks for a non-unity level. Returns that node (to disconnect on end)
  // or null when wired straight to master — so we never disconnect master itself.
  private route(cue: Cue, src: AudioBufferSourceNode): GainNode | null {
    if (cue.gain == null || cue.gain === 1) {
      src.connect(this.master!)
      return null
    }
    const g = this.ctx!.createGain()
    g.gain.value = cue.gain
    src.connect(g)
    g.connect(this.master!)
    return g
  }

  private async load(src: string): Promise<AudioBuffer> {
    const cached = this.buffers.get(src)
    if (cached) return cached
    const res = await fetch(src)
    if (!res.ok) throw new Error(`audio ${res.status}: ${src}`)
    const data = await res.arrayBuffer()
    const buffer = await this.ctx!.decodeAudioData(data)
    this.buffers.set(src, buffer)
    return buffer
  }

  // Proof-of-life when no recorded line exists yet. Swap a real file into
  // public/vo/ and this path is never taken.
  private synthPlaceholder(profile: PlaceholderProfile = 'neutral'): number {
    if (!this.ctx || !this.master) return 0
    const ctx = this.ctx
    const now = ctx.currentTime
    const motif = PLACEHOLDERS[profile]
    let end = 0
    for (const n of motif.notes) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = motif.wave
      osc.frequency.setValueAtTime(n.f, now + n.t)
      g.gain.setValueAtTime(0.0001, now + n.t)
      g.gain.exponentialRampToValueAtTime(motif.peak, now + n.t + 0.04)
      g.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d)
      osc.connect(g)
      g.connect(this.master)
      osc.start(now + n.t)
      osc.stop(now + n.t + n.d)
      osc.onended = () => {
        g.disconnect()
        this.placeholders = this.placeholders.filter((x) => x !== osc)
      }
      this.placeholders.push(osc)
      end = Math.max(end, n.t + n.d)
    }
    return Math.round(end * 1000)
  }
}

function safeStop(node: AudioScheduledSourceNode | null): void {
  if (!node) return
  try {
    node.stop()
  } catch {
    // already stopped — fine
  }
}

// The one Magister for the whole app.
export const audio = new MagisterAudio()
