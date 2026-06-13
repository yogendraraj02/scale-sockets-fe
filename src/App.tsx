import { useState, useEffect, useCallback } from "react";
import type { Client, Server, Log, Message, DashboardData } from "./types";
import ServersList from "./components/ServersList";
import ClientsList from "./components/ClientsList";
import ActivityLog from "./components/ActivityLog";
import MessageSender from "./components/MessageSender";
import { useSocket } from "./hooks/useSocket";
import MessageInbox from "./components/MessageInbox";
import AIAnalyzer from "./components/AIAnalyzer";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "./services/api";

const TOKEN_KEY = "ws_token";
const USER_KEY = "scale_sockets_userId";

async function acquireToken(userId: string): Promise<string> {
  const token = await getAuthToken(userId);
  sessionStorage.setItem(TOKEN_KEY, token);
  return token;
}

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [token, setToken] = useState(sessionStorage.getItem(TOKEN_KEY) ?? "");
  const [userId, setUserId] = useState(sessionStorage.getItem(USER_KEY) ?? "");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) return;

    const name = window.prompt("Enter your username to join:")?.trim() ?? "";
    if (!name) return;

    acquireToken(name).then((t) => {
      sessionStorage.setItem(USER_KEY, name);
      setUserId(name);
      setToken(t);
    });
  }, []);

  const handleAuthError = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken("");
    setUserId("");

    setTimeout(() => {
      const name = window.prompt("Session expired. Enter your username to reconnect:")?.trim() ?? "";
      if (!name) return;
      acquireToken(name).then((t) => {
        sessionStorage.setItem(USER_KEY, name);
        setUserId(name);
        setToken(t);
      });
    }, 300);
  }, []);

  const handleDashboardUpdate = useCallback((data: DashboardData) => {
    setClients(data.clients);
    setServers(data.servers);
    setLogs(data.logs);
  }, []);

  const handleMessage = useCallback((msg: Message) => {
    setMessages((prev) => [msg, ...prev]);
  }, []);

  const { sendMessage, refreshDashboard, requestOnlineUsers, onlineUsers } = useSocket({
    token,
    onMessage: handleMessage,
    onDashboardUpdate: handleDashboardUpdate,
    onAuthError: handleAuthError,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">

      {/* header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-white">scale-sockets</h1>
            <p className="text-xs text-white/40 hidden sm:block">websocket scaling simulator</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/about')} className="text-xs text-white/40 hover:text-white/70 transition-colors">
              about
            </button>
            {userId ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </div>
                <span className="text-xs text-emerald-400 font-medium">{userId}</span>
              </div>
            ) : (
              <span className="text-xs text-white/30 italic">not registered</span>
            )}
          </div>
        </div>
      </div>

      {/* main */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <ServersList servers={servers} onRefresh={refreshDashboard} />
          <ClientsList clients={clients} />
        </div>
        <div className="mb-4">
          <ActivityLog logs={logs} />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <MessageSender sendMessage={sendMessage} onlineUsers={onlineUsers} requestOnlineUsers={requestOnlineUsers} currentUserId={userId} />
          <MessageInbox messages={messages} currentUserId={userId} />
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-4 pb-6 flex items-center justify-between text-xs text-white/30">
        <span>built for scale by <span className="text-indigo-400 font-medium">Yogi</span></span>
        <div className="flex items-center gap-4">
          <a href="https://github.com/yogendraraj02/scale-sockets-fe" target="_blank" className="hover:text-white/60 transition-colors">github</a>
          <a href="https://linkedin.com/in/yogendraraj02" target="_blank" className="hover:text-white/60 transition-colors">linkedin</a>
        </div>
      </footer>

      <AIAnalyzer token={token} />
    </div>
  );
}

export default App;
