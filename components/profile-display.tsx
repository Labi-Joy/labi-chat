"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Calendar, Globe } from "lucide-react"
import { useUserProfile, usePrimaryDomain } from "@/lib/web3-hooks"
import { ipfsService, type ProfileData } from "@/lib/ipfs"
import { formatDistanceToNow } from "date-fns"

interface ProfileDisplayProps {
  address: `0x${string}`
  showDomain?: boolean
  compact?: boolean
}

export function ProfileDisplay({ address, showDomain = true, compact = false }: ProfileDisplayProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoadingIPFS, setIsLoadingIPFS] = useState(false)

  const { data: profile, isLoading: profileLoading } = useUserProfile(address)
  const { data: primaryDomain, isLoading: domainLoading } = usePrimaryDomain(address)

  // Load profile data from IPFS
  useEffect(() => {
    if (profile && profile[3] && profile[0]) {
      // Profile exists and has IPFS hash
      const ipfsHash = profile[0]
      setIsLoadingIPFS(true)

      ipfsService
        .getProfileData(ipfsHash)
        .then((data) => {
          setProfileData(data)
        })
        .catch((err) => {
          console.error("Error loading profile from IPFS:", err)
        })
        .finally(() => {
          setIsLoadingIPFS(false)
        })
    }
  }, [profile])

  const isLoading = profileLoading || domainLoading || isLoadingIPFS

  if (isLoading) {
    return (
      <Card className={compact ? "p-4" : ""}>
        <CardContent className={compact ? "p-0" : ""}>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile || !profile[3]) {
    return (
      <Card className={compact ? "p-4" : ""}>
        <CardContent className={compact ? "p-0" : ""}>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">No Profile</p>
              <p className="text-sm text-muted-foreground">Profile not set up</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const [, displayName, updatedAt] = profile
  const avatarUrl = profileData?.avatar ? ipfsService.getGatewayUrl(profileData.avatar) : ""

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{displayName}</p>
          {showDomain && primaryDomain && (
            <p className="text-sm text-muted-foreground truncate">{primaryDomain}.labi</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
            <AvatarFallback className="text-lg">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1">
            <div>
              <h3 className="font-semibold text-lg">{displayName}</h3>
              {showDomain && primaryDomain && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  {primaryDomain}.labi
                </div>
              )}
            </div>
            {profileData?.bio && <p className="text-sm text-muted-foreground leading-relaxed">{profileData.bio}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated {formatDistanceToNow(new Date(Number(updatedAt) * 1000), { addSuffix: true })}
          </div>
          <Badge variant="outline" className="text-xs">
            IPFS Verified
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
