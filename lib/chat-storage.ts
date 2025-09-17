// Simple chat storage using localStorage for demo purposes
// In production, this would be replaced with a proper backend/WebSocket solution

export interface Message {
  id: string
  from: `0x${string}`
  to: `0x${string}`
  content: string
  timestamp: number
  signature?: string
}

export interface ChatRoom {
  participants: [`0x${string}`, `0x${string}`]
  messages: Message[]
  lastActivity: number
}

class ChatStorage {
  private storageKey = "labi-chat-messages"

  // Get all chat rooms for a user
  getChatRooms(userAddress: `0x${string}`): ChatRoom[] {
    const data = localStorage.getItem(this.storageKey)
    if (!data) return []

    try {
      const allRooms: ChatRoom[] = JSON.parse(data)
      return allRooms.filter((room) => room.participants.includes(userAddress))
    } catch {
      return []
    }
  }

  // Get messages between two users
  getMessages(user1: `0x${string}`, user2: `0x${string}`): Message[] {
    const rooms = this.getChatRooms(user1)
    const room = rooms.find(
      (r) =>
        (r.participants[0] === user1 && r.participants[1] === user2) ||
        (r.participants[0] === user2 && r.participants[1] === user1),
    )
    return room?.messages || []
  }

  // Add a new message
  addMessage(message: Message): void {
    const data = localStorage.getItem(this.storageKey)
    let allRooms: ChatRoom[] = []

    if (data) {
      try {
        allRooms = JSON.parse(data)
      } catch {
        allRooms = []
      }
    }

    // Find existing room or create new one
    const roomIndex = allRooms.findIndex(
      (r) =>
        (r.participants[0] === message.from && r.participants[1] === message.to) ||
        (r.participants[0] === message.to && r.participants[1] === message.from),
    )

    if (roomIndex >= 0) {
      // Add to existing room
      allRooms[roomIndex].messages.push(message)
      allRooms[roomIndex].lastActivity = message.timestamp
    } else {
      // Create new room
      const newRoom: ChatRoom = {
        participants: [message.from, message.to],
        messages: [message],
        lastActivity: message.timestamp,
      }
      allRooms.push(newRoom)
    }

    localStorage.setItem(this.storageKey, JSON.stringify(allRooms))
  }

  // Get recent chats for a user
  getRecentChats(userAddress: `0x${string}`): Array<{
    otherUser: `0x${string}`
    lastMessage: Message
    unreadCount: number
  }> {
    const rooms = this.getChatRooms(userAddress)
    return rooms
      .map((room) => {
        const otherUser = room.participants.find((p) => p !== userAddress)!
        const lastMessage = room.messages[room.messages.length - 1]
        // For demo purposes, we'll assume all messages are read
        const unreadCount = 0

        return {
          otherUser,
          lastMessage,
          unreadCount,
        }
      })
      .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp)
  }

  // Clear all chat data (for demo/testing)
  clearAllChats(): void {
    localStorage.removeItem(this.storageKey)
  }
}

export const chatStorage = new ChatStorage()
