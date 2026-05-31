import { useNavigate } from 'react-router-dom'

const usedIn = [
  { name: 'WhatsApp Web', desc: 'multiple servers, Redis pub/sub, WebSocket' },
  { name: 'Slack', desc: 'same pattern, millions of users' },
  { name: 'Online Multiplayer Games', desc: 'real-time message routing' },
  { name: 'Live Trading Platforms', desc: 'low latency, distributed' },
]

const stack = ['Socket.io', 'Redis Pub/Sub', 'NGINX', 'Docker', 'Node.js', 'React', 'TypeScript']

function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => navigate('/')}
          className="text-xs text-white/40 hover:text-white/70 transition-colors mb-8 flex items-center gap-1"
        >
          ← back to simulator
        </button>

        <div className="mb-10">
          <h1 className="text-2xl font-medium text-white mb-1">Scale Sockets</h1>
          <p className="text-sm text-white/40">WebSocket Scaling Simulator</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            the problem
          </h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
            <p className="text-sm text-white/60 leading-relaxed mb-4">
            In a single-server setup, real-time messaging is straightforward — every connected client is reachable directly. However, once the application is deployed across multiple instances (for scalability or reliability), users connected to <span className="text-white font-medium">different servers cannot communicate directly</span>.
            </p>
            <p className="text-sm text-white/60 leading-relaxed">
              This project solves that problem using <span className="text-white font-medium">Redis Pub/Sub as a message broker</span> between servers, ensuring any client can message any other client regardless of which server they're connected to. It also demonstrates <span className="text-white font-medium">server failure scenarios</span> — stopping a server instance mid-session and watching traffic automatically reroute.
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            what you can simulate
          </h2>
          <div className="flex flex-col gap-2">
            {[
              'Connect multiple clients across different server instances',
              'Send messages between clients even when they are on different servers',
              'Start or stop servers mid-session and see how the system adapts in real time',
              'Watch how connections are automatically distributed across available servers',
              'View live system activity including connections, disconnections, and message flow',
              'Interact with a messaging interface to send and receive messages instantly',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <span className="text-indigo-400 font-medium text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm text-white/60">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            this pattern powers
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {usedIn.map((item) => (
              <div key={item.name} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <p className="text-sm font-medium text-white mb-1">{item.name}</p>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((s) => (
              <span key={s} className="text-xs text-indigo-300 bg-indigo-400/20 border border-indigo-400/30 px-3 py-1 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>

         <footer className="mt-8 flex items-center justify-between text-xs text-white/30">
          <span>
            built for scale by{" "}
            <span className="text-indigo-400 font-medium">Yogi</span>
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yogendraraj02/scale-sockets-fe"
              target="_blank"
              className="hover:text-white/60 transition-colors"
            >
              github
            </a>
            <a
              href="https://linkedin.com/in/yogendraraj02"
              target="_blank"
              className="hover:text-white/60 transition-colors"
            >
              linkedin
            </a>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default About