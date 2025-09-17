"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/lib/web3-simple"
import { formatEther } from "viem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Search } from "lucide-react"
import { useCheckDomainAvailability, useRegistrationFee, useRegisterDomain, useUserDomains } from "@/lib/web3-hooks"
import { toast } from "sonner"

export function DomainRegistration() {
  const { address } = useWeb3()
  const [domainName, setDomainName] = useState("")
  const [debouncedDomainName, setDebouncedDomainName] = useState("")

  // Debounce domain name input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDomainName(domainName)
    }, 500)

    return () => clearTimeout(timer)
  }, [domainName])

  const { data: isAvailable, isLoading: checkingAvailability } = useCheckDomainAvailability(debouncedDomainName)
  const { data: registrationFee } = useRegistrationFee()
  const { data: userDomains, refetch: refetchUserDomains } = useUserDomains(address)
  const { registerDomain, isPending, isConfirming, isConfirmed, error } = useRegisterDomain()

  const isValidDomainName = (name: string) => {
    return /^[a-zA-Z0-9-]{3,20}$/.test(name) && !name.startsWith("-") && !name.endsWith("-")
  }

  const handleRegister = async () => {
    if (!domainName || !registrationFee || !isValidDomainName(domainName)) {
      toast.error("Please enter a valid domain name")
      return
    }

    if (!isAvailable) {
      toast.error("Domain is not available")
      return
    }

    try {
      await registerDomain(domainName, registrationFee)
    } catch (err) {
      console.error("Registration error:", err)
      toast.error("Failed to register domain")
    }
  }

  // Handle successful registration
  useEffect(() => {
    if (isConfirmed) {
      toast.success(`Successfully registered ${domainName}.labi!`)
      setDomainName("")
      refetchUserDomains()
    }
  }, [isConfirmed, domainName, refetchUserDomains])

  // Handle registration error
  useEffect(() => {
    if (error) {
      toast.error("Registration failed. Please try again.")
    }
  }, [error])

  const getAvailabilityStatus = () => {
    if (!debouncedDomainName || !isValidDomainName(debouncedDomainName)) {
      return null
    }

    if (checkingAvailability) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking availability...
        </div>
      )
    }

    if (isAvailable) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          Available
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 text-red-600">
        <XCircle className="h-4 w-4" />
        Not available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Register Your .labi Domain
          </CardTitle>
          <CardDescription>
            Register a unique .labi domain to join the decentralized chat network. Only domain holders can participate
            in conversations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter domain name"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="pr-16"
                  maxLength={20}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">.labi</div>
              </div>
            </div>

            {debouncedDomainName && (
              <div className="flex items-center justify-between">
                {getAvailabilityStatus()}
                {registrationFee && (
                  <div className="text-sm text-muted-foreground">Fee: {formatEther(registrationFee)} ETH</div>
                )}
              </div>
            )}

            {!isValidDomainName(domainName) && domainName && (
              <Alert>
                <AlertDescription>
                  Domain name must be 3-20 characters long and contain only letters, numbers, and hyphens (not at the
                  start or end).
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            onClick={handleRegister}
            disabled={
              !domainName ||
              !isValidDomainName(domainName) ||
              !isAvailable ||
              isPending ||
              isConfirming ||
              checkingAvailability
            }
            className="w-full"
            size="lg"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirming..." : "Processing..."}
              </>
            ) : (
              `Register ${domainName || "domain"}.labi`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* User's existing domains */}
      {userDomains && userDomains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Domains</CardTitle>
            <CardDescription>Domains you currently own</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userDomains.map((domain) => (
                <Badge key={domain} variant="secondary" className="text-sm">
                  {domain}.labi
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
