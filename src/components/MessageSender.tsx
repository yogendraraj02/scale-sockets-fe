import { useState } from 'react'

interface Props {
  sendMessage: (to: string, text: string) => void
  onlineUsers: string[]
  requestOnlineUsers: () => void
  currentUserId: string
}

function MessageSender({ sendMessage, onlineUsers, requestOnlineUsers, currentUserId }: Props) {
  const [to, setTo] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const recipients = onlineUsers.filter(u => u !== currentUserId)

  const handleSend = () => {
    if (!to.trim() || !text.trim()) return
    try {
      sendMessage(to.trim(), text.trim())
      setStatus('sent')
      setTo('')
      setText('')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 h-full col-span-2">
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
        Send Message
      </h2>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          onFocus={requestOnlineUsers}
          className="w-full sm:w-40 text-sm px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none focus:border-indigo-400/50 disabled:opacity-40"
          disabled={!currentUserId}
        >
          <option value="" disabled>to: user</option>
          {recipients.length === 0
            ? <option disabled>no users online</option>
            : recipients.map(u => <option key={u} value={u}>{u}</option>)
          }
        </select>

        <input
          placeholder={currentUserId ? "message..." : "register first"}
          value={text}
          type="text"
          disabled={!currentUserId}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          className="w-full text-sm px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-indigo-400/50 placeholder:text-white/20 disabled:opacity-40"
        />
        <button
          onClick={handleSend}
          disabled={!to || !text.trim() || !currentUserId}
          className="w-full sm:w-auto text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          send
        </button>
      </div>

      {!currentUserId && (
        <p className="text-xs text-white/30 mt-2">register a username to send messages</p>
      )}
      {status === 'sent' && <p className="text-xs text-emerald-400 mt-2">message sent</p>}
      {status === 'error' && <p className="text-xs text-red-400 mt-2">failed to send</p>}
    </div>
  )
}

export default MessageSender