import ParticleField from './ParticleField'

type Props = {
  /** 0 = pristine, 1 = the Unbinding at full corruption */
  unbinding?: number
  particleColor?: string
}

// The living void behind every screen. The Unbinding's static is strongest
// when little has been stabilized and recedes as the Codex fills.
export default function Background({ unbinding = 0.6, particleColor = '#5ef2ff' }: Props) {
  return (
    <>
      <div className="void-bg" />
      <ParticleField color={particleColor} />
      <div className="unbinding" style={{ ['--unbinding' as string]: unbinding }} />
      <div className="scanline" />
    </>
  )
}
