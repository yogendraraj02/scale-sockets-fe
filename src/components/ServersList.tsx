import { useState } from "react";
import type { Server } from "../types";
import { startServer, stopServer } from "../services/api";

interface Props {
  servers: Server[];
  onRefresh: () => void;
}

function ServersList({ servers, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<String | null>(null);

  const handleStop = async (id: string) => {
    const downServers = servers.filter(s => s.status === 'down');
    if(downServers.length >= servers.length - 1){
      alert('At least one server must be up');
      return;
    }
    if(!window.confirm('Are you sure you want to stop this server?')) return;
    setLoadingId(id);
    await stopServer(id);
    onRefresh();
    setLoadingId(null);
  };
  const handleStart = async (id: string) => {
    setLoadingId(id);
    await startServer(id);
    onRefresh();
    setLoadingId(null);
  };

 return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
        Servers
      </h2>

      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
        {servers.map((server) => (
  <div
    key={server.serverId}
    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
      server.serverId === 's1'
        ? 'bg-indigo-400/5 border border-indigo-400/20'
        : 'bg-white/5 border border-white/5'
    }`}
  >
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${server.status === 'up' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-red-400'}`} />
      <span className="text-sm font-medium text-slate-100">{server.serverId}</span>
      <span className="text-xs text-white/30">:{server.port}</span>
      {server.serverId === 's1' && (
     <span className="text-xs font-medium text-indigo-300 bg-indigo-400/20 border border-indigo-400/30 px-2 py-0.5 rounded-md">core</span>
      )}
    </div>

    {server.serverId === 's1' ? (
      server.status === 'down' && (
        <button
          onClick={() => handleStart(server.serverId)}
          disabled={loadingId === server.serverId}
          className="text-xs px-3 py-1 rounded-md border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 disabled:opacity-40 transition-colors"
        >
          {loadingId === server.serverId ? 'starting...' : 'start'}
        </button>
      )
    ) : (
      server.status === 'up' ? (
        <button
          onClick={() => handleStop(server.serverId)}
          disabled={loadingId === server.serverId}
          className="text-xs px-3 py-1 rounded-md border border-red-400/30 text-red-400 hover:bg-red-400/10 disabled:opacity-40 transition-colors"
        >
          {loadingId === server.serverId ? 'stopping...' : 'stop'}
        </button>
      ) : (
        <button
          onClick={() => handleStart(server.serverId)}
          disabled={loadingId === server.serverId}
          className="text-xs px-3 py-1 rounded-md border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 disabled:opacity-40 transition-colors"
        >
          {loadingId === server.serverId ? 'starting...' : 'start'}
        </button>
      )
    )}
  </div>
))}
      </div>
    </div>
  )
}


export default ServersList;