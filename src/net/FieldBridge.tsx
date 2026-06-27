import { useEffect, useRef } from 'react'
import { useRoom } from './roomClient'
import { useSession } from '../store/session'
import { MISSIONS } from '../data/missions'

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

  // watch the mission index: when it advances, the control room sealed a bond →
  // reveal the molecule we just finished (works even when it repeats an earlier
  // one, which the Codex count wouldn't catch). A drop means staff reset us.
  const prevIdx = useRef<number | null>(null)
  useEffect(() => {
    if (!roomState) return
    const idx = roomState.currentMissionIndex
    if (prevIdx.current !== null) {
      if (idx > prevIdx.current) {
        const done = MISSIONS[prevIdx.current]
        if (done) revealMolecule(done.targetMoleculeId)
      } else if (idx < prevIdx.current) {
        goto('briefing')
      }
    }
    prevIdx.current = idx
  }, [roomState, revealMolecule, goto])

  return null
}
