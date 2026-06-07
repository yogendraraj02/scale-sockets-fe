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

const STORAGE_KEY = "scale_sockets_userId";

function promptForUsername(prefill = "", error = ""): string {
  const msg = error
    ? `${error}\n\nChoose a different username:`
    : "Enter your username to join:";
  const name = window.prompt(msg, prefill)?.trim() ?? "";
  return name;
}

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [registeredId, setRegisteredId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage is shared across tabs — prevents same name on two tabs
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRegisteredId(saved);
    } else {
      const name = promptForUsername();
      if (name) {
        localStorage.setItem(STORAGE_KEY, name);
        setRegisteredId(name);
      }
    }
  }, []);

  const handleDashboardUpdate = useCallback((data: DashboardData) => {
    setClients(data.clients);
    setServers(data.servers);
    setLogs(data.logs);
  }, []);

  const handleMessage = useCallback((msg: Message) => {
    setMessages((prev) => [msg, ...prev]);
  }, []);

  const handleRegisterError = useCallback((reason: string) => {
    // Clear stored name so other tabs don't reuse it either
    localStorage.removeItem(STORAGE_KEY);
    setRegisteredId(""); // disconnect current socket

    // Defer prompt so socket teardown completes first
    setTimeout(() => {
      const name = promptForUsername("", reason);
      if (name) {
        localStorage.setItem(STORAGE_KEY, name);
        setRegisteredId(name);
      }
    }, 300);
  }, []);

  const { sendMessage, refreshDashboard, requestOnlineUsers, onlineUsers } = useSocket({
    userId: registeredId,
    onMessage: handleMessage,
    onDashboardUpdate: handleDashboardUpdate,
    onRegisterError: handleRegisterError,
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
            {registeredId ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </div>
                <span className="text-xs text-emerald-400 font-medium">{registeredId}</span>
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
          <MessageSender sendMessage={sendMessage} onlineUsers={onlineUsers} requestOnlineUsers={requestOnlineUsers} currentUserId={registeredId} />
          <MessageInbox messages={messages} currentUserId={registeredId} />
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-4 pb-6 flex items-center justify-between text-xs text-white/30">
        <span>built for scale by <span className="text-indigo-400 font-medium">Yogi</span></span>
        <div className="flex items-center gap-4">
          <a href="https://github.com/yogendraraj02/scale-sockets-fe" target="_blank" className="hover:text-white/60 transition-colors">github</a>
          <a href="https://linkedin.com/in/yogendraraj02" target="_blank" className="hover:text-white/60 transition-colors">linkedin</a>
        </div>
      </footer>

      <AIAnalyzer />
    </div>
  );
}

export default App;