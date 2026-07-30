import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { useStore } from '../../store/StoreContext.jsx'
import { cn } from '../../lib/utils.js'

const icons = {
  default: Info,
  primary: CheckCircle2,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertTriangle,
}

export default function Toaster() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex w-[92%] max-w-sm -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-5 sm:translate-x-0">
      {toasts.map((t) => {
        const Icon = icons[t.tone] || Info
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border bg-elev-surface/95 px-4 py-3 shadow-elev-card backdrop-blur',
              t.tone === 'danger'
                ? 'border-rose-400/40'
                : t.tone === 'warning'
                  ? 'border-amber-400/40'
                  : 'border-elev-primary/40',
            )}
          >
            <Icon
              className={cn(
                'mt-0.5 h-4 w-4 shrink-0',
                t.tone === 'danger'
                  ? 'text-rose-300'
                  : t.tone === 'warning'
                    ? 'text-amber-300'
                    : 'text-elev-sky',
              )}
            />
            <p className="text-sm text-elev-text">{t.msg}</p>
          </div>
        )
      })}
    </div>
  )
}
