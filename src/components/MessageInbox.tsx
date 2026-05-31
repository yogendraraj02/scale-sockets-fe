import type { Message } from '../types'

interface Props {
  messages: Message[]
  currentUserId: string
}

function MessageInbox({ messages, currentUserId }: Props) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 col-span-2">
      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
        Inbox
      </h2>

      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-4">no messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col px-3 py-2 rounded-lg max-w-sm ${
                msg.from === currentUserId
                  ? 'bg-indigo-500/20 border border-indigo-400/20 self-end items-end'
                  : 'bg-white/10 border border-white/10 self-start items-start'
              }`}
            >
              <span className="text-xs text-white/30 mb-1">{msg.from}</span>
              <span className="text-sm text-slate-100">{msg.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MessageInbox