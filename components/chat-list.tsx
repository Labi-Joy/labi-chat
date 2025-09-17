"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProfileDisplay } from "./profile-display"
import { chatStorage } from "@/lib/chat-storage"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle, Trash2 } from "lucide-react"
import { usePrimaryDomain } from "@/lib/web3-hooks"

interface ChatListProps {
  onChatSelect: (address: `0x${string}`, domain: string) => void
  selectedChat?: `0x${string}`
}

export function ChatList({ onChatSelect, selectedChat }: ChatListProps) {
  const { address } = useAccount()
  const [recentChats, setRecentChats] = useState<
    Array<{
      otherUser: `0x${string}`
      lastMessage: any
      unreadCount: number
    }>
  >([])

  // Load recent chats
  useEffect(() => {
    if (address) {
      const chats = chatStorage.getRecentChats(address)
      setRecentChats(chats)
    }
  }, [address])

  const handleClearChats = () => {
    chatStorage.clearAllChats()
    setRecentChats([])
  }

  if (!address) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Connect wallet to view chats</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Recent Chats
            </CardTitle>
            <CardDescription>{recentChats.length} conversations</CardDescription>
          </div>
          {recentChats.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearChats}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentChats.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No conversations yet.</p>
            <p className="text-sm">Start chatting with community members!</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {recentChats.map(({ otherUser, lastMessage, unreadCount }) => (
                <ChatListItem
                  key={otherUser}
                  otherUser={otherUser}
                  lastMessage={lastMessage}
                  unreadCount={unreadCount}
                  isSelected={selectedChat === otherUser}
                  onClick={onChatSelect}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

interface ChatListItemProps {
  otherUser: `0x${string}`
  lastMessage: any
  unreadCount: number
  isSelected: boolean
  onClick: (address: `0x${string}`, domain: string) => void
}

function ChatListItem({ otherUser, lastMessage, unreadCount, isSelected, onClick }: ChatListItemProps) {
  const { data: primaryDomain } = usePrimaryDomain(otherUser)

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected ? "bg-muted border-primary" : "hover:bg-muted/50"
      }`}
      onClick={() => onClick(otherUser, primaryDomain || "unknown")}
    >
      <div className="flex items-center gap-3">
        <ProfileDisplay address={otherUser} compact />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">{primaryDomain}.labi</p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-1">{lastMessage.content}</p>
        </div>
      </div>
    </div>
  )
}
