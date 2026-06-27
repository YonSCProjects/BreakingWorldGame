import { useEffect, useRef } from 'react'
import { useRoom } from './roomClient'
import { useSession } from '../store/session'

// Headless: keeps the local view-model (useSession) in lockstep with the team
// room while in networked field mode. Mounted only for field devices.
//
// The seal is now owned entirely by the control room, so the field phone learns
// of a completed bond from authoritative STATE (the Codex grew) rather than a
// transient event — this survives a dropped/restored connection.
export default function FieldBridge() {
  const roomState = useRoom((s) => s.state)
  const lastScan = useRoom((s) => s.lastScan)
  const syncFromRoom = useSession((s) => s.syncFromRoom)
  const pushScan = useSession((s) => s.pushScan)
  const revealMolecule = useSession((s) => s.revealMolecule)
  const goto = useSession((s) => s.goto)

  // mirror authoritative team state
  useEffect(() => {
    if (roomState) syncFromRoom(roomState)
  }, [roomState, syncFromRoom])

  // server-decided scan outcome → drives the same toast + materialize FX
  const scanTs = useRef(0)
  useEffect(() => {
    if (lastScan && lastScan.ts !== scanTs.current) {
      scanTs.current = lastScan.ts
      pushScan(lastScan)
    }
  }, [lastScan, pushScan])

  // watch the Codex: a new molecule means the control room sealed a bond →
  // show the reveal. A shrunk Codex means staff reset the team → back to start.
  const prevCodex = useRef<number | null>(null)
  useEffect(() => {
    if (!roomState) return
    const n = roomState.codexMolecules.length
    if (prevCodex.current !== null) {
      if (n > prevCodex.current) {
        revealMolecule(roomState.codexMolecules[n - 1])
      } else if (n < prevCodex.current) {
        goto('briefing')
      }
    }
    prevCodex.current = n
  }, [roomState, revealMolecule, goto])

  return null
}
