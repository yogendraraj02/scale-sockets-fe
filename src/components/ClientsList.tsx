import type { Client } from "../types";

interface Props {
  clients: Client[];
}

function ClientsList({ clients }: Props) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
        Connected Clients
      </h2>

      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
        {clients.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-4">
            no clients connected
          </p>
        ) : (
          clients.map((client) => (
            <div
              key={client.userId}
              className="flex items-center justify-between px-3 py-2 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-500/40 border border-indigo-400/20 text-indigo-300 text-xs font-medium flex items-center justify-center">
                  {client.userId.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-100">
                  {client.userId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded-md">
                  {client.connectedServer}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    client.status === "online"
                      ? "bg-emerald-400/15 text-emerald-400"
                      : "bg-red-400/15 text-red-400"
                  }`}
                >
                  {client.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClientsList;
