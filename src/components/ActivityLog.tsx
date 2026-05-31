import type { Log } from '../types'

interface Props {
  logs: Log[]
}

function getEventStyle(event: string) {
  if (/disconnected|went down/.test(event)) return 'border-red-400/60 bg-red-400/5';
  if (/connected|is up/.test(event)) return 'border-emerald-400/60 bg-emerald-400/5';
  if (/→/.test(event)) return 'border-indigo-400/60 bg-indigo-400/5';
  return 'border-white/10 bg-white/5';
}

function ActivityLog({ logs }: Props) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 col-span-2">
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
        Activity Log
      </h2>

      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-4">
            no activity yet
          </p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 px-3 py-2 rounded-lg border-l-2 border border-r-0 border-t-0 border-b-0 font-mono ${getEventStyle(log.event)}`}
            >
              <span className="text-xs text-white/30 shrink-0 mt-0.5">
                {new Date(log.time).toLocaleTimeString()}
              </span>
              <span className="text-xs text-white/60">
                {log.event}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ActivityLog