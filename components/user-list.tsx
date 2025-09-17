"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ProfileDisplay } from "./profile-display"
import { useAllDomains, useAllProfiles } from "@/lib/web3-hooks"
import { Users, MessageCircle } from "lucide-react"

interface UserListProps {
  onUserSelect?: (address: `0x${string}`, domain: string) => void
  selectedUser?: `0x${string}`
}

export function UserList({ onUserSelect, selectedUser }: UserListProps) {
  const { data: allDomains, isLoading: domainsLoading } = useAllDomains()
  const { data: allProfiles, isLoading: profilesLoading } = useAllProfiles()

  const [userList, setUserList] = useState<Array<{ address: `0x${string}`; domain: string }>>([])

  useEffect(() => {
    if (allDomains && allProfiles) {
      const [users, , ,] = allProfiles
      const userMap = new Map<string, string>()

      // Create a map of addresses to their first domain
      allDomains.forEach((domain) => {
        // In a real implementation, you'd resolve each domain to get the address
        // For now, we'll use the users from profiles
      })

      // Create user list from profile data
      const list = users.map((address, index) => ({
        address: address as `0x${string}`,
        domain: allDomains[index] || "unknown", // This is simplified - in reality you'd need to resolve properly
      }))

      setUserList(list)
    }
  }, [allDomains, allProfiles])

  const isLoading = domainsLoading || profilesLoading

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Members
          </CardTitle>
          <CardDescription>Loading community members...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userList.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Members
          </CardTitle>
          <CardDescription>No community members found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No registered users with profiles yet.</p>
            <p className="text-sm">Be the first to create your profile!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Members
        </CardTitle>
        <CardDescription>{userList.length} registered members</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {userList.map(({ address, domain }) => (
              <div
                key={address}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedUser === address ? "bg-muted border-primary" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <ProfileDisplay address={address} compact showDomain />
                  {onUserSelect && (
                    <Button
                      variant={selectedUser === address ? "default" : "outline"}
                      size="sm"
                      onClick={() => onUserSelect(address, domain)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
