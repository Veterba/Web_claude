export default function CrtOverlay() {
  return (
    <>
      {/* Noise grain texture */}
      <div className="noise" aria-hidden="true" />
      {/* Screen curvature shadow */}
      <div className="crt-wrap" aria-hidden="true" />
      {/* Scanlines */}
      <div className="crt-scanlines fixed inset-0 z-50" aria-hidden="true" />
      {/* Vignette */}
      <div className="crt-vignette fixed inset-0 z-50" aria-hidden="true" />
    </>
  )
}
