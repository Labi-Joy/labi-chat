"use client"

import { useWeb3 } from "@/lib/web3-simple"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUserDomains, usePrimaryDomain } from "@/lib/web3-hooks"
import { User, Globe } from "lucide-react"

export function DomainStatus() {
  const { address } = useWeb3()
  const { data: userDomains, isLoading: domainsLoading } = useUserDomains(address)
  const { data: primaryDomain, isLoading: primaryLoading } = usePrimaryDomain(address)

  if (!address) {
    return null
  }

  const hasDomains = userDomains && userDomains.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Domain Status
        </CardTitle>
        <CardDescription>Your current domain registration status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Registration Status:</span>
          {domainsLoading ? (
            <Badge variant="outline">Loading...</Badge>
          ) : hasDomains ? (
            <Badge variant="default" className="bg-green-600">
              Registered
            </Badge>
          ) : (
            <Badge variant="destructive">Not Registered</Badge>
          )}
        </div>

        {hasDomains && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Primary Domain:</span>
              {primaryLoading ? (
                <Badge variant="outline">Loading...</Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {primaryDomain}.labi
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">All Domains:</span>
              <div className="flex flex-wrap gap-2">
                {userDomains.map((domain) => (
                  <Badge key={domain} variant="outline" className="text-xs">
                    {domain}.labi
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {!hasDomains && !domainsLoading && (
          <div className="text-sm text-muted-foreground">
            You need to register a .labi domain to access the chat features.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
