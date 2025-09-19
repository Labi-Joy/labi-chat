"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { PriceMessage, SimplePriceMessage } from "./price-message"
import { PriceBotSettings } from "./price-bot-settings"
import { chatStorage, type Message } from "@/lib/chat-storage"
import { PriceBot, createPriceBot, type ChatMessage as PriceBotMessage } from "@/lib/price-bot"
import { ArrowLeft, MessageCircle, Bot, Settings } from "lucide-react"
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
  const [priceBotMessages, setPriceBotMessages] = useState<PriceBotMessage[]>([])
  const [priceBot, setPriceBot] = useState<PriceBot | null>(null)
  const [showPriceBotSettings, setShowPriceBotSettings] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentUser?.address) {
      const bot = createPriceBot((message: PriceBotMessage) => {
        setPriceBotMessages(prev => [...prev, message])
      })
      setPriceBot(bot)
      bot.start()
      
      return () => {
        bot.stop()
      }
    }
  }, [currentUser?.address])

  useEffect(() => {
    if (currentUser?.address) {
      const loadedMessages = chatStorage.getMessages(currentUser.address, otherUser.address)
      setMessages(loadedMessages)
    }
  }, [currentUser?.address, otherUser.address])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, priceBotMessages])

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

    chatStorage.addMessage(newMessage)
    setMessages((prev) => [...prev, newMessage])
    toast.success("Message sent!")
  }

  const handlePriceBotConfigChange = (newConfig: Partial<PriceBotConfig>) => {
    if (priceBot) {
      priceBot.updateConfig(newConfig)
      toast.success("Price bot settings updated!")
    }
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
    <>
      {showPriceBotSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <PriceBotSettings
            priceBot={priceBot}
            onConfigChange={handlePriceBotConfigChange}
            onClose={() => setShowPriceBotSettings(false)}
          />
        </div>
      )}
      
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
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowPriceBotSettings(!showPriceBotSettings)}
              className={priceBot?.isRunning() ? "text-green-600" : "text-gray-400"}
            >
              <Bot className="h-4 w-4" />
            </Button>
            {priceBot?.isRunning() && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Price Bot Active" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && priceBotMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet.</p>
                <p className="text-sm">Start the conversation!</p>
                <p className="text-xs mt-2">Price bot will send updates automatically</p>
              </div>
            ) : (
              <>
                {[...messages.map(m => ({ ...m, type: 'user' as const })), ...priceBotMessages]
                  .sort((a, b) => a.timestamp - b.timestamp)
                  .map((message, index, allMessages) => {
                    if (message.type === 'price-bot') {
                      const priceBotMessage = message as PriceBotMessage
                      return (
                        <div key={priceBotMessage.id} className="flex justify-center">
                          <SimplePriceMessage 
                            priceData={priceBotMessage.priceData || []} 
                            timestamp={priceBotMessage.timestamp}
                          />
                        </div>
                      )
                    } else {
                      const userMessage = message as Message & { type: 'user' }
                      const isOwn = userMessage.from === currentUser.address
                      const showAvatar = index === 0 || allMessages[index - 1].type !== 'user' || 
                        (allMessages[index - 1].type === 'user' && (allMessages[index - 1] as Message).from !== userMessage.from)

                      return <ChatMessage key={userMessage.id} message={userMessage} isOwn={isOwn} showAvatar={showAvatar} />
                    }
                  })}
              </>
            )}
          </div>
        </ScrollArea>

        <ChatInput onSendMessage={handleSendMessage} placeholder={`Message ${otherUser.name}...`} />
      </CardContent>
    </Card>
    </>
  )
}
