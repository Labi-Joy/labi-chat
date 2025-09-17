"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { chatStorage, type Message } from "@/lib/chat-storage"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { toast } from "sonner"

interface RegisteredUser {
  name: string
  avatar: string
  address: string
}

interface ChatWindowProps {
  currentUser: RegisteredUser
  otherUser: RegisteredUser
  onBack: () => void
}

export function ChatWindow({ currentUser, otherUser, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Load messages when component mounts or users change
  useEffect(() => {
    if (currentUser?.address) {
      const loadedMessages = chatStorage.getMessages(currentUser.address, otherUser.address)
      setMessages(loadedMessages)
    }
  }, [currentUser?.address, otherUser.address])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!currentUser?.address) {
      toast.error("User not connected")
      return
    }

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: currentUser.address,
      to: otherUser.address,
      content,
      timestamp: Date.now(),
    }

    // Add message to storage
    chatStorage.addMessage(newMessage)

    // Update local state
    setMessages((prev) => [...prev, newMessage])

    // In a real app, you would also send this to a WebSocket server
    // or use a decentralized messaging protocol
    toast.success("Message sent!")
  }

  if (!currentUser?.address) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Please connect your wallet to chat</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img
                src={otherUser.avatar ? (otherUser.avatar.startsWith('data:') ? otherUser.avatar : `https://gateway.pinata.cloud/ipfs/${otherUser.avatar}`) : "/placeholder.svg"}
                alt={`${otherUser.name}'s avatar`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{otherUser.name}</div>
                <div className="text-xs text-muted-foreground">
                  {otherUser.address.slice(0, 6)}...{otherUser.address.slice(-4)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet.</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwn = message.from === currentUser.address
                const showAvatar = index === 0 || messages[index - 1].from !== message.from

                return <ChatMessage key={message.id} message={message} isOwn={isOwn} showAvatar={showAvatar} />
              })
            )}
          </div>
        </ScrollArea>

        <ChatInput onSendMessage={handleSendMessage} placeholder={`Message ${otherUser.name}...`} />
      </CardContent>
    </Card>
  )
}
