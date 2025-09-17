"use client"

declare global {
  interface Window {
    ethereum?: any
  }
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
}

export class SimpleWeb3Service {
  private listeners: ((state: WalletState) => void)[] = []

  async connectWallet(): Promise<WalletState> {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      })

      const state: WalletState = {
        isConnected: accounts.length > 0,
        address: accounts[0] || null,
        chainId: Number.parseInt(chainId, 16),
      }

      this.notifyListeners(state)
      return state
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }

  async getWalletState(): Promise<WalletState> {
    if (typeof window === "undefined" || !window.ethereum) {
      return { isConnected: false, address: null, chainId: null }
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      })

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      })

      return {
        isConnected: accounts.length > 0,
        address: accounts[0] || null,
        chainId: Number.parseInt(chainId, 16),
      }
    } catch (error) {
      console.error("Failed to get wallet state:", error)
      return { isConnected: false, address: null, chainId: null }
    }
  }

  async disconnectWallet(): Promise<WalletState> {
    // For MetaMask, we can't programmatically disconnect
    // But we can clear the local state and notify listeners
    const state: WalletState = {
      isConnected: false,
      address: null,
      chainId: null,
    }
    
    this.notifyListeners(state)
    return state
  }

  async switchToSepolia(): Promise<void> {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia testnet
      })
    } catch (error: any) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "Sepolia Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://sepolia.infura.io/v3/"],
              blockExplorerUrls: ["https://sepolia.etherscan.io/"],
            },
          ],
        })
      } else {
        throw error
      }
    }
  }

  onStateChange(callback: (state: WalletState) => void): () => void {
    this.listeners.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(state: WalletState): void {
    this.listeners.forEach((callback) => callback(state))
  }

  // Setup event listeners for account and chain changes
  setupEventListeners(): void {
    if (typeof window === "undefined" || !window.ethereum) {
      return
    }

    window.ethereum.on("accountsChanged", async (accounts: string[]) => {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const state: WalletState = {
        isConnected: accounts.length > 0,
        address: accounts[0] || null,
        chainId: Number.parseInt(chainId, 16),
      }
      this.notifyListeners(state)
    })

    window.ethereum.on("chainChanged", (chainId: string) => {
      window.location.reload() // Recommended by MetaMask
    })
  }
}

import { useState, useEffect, useCallback } from "react"

export function useWeb3() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
  })

  useEffect(() => {
    // Initialize wallet state
    web3Service.getWalletState().then(setWalletState)

    // Setup event listeners
    web3Service.setupEventListeners()

    // Subscribe to state changes
    const unsubscribe = web3Service.onStateChange(setWalletState)

    return unsubscribe
  }, [])

  const connectWallet = useCallback(async () => {
    try {
      const state = await web3Service.connectWallet()
      setWalletState(state)
      return state
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }, [])

  const switchToSepolia = useCallback(async () => {
    try {
      await web3Service.switchToSepolia()
    } catch (error) {
      console.error("Failed to switch network:", error)
      throw error
    }
  }, [])

  const disconnectWallet = useCallback(async () => {
    try {
      const state = await web3Service.disconnectWallet()
      setWalletState(state)
      return state
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
      throw error
    }
  }, [])

  // Contract interaction functions
  const readContract = useCallback(
    async (contractAddress: string, functionName: string, args: any[] = []) => {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      try {
        // For demo purposes, return mock data based on function name
        // In production, this would use ethers.js or web3.js to interact with contracts
        console.log(`[v0] Reading contract ${contractAddress}, function: ${functionName}, args:`, args)

        switch (functionName) {
          case "isAvailable":
            return Math.random() > 0.5 // Random availability for demo
          case "registrationFee":
            return "0.01" // Mock fee
          case "getDomainsOf":
            return ["example.labi", "test.labi"] // Mock domains
          case "primaryDomain":
            return "example.labi"
          case "resolve":
            return walletState.address
          case "getProfile":
            return {
              ipfsHash: "QmExample123",
              displayName: "Demo User",
              isActive: true,
            }
          default:
            return null
        }
      } catch (error) {
        console.error("Contract read error:", error)
        throw error
      }
    },
    [walletState.address],
  )

  const writeContract = useCallback(
    async (contractAddress: string, functionName: string, args: any[] = [], value?: string) => {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      try {
        // For demo purposes, simulate transaction
        console.log(
          `[v0] Writing to contract ${contractAddress}, function: ${functionName}, args:`,
          args,
          "value:",
          value,
        )

        // Simulate transaction hash
        const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        return { hash: txHash, wait: async () => ({ status: 1 }) }
      } catch (error) {
        console.error("Contract write error:", error)
        throw error
      }
    },
    [],
  )

  return {
    // Wallet state
    isConnected: walletState.isConnected,
    account: walletState.address,
    address: walletState.address,
    chainId: walletState.chainId,

    // Actions
    connectWallet,
    disconnectWallet,
    switchToSepolia,

    // Contract interactions
    readContract,
    writeContract,
  }
}

export const web3Service = new SimpleWeb3Service()
