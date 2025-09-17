"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/lib/web3-simple"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { RegisteredUsersList } from "@/components/registered-users-list"
import { ChatWindow } from "@/components/chat-window"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"

interface RegisteredUser {
  name: string
  avatar: string
  address: string
}

export default function ChatPage() {
  const { address, isConnected } = useWeb3()
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null)
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null)

  useEffect(() => {
    let users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    
    // Add dummy user if it doesn't exist
    const dummyUserExists = users.some((user: RegisteredUser) => user.name === "Alice")
    if (!dummyUserExists) {
      const dummyUser: RegisteredUser = {
        name: "Alice",
        avatar: "/placeholder-user.jpg", // Using placeholder image
        address: "0x1234567890123456789012345678901234567890" // Dummy address
      }
      users = [...users, dummyUser]
      localStorage.setItem("registeredUsers", JSON.stringify(users))
    }
    
    setRegisteredUsers(users)

    if (address) {
      const existingUser = users.find((user: RegisteredUser) => user.address === address)
      setCurrentUser(existingUser || null)
    }
  }, [address])

  const handleUserSelect = (user: RegisteredUser) => {
    setSelectedUser(user)
  }

  const handleBackToList = () => {
    setSelectedUser(null)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>You need to connect your wallet to access the chat</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <WalletConnectButton />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Registration Required</CardTitle>
              <CardDescription>You need to register before you can access the chat</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Link href="/">
                <Button>Register Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h1 className="text-xl font-bold">Labi Chat</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Logged in as: <span className="font-medium">{currentUser.name}</span>
              </span>
              <ThemeToggle />
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {selectedUser ? (
            /* Chat Window View with simplified user data */
            <div className="h-[calc(100vh-200px)]">
              <ChatWindow currentUser={currentUser} otherUser={selectedUser} onBack={handleBackToList} />
            </div>
          ) : (
            /* User List View */
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Welcome to the Chat Room</h1>
                <p className="text-muted-foreground">
                  Select a user to start chatting. {registeredUsers.length} users registered.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select a User to Chat With</CardTitle>
                      <CardDescription>Click on any registered user to start a conversation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {registeredUsers
                          .filter((user) => user.address !== address)
                          .map((user, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer border"
                              onClick={() => handleUserSelect(user)}
                            >
                              <img
                                src={
                                  user.avatar ? (user.avatar.startsWith('data:') ? user.avatar : `https://gateway.pinata.cloud/ipfs/${user.avatar}`) : "/placeholder.svg"
                                }
                                alt={`${user.name}'s avatar`}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="font-medium">{user.name}</div>
                                <p className="text-xs text-muted-foreground">
                                  {user.address.slice(0, 6)}...{user.address.slice(-4)}
                                </p>
                              </div>
                              <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
                            </div>
                          ))}

                        {registeredUsers.filter((user) => user.address !== address).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No other users registered yet. Invite friends to join!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <RegisteredUsersList users={registeredUsers} currentUserAddress={address} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
