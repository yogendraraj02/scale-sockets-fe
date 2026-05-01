import { useEffect, useState } from "react";
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
  const navigate = useNavigate()

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
      <div>
        <h1 className="text-base font-semibold text-slate-800 tracking-tight">scale-sockets</h1>
        <p className="text-xs text-slate-400">websocket scaling simulator</p>
      </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/about')} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          about
        </button>          
        {/* register box */}
          <div className="flex items-center gap-2">
            {registeredId ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-600 font-medium">
                  {registeredId}
                </span>
                <button
                  onClick={() => setRegisteredId("")}
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
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    userId.trim() &&
                    setRegisteredId(userId.trim())
                  }
                  className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
                />
                <button
                  onClick={() =>
                    userId.trim() && setRegisteredId(userId.trim())
                  }
                  disabled={!userId.trim()}
                  className="text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 transition-colors"
                >
                  register
                </button>
              </>
            )}
          </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ServersList servers={servers} onRefresh={refreshDashboard} />
          <ClientsList clients={clients} />
          <ActivityLog logs={logs} />
          <MessageSender sendMessage={sendMessage} />
          <MessageInbox messages={messages} currentUserId={registeredId} />
        </div>
        <footer className="mt-8 flex items-center justify-between text-xs text-gray-400">
          <span>
            built for scale by{" "}
            <span className="text-indigo-400 font-medium">Yogi</span>
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yogendraraj02/scale-sockets-fe"
              target="_blank"
              className="hover:text-gray-600 transition-colors"
            >
              github
            </a>
            <a
              href="https://linkedin.com/in/yogendraraj02"
              target="_blank"
              className="hover:text-gray-600 transition-colors"
            >
              linkedin
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
