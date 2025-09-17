"use client"

import { useAccount } from "wagmi"
import { ProfileSetup } from "@/components/profile-setup"
import { ProfileDisplay } from "@/components/profile-display"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUserDomains, useHasProfile } from "@/lib/web3-hooks"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Loading...</CardTitle>
              <CardDescription>Please wait while we load your profile</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <ProfileContent />
}

function ProfileContent() {
  const { address, isConnected } = useAccount()
  const { data: userDomains } = useUserDomains(address)
  const { data: hasProfile } = useHasProfile(address)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>You need to connect your wallet to manage your profile</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <WalletConnectButton />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const hasDomains = userDomains && userDomains.length > 0

  if (!hasDomains) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Domain Required</CardTitle>
              <CardDescription>You need to register a .labi domain before creating your profile</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Link href="/">
                <Button>Register Domain</Button>
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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <h1 className="text-xl font-bold">Profile Management</h1>
              </div>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">
              {hasProfile ? "Manage your decentralized profile" : "Create your decentralized profile"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <ProfileSetup />
            </div>
            <div className="space-y-6">
              {address && <ProfileDisplay address={address} />}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Decentralized storage on IPFS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Blockchain-verified ownership</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Linked to your .labi domain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span>Accessible across the network</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

