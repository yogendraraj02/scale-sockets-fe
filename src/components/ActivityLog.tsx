import type { Log } from '../types'

interface Props {
  logs: Log[]
}

function ActivityLog({ logs }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-2">
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
        Activity Log
      </h2>

      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            no activity yet
          </p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-3 px-3 py-2 bg-gray-50 rounded-lg font-mono"
            >
              <span className="text-xs text-gray-400 shrink-0 mt-0.5">
                {new Date(log.time).toLocaleTimeString()}
              </span>
              <span className="text-xs text-gray-700">
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