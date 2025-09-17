"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { WagmiProvider } from "wagmi"
import { config } from "@/lib/wagmi"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </WagmiProvider>
  )
}