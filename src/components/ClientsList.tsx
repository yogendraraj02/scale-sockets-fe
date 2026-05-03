import type { Client } from "../types";

interface Props {
  clients: Client[];
}

function ClientsList({ clients }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Connected Clients
      </h2>

      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
        {clients.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            no clients connected
          </p>
        ) : (
          clients.map((client) => (
            <div
              key={client.userId}
              className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium flex items-center justify-center">
                  {client.userId.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {client.userId}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                  {client.connectedServer}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-md ${
                    client.status === "online"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-400"
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
