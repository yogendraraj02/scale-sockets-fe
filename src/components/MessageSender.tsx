import { useState } from 'react'
interface Props{
  sendMessage: (to: string, text: string) => void
}


function MessageSender({sendMessage}: Props) {
  const [to, setTo] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  
 
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
    <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-2">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Send Message
      </h2>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="to: user_id"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-36 text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
        />
        <input
          type="text"
          placeholder="message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
        />
        <button
          onClick={handleSend}
          disabled={!to.trim() || !text.trim()}
          className="text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          send
        </button>
      </div>

      {status === 'sent' && (
        <p className="text-xs text-emerald-500 mt-2">message sent</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-2">failed to send</p>
      )}

    </div>
    
  )
}

export default MessageSender