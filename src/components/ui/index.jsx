import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { formatBRL } from '../../lib/format.js'

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  children,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  }
  const sizes = { lg: 'btn-lg', md: 'btn-md', sm: 'btn-sm' }
  return (
    <button
      className={cn('btn', variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={cn('card p-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function Badge({ tone = 'default', className = '', children }) {
  const tones = {
    default: 'border-elev-border bg-white/5 text-elev-muted',
    primary: 'border-elev-primary/40 bg-elev-primary/15 text-elev-text',
    success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    warning: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    danger: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
    gradient: 'border-transparent bg-elev-gradient text-white',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Money({ value, className = '', short = false }) {
  return <span className={className}>{formatBRL(value)}</span>
}

export function Stat({ label, value, hint, icon: Icon, tone = 'default' }) {
  const toneRing = {
    default: 'text-elev-muted',
    up: 'text-emerald-300',
    down: 'text-rose-300',
  }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-elev-faint">
          {label}
        </span>
        {Icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-elev-gradient-soft text-elev-sky">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-2xl font-bold text-elev-text">{value}</div>
      {hint && <div className={cn('mt-1 text-xs', toneRing[tone])}>{hint}</div>}
    </div>
  )
}

export function ProgressBar({ value = 0, className = '' }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-white/8', className)}>
      <div
        className="h-full rounded-full bg-elev-gradient transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function Spinner({ className = '' }) {
  return <Loader2 className={cn('animate-spin text-elev-primary', className)} />
}

export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-elev-gradient-soft text-elev-sky">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-elev-text">{title}</h3>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-elev-muted">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
