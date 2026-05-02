import { useState } from "react";
import type { Client, Server, Log, Message, DashboardData } from "./types";
import ServersList from "./components/ServersList";
import ClientsList from "./components/ClientsList";
import ActivityLog from "./components/ActivityLog";
import MessageSender from "./components/MessageSender";
import { useSocket } from "./hooks/useSocket";
import MessageInbox from "./components/MessageInbox";
import { useNavigate } from "react-router-dom";

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState("");
  const [registeredId, setRegisteredId] = useState("");
  const navigate = useNavigate();

  const handleDashboardUpdate = (data: DashboardData) => {
    setClients(data.clients);
    setServers(data.servers);
    setLogs(data.logs);
  };
  const handleMessage = (msg: Message) => {
    setMessages((prev) => [msg, ...prev]);
  };

  const { sendMessage, refreshDashboard } = useSocket(
    registeredId || "dashboard-user",
    handleMessage,
    handleDashboardUpdate,
  );

  return (
  <div className="min-h-screen bg-slate-50">
    
    {/* header */}
    <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-slate-800">scale-sockets</h1>
          <p className="text-xs text-slate-400 hidden sm:block">websocket scaling simulator</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/about')} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            about
          </button>
          {registeredId ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-600 font-medium">{registeredId}</span>
              <button onClick={() => setRegisteredId('')} className="text-xs text-emerald-400 hover:text-emerald-600 ml-1">×</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="user id..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && userId.trim() && setRegisteredId(userId.trim())}
                className="w-28 sm:w-36 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-300 placeholder:text-slate-300"
              />
              <button
                onClick={() => userId.trim() && setRegisteredId(userId.trim())}
                disabled={!userId.trim()}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 transition-colors"
              >register</button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* main */}
    <div className="max-w-5xl mx-auto px-4 py-5">
      
      {/* top row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <ServersList servers={servers} onRefresh={refreshDashboard} />
        <ClientsList clients={clients} />
      </div>

      {/* activity log full width */}
      <div className="mb-4">
        <ActivityLog logs={logs} />
      </div>

      {/* message + inbox side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <MessageSender sendMessage={sendMessage} />
        <MessageInbox messages={messages} currentUserId={registeredId} />
      </div>

    </div>

    {/* footer */}
    <footer className="max-w-5xl mx-auto px-4 pb-6 flex items-center justify-between text-xs text-slate-400">
      <span>built for scale by <span className="text-indigo-400 font-medium">Yogi</span></span>
      <div className="flex items-center gap-4">
        <a href="https://github.com/yogendraraj02/scale-sockets-fe" target="_blank" className="hover:text-slate-600 transition-colors">github</a>
        <a href="https://linkedin.com/in/yogendraraj02" target="_blank" className="hover:text-slate-600 transition-colors">linkedin</a>
      </div>
    </footer>
  </div>
)
}

export default App;
