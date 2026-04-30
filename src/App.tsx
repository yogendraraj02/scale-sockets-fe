import { useEffect, useState } from 'react'
import { getClients, getServers, getLogs } from './services/api'
import type { Client, Server, Log } from './types'
import ServersList from './components/ServersList'
import ClientsList from './components/ClientsList'
import ActivityLog from './components/ActivityLog'
import MessageSender from './components/MessageSender'

function App() {
  const [clients, setClients] = useState<Client[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [userId, setUserId] = useState('')
  const [registeredId, setRegisteredId] = useState('')

  const fetchAll = async () => {
    const [c, s, l] = await Promise.all([getClients(), getServers(), getLogs()])
    setClients(c.data.clients ?? c.data)
    setServers(s.data.servers ?? s.data)
    setLogs(l.data.logs ?? l.data)
  }

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-800">scale-sockets</h1>
            <p className="text-xs text-gray-400">websocket scaling dashboard</p>
          </div>

          {/* register box */}
          <div className="flex items-center gap-2">
            {registeredId ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-600 font-medium">{registeredId}</span>
                <button
                  onClick={() => setRegisteredId('')}
                  className="text-xs text-emerald-400 hover:text-emerald-600 ml-1"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="your user id..."
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userId.trim() && setRegisteredId(userId.trim())}
                  className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
                />
                <button
                  onClick={() => userId.trim() && setRegisteredId(userId.trim())}
                  disabled={!userId.trim()}
                  className="text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 transition-colors"
                >
                  register
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ServersList servers={servers} onRefresh={fetchAll} />
          <ClientsList clients={clients} />
          <ActivityLog logs={logs} />
          <MessageSender userId={registeredId || 'dashboard-user'} />
        </div>

      </div>
    </div>
  )
}

export default App