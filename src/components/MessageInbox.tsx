import type { Message } from '../types'

interface Props {
  messages: Message[]
  currentUserId: string
}

function MessageInbox({ messages, currentUserId }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-2">
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
        Inbox
      </h2>

      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">no messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col px-3 py-2 rounded-lg max-w-sm ${
                msg.from === currentUserId
                  ? 'bg-indigo-50 self-end items-end'
                  : 'bg-gray-50 self-start items-start'
              }`}
            >
              <span className="text-xs text-gray-400 mb-1">{msg.from}</span>
              <span className="text-sm text-gray-800">{msg.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MessageInbox