"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useWeb3 } from "@/lib/web3-simple"

export function WalletConnectButton() {
  const { isConnected, address, chainId, connectWallet, disconnectWallet, switchToSepolia } = useWeb3()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      // Clear localStorage to reset the app state
      localStorage.removeItem("registeredUsers")
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchToSepolia()
    } catch (error) {
      console.error("Failed to switch network:", error)
    }
  }

  if (isConnected && address) {
    const isWrongNetwork = chainId !== 11155111 // Sepolia chainId

    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        {isWrongNetwork && (
          <Button onClick={handleSwitchNetwork} variant="destructive" size="sm">
            Switch to Sepolia
          </Button>
        )}
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      size="lg"
      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
