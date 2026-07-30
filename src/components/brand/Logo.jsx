// Marca elev recriada em SVG vetorial (a partir da identidade enviada).
// Se preferir usar os PNGs originais, coloque-os em /public/brand e troque aqui.

export function ElevMark({ className = '', style }) {
  return (
    <svg viewBox="0 0 112 100" className={className} style={style} role="img" aria-label="elev">
      <defs>
        <linearGradient id="elevMarkGrad" x1="8%" y1="100%" x2="92%" y2="0%">
          <stop offset="0" stopColor="#6BA5FF" />
          <stop offset="0.52" stopColor="#A855F7" />
          <stop offset="1" stopColor="#E24BF0" />
        </linearGradient>
      </defs>
      {/* corpo do "v": desce da esquerda ate a ponta e faz o gancho para cima */}
      <path
        d="M22 20 L50 82 C53 89 61 88 67 82 C76 73 80 60 80 44"
        fill="none"
        stroke="url(#elevMarkGrad)"
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* terminal superior (gota/scoop) */}
      <path d="M79 17 H105 A13 13 0 0 1 79 17 Z" fill="url(#elevMarkGrad)" />
    </svg>
  )
}

export default function Logo({ size = 30, agency = true, className = '' }) {
  const fontSize = Math.round(size * 0.92)
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="inline-flex items-center" style={{ gap: size * 0.06 }}>
        <span
          className="font-display font-bold lowercase tracking-tight text-elev-text"
          style={{ fontSize, lineHeight: 1 }}
        >
          ele
        </span>
        <ElevMark style={{ height: size * 0.98, width: 'auto' }} />
      </span>
      {agency && (
        <span
          className="uppercase text-elev-faint font-medium"
          style={{ fontSize: Math.max(7, size * 0.24), letterSpacing: size * 0.11, marginTop: size * 0.06 }}
        >
          Agency
        </span>
      )}
    </span>
  )
}
