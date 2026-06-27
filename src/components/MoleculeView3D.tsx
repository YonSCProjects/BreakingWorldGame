import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ELEMENTS } from '../data/elements'
import { structureFor } from '../data/structures3d'

type Props = {
  moleculeId: string
  /** how many of each element are gathered — un-gathered atoms render as ghosts */
  filled?: Record<string, number>
  autoRotate?: boolean
  className?: string
}

// Rotatable ball-and-stick model. Gathered atoms glow in their element colour;
// the rest hang as dim ghosts so the control room sees the shape forming.
export default function MoleculeView3D({
  moleculeId,
  filled,
  autoRotate = true,
  className = '',
}: Props) {
  const struct = structureFor(moleculeId)

  // decide which atoms are "lit" by consuming the gathered tally per element
  const lit = useMemo(() => {
    if (!struct) return []
    if (!filled) return struct.atoms.map(() => true)
    const used: Record<string, number> = {}
    return struct.atoms.map((a) => {
      used[a.symbol] = (used[a.symbol] ?? 0) + 1
      return used[a.symbol] <= (filled[a.symbol] ?? 0)
    })
  }, [struct, filled])

  if (!struct) return null

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} />
        <pointLight position={[0, 0, 2.5]} intensity={9} distance={12} decay={0} color="#9fe8ff" />

        <group>
          {struct.atoms.map((a, i) => (
            <AtomMesh key={i} symbol={a.symbol} pos={a.pos} lit={lit[i]} />
          ))}
          {struct.bonds.map((b, i) => (
            <BondMesh
              key={`b${i}`}
              start={struct.atoms[b.a].pos}
              end={struct.atoms[b.b].pos}
              order={b.order}
              lit={lit[b.a] && lit[b.b]}
            />
          ))}
        </group>

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1.4}
          enablePan={false}
          enableZoom
          minDistance={2.6}
          maxDistance={9}
        />
      </Canvas>
    </div>
  )
}

function AtomMesh({ symbol, pos, lit }: { symbol: string; pos: [number, number, number]; lit: boolean }) {
  const el = ELEMENTS[symbol]
  const color = el?.color ?? '#888888'
  const r = (el?.sizeScale ?? 0.8) * 0.42 + 0.12
  return (
    <mesh position={pos}>
      <sphereGeometry args={[r, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={lit ? 0.55 : 0}
        metalness={0.15}
        roughness={0.35}
        transparent
        opacity={lit ? 1 : 0.16}
      />
    </mesh>
  )
}

function BondMesh({
  start,
  end,
  order,
  lit,
}: {
  start: [number, number, number]
  end: [number, number, number]
  order: 1 | 2
  lit: boolean
}) {
  const { quaternion, mid, len, offset } = useMemo(() => {
    const s = new THREE.Vector3(...start)
    const e = new THREE.Vector3(...end)
    const dir = e.clone().sub(s)
    const length = dir.length()
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    )
    // a perpendicular for splitting a double bond into two rails
    let perp = dir.clone().normalize().cross(new THREE.Vector3(0, 0, 1))
    if (perp.lengthSq() < 1e-4) perp = new THREE.Vector3(1, 0, 0)
    perp.normalize().multiplyScalar(0.1)
    return { quaternion: q, mid: s.clone().add(e).multiplyScalar(0.5), len: length, offset: perp }
  }, [start, end])

  const color = lit ? '#cfeeff' : '#5a6678'
  const rails = order === 2 ? [-1, 1] : [0]

  return (
    <>
      {rails.map((sgn, i) => (
        <mesh
          key={i}
          position={[mid.x + offset.x * sgn, mid.y + offset.y * sgn, mid.z + offset.z * sgn]}
          quaternion={quaternion}
        >
          <cylinderGeometry args={[0.058, 0.058, len, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={lit ? 0.3 : 0}
            transparent
            opacity={lit ? 1 : 0.22}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      ))}
    </>
  )
}
