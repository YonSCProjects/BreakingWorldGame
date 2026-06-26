import { useEffect, useRef } from 'react'
import { useRoom } from './roomClient'
import { useSession } from '../store/session'

// Headless: keeps the local view-model (useSession) in lockstep with the team
// room while in networked field mode. Mounted only for field devices.
export default function FieldBridge() {
  const roomState = useRoom((s) => s.state)
  const lastScan = useRoom((s) => s.lastScan)
  const lastSealed = useRoom((s) => s.lastSealed)
  const syncFromRoom = useSession((s) => s.syncFromRoom)
  const pushScan = useSession((s) => s.pushScan)
  const revealMolecule = useSession((s) => s.revealMolecule)

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

  // staff/app sealed a molecule → jump to the reveal
  const sealTs = useRef(0)
  useEffect(() => {
    if (lastSealed && lastSealed.ts !== sealTs.current) {
      sealTs.current = lastSealed.ts
      revealMolecule(lastSealed.moleculeId)
    }
  }, [lastSealed, revealMolecule])

  return null
}
