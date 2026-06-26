import { create } from 'zustand'
import type { ScanOutcome } from '../types'
import type { ClientMsg, Hint, Role, RoomState, ServerMsg } from './protocol'

// Where the team-room Worker lives. In local dev we point at `wrangler dev`;
// in production this is the deployed Worker's wss URL (set via VITE_ROOM_WS at
// build time once we've deployed to Cloudflare).
function wsBase(): string {
  const fromEnv = import.meta.env.VITE_ROOM_WS as string | undefined
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  const host = location.hostname
  if (host === 'localhost' || host === '127.0.0.1') return 'ws://127.0.0.1:8787'
  // Deployed team-room Worker (Cloudflare).
  return 'wss://lattice-rooms.yon-level.workers.dev'
}

export type RoomStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'

type RoomStore = {
  status: RoomStatus
  role: Role | null
  code: string | null
  state: RoomState | null
  // transient pings used to drive one-shot FX on whichever device cares
  lastScan: (ScanOutcome & { ts: number; cardId: string }) | null
  lastHint: Hint | null
  lastSealed: { moleculeId: string; ts: number } | null
  errorMsg: string | null

  join: (code: string, role: Role, name?: string) => void
  leave: () => void
  scan: (cardId: string) => void
  sendHint: (text: string) => void
  staffConfirm: () => void
  setName: (name: string) => void
  resetTeam: () => void
}

// ── module-level connection state (kept out of the store) ────────────────
let ws: WebSocket | null = null
let intentionalClose = false
let retry = 0
let retryTimer: number | undefined
let current: { code: string; role: Role; name?: string } | null = null

export const useRoom = create<RoomStore>((set) => {
  const send = (msg: ClientMsg) => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg))
  }

  const open = () => {
    if (!current) return
    const { code, role, name } = current
    const params = new URLSearchParams({ role })
    if (name) params.set('name', name)
    const url = `${wsBase()}/room/${encodeURIComponent(code)}/ws?${params.toString()}`

    set({ status: retry > 0 ? 'reconnecting' : 'connecting' })
    const sock = new WebSocket(url)
    ws = sock

    sock.onopen = () => {
      retry = 0
      set({ status: 'open', errorMsg: null })
    }

    sock.onmessage = (e) => {
      let msg: ServerMsg
      try {
        msg = JSON.parse(e.data)
      } catch {
        return
      }
      switch (msg.type) {
        case 'state':
          set({ state: msg.state })
          break
        case 'scanResult':
          set({ lastScan: { ...msg.outcome, ts: Date.now(), cardId: msg.cardId } })
          break
        case 'hint':
          set({ lastHint: msg.hint })
          break
        case 'sealed':
          set({ lastSealed: { moleculeId: msg.moleculeId, ts: Date.now() } })
          break
        case 'error':
          set({ errorMsg: msg.message })
          break
      }
    }

    sock.onclose = () => {
      if (intentionalClose) {
        set({ status: 'closed' })
        return
      }
      // auto-reconnect with capped backoff so a flaky venue WiFi self-heals
      set({ status: 'reconnecting' })
      retry += 1
      const delay = Math.min(1000 * 2 ** Math.min(retry, 4), 8000)
      window.clearTimeout(retryTimer)
      retryTimer = window.setTimeout(open, delay)
    }

    sock.onerror = () => {
      // onclose will follow and handle reconnection
    }
  }

  return {
    status: 'idle',
    role: null,
    code: null,
    state: null,
    lastScan: null,
    lastHint: null,
    lastSealed: null,
    errorMsg: null,

    join: (code, role, name) => {
      intentionalClose = false
      retry = 0
      current = { code: code.trim().toUpperCase(), role, name: name?.trim().toUpperCase() }
      set({ role, code: current.code, state: null })
      open()
    },

    leave: () => {
      intentionalClose = true
      window.clearTimeout(retryTimer)
      current = null
      try {
        ws?.close()
      } catch {
        /* noop */
      }
      ws = null
      set({ status: 'idle', role: null, code: null, state: null, lastScan: null, lastHint: null, lastSealed: null })
    },

    scan: (cardId) => send({ type: 'scan', cardId }),
    sendHint: (text) => send({ type: 'hint', text }),
    staffConfirm: () => send({ type: 'staffConfirm' }),
    setName: (name) => send({ type: 'setName', cellName: name }),
    resetTeam: () => send({ type: 'reset' }),
  }
})
