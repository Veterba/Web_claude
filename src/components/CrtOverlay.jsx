export default function CrtOverlay() {
  return (
    <>
      <div
        className="crt-scanlines fixed inset-0 z-50"
        aria-hidden="true"
      />
      <div
        className="crt-vignette fixed inset-0 z-50"
        aria-hidden="true"
      />
    </>
  )
}
