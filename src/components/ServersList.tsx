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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Servers
      </h2>

      <div className="flex flex-col gap-2">
        {servers.map((server) => (
  <div
    key={server.serverId}
    className={`flex items-center justify-between px-3 py-2 rounded-lg ${
      server.serverId === 's1' 
        ? 'bg-grey-50 border border-indigo-200' 
        : 'bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${server.status === 'up' ? 'bg-emerald-400' : 'bg-red-400'}`} />
      <span className="text-sm font-medium text-gray-800">{server.serverId}</span>
      <span className="text-xs text-gray-400">:{server.port}</span>
      {server.serverId === 's1' && (
        <span className="text-xs text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-md">primary</span>
      )}
    </div>

    {server.serverId === 's1' ? (
      server.status === 'down' && (
        <button
          onClick={() => handleStart(server.serverId)}
          disabled={loadingId === server.serverId}
          className="text-xs px-3 py-1 rounded-md border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 transition-colors"
        >
          {loadingId === server.serverId ? 'starting...' : 'start'}
        </button>
      )
    ) : (
      server.status === 'up' ? (
        <button
          onClick={() => handleStop(server.serverId)}
          disabled={loadingId === server.serverId}
          className="text-xs px-3 py-1 rounded-md border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
        >
          {loadingId === server.serverId ? 'stopping...' : 'stop'}
        </button>
      ) : (
        <button
          onClick={() => handleStart(server.serverId)}
          disabled={loadingId === server.serverId}
          className="text-xs px-3 py-1 rounded-md border border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 transition-colors"
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