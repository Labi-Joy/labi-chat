"use client"

import { useWeb3 } from "@/lib/web3-simple"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { UserRegistration } from "@/components/user-registration"
import { RegisteredUsersList } from "@/components/registered-users-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IoChatbubbleEllipsesOutline, IoGlobeOutline, IoShieldCheckmarkOutline, IoPeopleOutline } from "react-icons/io5"
import Link from "next/link"
import { useEffect, useState } from "react"

interface RegisteredUser {
  name: string
  avatar: string
  address: string
}

export default function HomePage() {
  const { address, isConnected } = useWeb3()
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null)

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

    // Check if current user is already registered
    if (address) {
      const existingUser = users.find((user: RegisteredUser) => user.address === address)
      setCurrentUser(existingUser || null)
    }
  }, [address])

  const handleRegistrationComplete = (userData: RegisteredUser) => {
    setRegisteredUsers((prev) => [...prev, userData])
    setCurrentUser(userData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <IoChatbubbleEllipsesOutline className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold">Labi Chat</h1>
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          /* Landing Page for Non-Connected Users */
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Decentralized Chat
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
                  Simple Registration, Instant Chat
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join the future of messaging with a simple registration process. Just choose your name and avatar to
                  start chatting with other users instantly.
                </p>
              </div>
              <WalletConnectButton />
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <IoPeopleOutline className="h-8 w-8 mx-auto text-blue-600" />
                  <CardTitle className="text-lg">Simple Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Just choose your name (3-20 characters) and upload an avatar to get started.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <IoShieldCheckmarkOutline className="h-8 w-8 mx-auto text-green-600" />
                  <CardTitle className="text-lg">Unique Names</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Each name is unique - no two users can have the same display name.</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <IoGlobeOutline className="h-8 w-8 mx-auto text-purple-600" />
                  <CardTitle className="text-lg">IPFS Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Your avatar is stored on IPFS for decentralized, permanent access.</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <IoChatbubbleEllipsesOutline className="h-8 w-8 mx-auto text-orange-600" />
                  <CardTitle className="text-lg">Real-time Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Instant messaging with event-driven updates and graceful chat handling.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* How it Works */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">How It Works</CardTitle>
                <CardDescription>Get started in two simple steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="font-semibold">Connect & Register</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your wallet, choose a unique name (3-20 characters), and upload your avatar
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-green-600">2</span>
                    </div>
                    <h3 className="font-semibold">Start Chatting</h3>
                    <p className="text-sm text-muted-foreground">
                      Join the registered users list and start messaging instantly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Dashboard for Connected Users */
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Welcome to Labi Chat</h1>
              <p className="text-muted-foreground">
                {currentUser
                  ? `Welcome back, ${currentUser.name}! Ready to chat?`
                  : "Register with your name and avatar to start chatting."}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                {!currentUser ? (
                  <UserRegistration
                    onRegistrationComplete={handleRegistrationComplete}
                    existingUsers={registeredUsers}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Ready to Chat!</CardTitle>
                      <CardDescription>You're registered as {currentUser.name}. Join the conversation!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Link href="/chat">
                        <Button className="w-full" size="lg">
                          <IoChatbubbleEllipsesOutline className="mr-2 h-4 w-4" />
                          Enter Chat Room
                        </Button>
                      </Link>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Registered as: <span className="font-medium">{currentUser.name}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <RegisteredUsersList users={registeredUsers} currentUserAddress={address} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white">
                <IoChatbubbleEllipsesOutline className="h-4 w-4" />
              </div>
              <span className="font-semibold">Labi Chat</span>
            </div>
            <p className="text-sm text-muted-foreground">Decentralized messaging powered by blockchain technology</p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Built on Ethereum</span>
              <span>•</span>
              <span>IPFS Storage</span>
              <span>•</span>
              <span>Web3 Native</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
