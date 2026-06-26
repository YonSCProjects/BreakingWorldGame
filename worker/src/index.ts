// The Lattice — real-time team rooms.
// One Durable Object instance per team (keyed by join code). The field phone
// and the control PC both open a WebSocket to the same room; the server owns
// the authoritative game state, verifies scans, and broadcasts to everyone.
import { DurableObject } from 'cloudflare:workers'
import { MISSIONS } from '../../src/data/missions'
import { MOLECULES } from '../../src/data/molecules'
import { evaluateScan, isFormulaComplete } from '../../src/store/verify'
import {
  freshRoomState,
  type ClientMsg,
  type Hint,
  type Role,
  type RoomState,
  type ServerMsg,
} from '../../src/net/protocol'

export interface Env {
  TEAM_ROOM: DurableObjectNamespace<TeamRoom>
}

type SockMeta = { role: Role; joinedAt: number }

export class TeamRoom extends DurableObject<Env> {
  private state: RoomState

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    this.state = freshRoomState()
    // Rehydrate persisted state once, before any request is served.
    ctx.blockConcurrencyWhile(async () => {
      const saved = await ctx.storage.get<RoomState>('state')
      if (saved) this.state = { ...freshRoomState(), ...saved }
    })
  }

  // The Worker proxies the WebSocket Upgrade here.
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('expected websocket', { status: 426 })
    }
    const url = new URL(request.url)
    const role: Role = url.searchParams.get('role') === 'control' ? 'control' : 'field'
    const name = url.searchParams.get('name')?.trim().toUpperCase().slice(0, 18)

    const pair = new WebSocketPair()
    const [client, server] = Object.values(pair)

    // Hibernatable accept (survives the DO sleeping between messages).
    this.ctx.acceptWebSocket(server, [role])
    server.serializeAttachment({ role, joinedAt: Date.now() } satisfies SockMeta)

    // First field device to name the cell sets it (if not already named).
    if (name && !this.state.cellName) {
      this.state.cellName = name
      await this.persist()
    }

    this.refreshPresence()
    // Send this client the current snapshot immediately, and let others know
    // presence changed.
    server.send(this.encode({ type: 'state', state: this.snapshot() }))
    this.broadcastState(server)

    return new Response(null, { status: 101, webSocket: client })
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer): Promise<void> {
    let msg: ClientMsg
    try {
      msg = JSON.parse(typeof raw === 'string' ? raw : new TextDecoder().decode(raw))
    } catch {
      return
    }
    const meta = ws.deserializeAttachment() as SockMeta | null
    const role: Role = meta?.role ?? 'field'

    switch (msg.type) {
      case 'setName': {
        const n = msg.cellName.trim().toUpperCase().slice(0, 18)
        if (n) {
          this.state.cellName = n
          await this.persist()
          this.broadcastState()
        }
        break
      }

      case 'scan': {
        const mission = MISSIONS[this.state.currentMissionIndex]
        if (!mission) break
        const target = MOLECULES[mission.targetMoleculeId]
        const outcome = evaluateScan(
          msg.cardId,
          this.state.claimedCardIds,
          this.state.tray,
          target,
        )
        if (outcome.kind === 'accepted') {
          this.state.tray.push({ cardId: outcome.cardId, element: outcome.element })
          this.state.claimedCardIds.push(outcome.cardId)
          if (!this.state.codexElements.includes(outcome.element)) {
            this.state.codexElements.push(outcome.element)
          }
          await this.persist()
        }
        // Everyone hears the result (drives materialize FX), then the new state.
        this.broadcast({ type: 'scanResult', outcome, cardId: msg.cardId })
        this.broadcastState()
        break
      }

      case 'hint': {
        if (role !== 'control') break // only the control room transmits hints
        const text = msg.text.trim().slice(0, 240)
        if (!text) break
        const hint: Hint = { text, ts: Date.now(), from: 'control' }
        this.state.hints.push(hint)
        await this.persist()
        this.broadcast({ type: 'hint', hint })
        this.broadcastState()
        break
      }

      case 'staffConfirm': {
        const mission = MISSIONS[this.state.currentMissionIndex]
        if (!mission) break
        const target = MOLECULES[mission.targetMoleculeId]
        // Guard: never seal an incomplete set, even if a client asks.
        if (!isFormulaComplete(this.state.tray, target)) {
          ws.send(this.encode({ type: 'error', message: 'The set is not complete yet.' }))
          break
        }
        if (!this.state.codexMolecules.includes(target.id)) {
          this.state.codexMolecules.push(target.id)
        }
        this.state.currentMissionIndex += 1
        this.state.tray = []
        await this.persist()
        this.broadcast({ type: 'sealed', moleculeId: target.id })
        this.broadcastState()
        break
      }

      case 'reset': {
        this.state = freshRoomState()
        await this.persist()
        this.broadcastState()
        break
      }
    }
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string): Promise<void> {
    try {
      ws.close(code, reason)
    } catch {
      /* already closing */
    }
    this.refreshPresence(ws)
    this.broadcastState(ws)
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    this.refreshPresence(ws)
    this.broadcastState(ws)
  }

  // ── helpers ───────────────────────────────────────────────────────────
  private computeReady(): boolean {
    const mission = MISSIONS[this.state.currentMissionIndex]
    if (!mission) return false
    return isFormulaComplete(this.state.tray, MOLECULES[mission.targetMoleculeId])
  }

  private refreshPresence(exclude?: WebSocket) {
    let field = 0
    let control = 0
    for (const s of this.ctx.getWebSockets()) {
      if (s === exclude) continue // a socket mid-close still appears here
      const m = s.deserializeAttachment() as SockMeta | null
      if (m?.role === 'control') control++
      else field++
    }
    this.state.presence = { field, control }
  }

  private snapshot(): RoomState {
    this.state.ready = this.computeReady()
    return this.state
  }

  private async persist() {
    this.state.ready = this.computeReady()
    await this.ctx.storage.put('state', this.state)
  }

  private broadcastState(exclude?: WebSocket) {
    this.broadcast({ type: 'state', state: this.snapshot() }, exclude)
  }

  private broadcast(msg: ServerMsg, exclude?: WebSocket) {
    const data = this.encode(msg)
    for (const s of this.ctx.getWebSockets()) {
      if (s === exclude) continue
      try {
        s.send(data)
      } catch {
        /* socket gone */
      }
    }
  }

  private encode(msg: ServerMsg): string {
    return JSON.stringify(msg)
  }
}

// ── Worker entry: route the WS upgrade to the right team room ────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // /room/<CODE>/ws  → the team's Durable Object
    const m = url.pathname.match(/^\/room\/([A-Za-z0-9_-]{1,24})\/ws$/)
    if (m) {
      if (request.headers.get('Upgrade') !== 'websocket') {
        return new Response('expected websocket upgrade', { status: 426 })
      }
      const code = m[1].toUpperCase()
      // Deterministic routing: same code → same room instance, every time.
      const id = env.TEAM_ROOM.idFromName(code)
      const stub = env.TEAM_ROOM.get(id)
      return stub.fetch(request)
    }

    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response('Lattice rooms online', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    }

    return new Response('not found', { status: 404 })
  },
} satisfies ExportedHandler<Env>
