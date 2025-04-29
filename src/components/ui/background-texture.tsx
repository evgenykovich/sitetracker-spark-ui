import introBg from '@/assets/images/intro-bg.jpg'

export function BackgroundTexture() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <img
          src={introBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 2px, transparent 2px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/70" />
      </div>
    </>
  )
}
