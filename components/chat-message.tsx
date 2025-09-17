"use client"
import { ProfileDisplay } from "./profile-display"
import { formatDistanceToNow } from "date-fns"
import type { Message } from "@/lib/chat-storage"

interface ChatMessageProps {
  message: Message
  isOwn: boolean
  showAvatar?: boolean
}

export function ChatMessage({ message, isOwn, showAvatar = true }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {showAvatar && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8">
            <ProfileDisplay address={message.from} compact />
          </div>
        </div>
      )}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[70%]`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn ? "bg-blue-600 text-white rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}
