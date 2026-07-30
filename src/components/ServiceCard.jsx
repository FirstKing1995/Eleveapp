import { Check } from 'lucide-react'
import { formatBRL } from '../lib/format.js'
import { cn } from '../lib/utils.js'

export default function ServiceCard({
  service,
  price,
  oldPrice,
  badge,
  action,
  highlighted = false,
  showIncludes = true,
  maxIncludes = 4,
}) {
  const Icon = service.icon
  return (
    <div
      className={cn(
        'card card-hover flex flex-col p-6',
        highlighted && 'border-elev-primary/70 shadow-elev-glow',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="grid h-12 w-12 place-items-center rounded-xl2 bg-elev-gradient-soft"
          style={{ color: service.accent }}
        >
          <Icon className="h-6 w-6" />
        </div>
        {badge && (
          <span className="rounded-full bg-elev-gradient px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-elev-text">{service.name}</h3>
      <p className="mt-1 text-sm text-elev-muted">{service.tagline}</p>

      <div className="mt-4 flex items-end gap-2">
        {oldPrice != null && oldPrice !== price && (
          <span className="text-sm text-elev-faint line-through">{formatBRL(oldPrice)}</span>
        )}
        <span className="font-display text-2xl font-bold text-elev-text">{formatBRL(price)}</span>
        {service.period && <span className="pb-1 text-xs text-elev-muted">{service.period}</span>}
      </div>

      {showIncludes && (
        <ul className="mt-4 space-y-2">
          {service.includes.slice(0, maxIncludes).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-elev-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-elev-sky" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {action && <div className="mt-6 pt-2">{action}</div>}
    </div>
  )
}
