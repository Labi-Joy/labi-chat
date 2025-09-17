"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, User, Camera } from "lucide-react"
import { useUserProfile, useSetProfile, useHasProfile } from "@/lib/web3-hooks"
import { ipfsService, type ProfileData } from "@/lib/ipfs"
import { toast } from "sonner"

export function ProfileSetup() {
  const { address } = useAccount()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const { data: hasProfile } = useHasProfile(address)
  const { data: existingProfile, refetch: refetchProfile } = useUserProfile(address)
  const { setProfile, isPending, isConfirming, isConfirmed, error } = useSetProfile()

  // Load existing profile data
  useEffect(() => {
    if (existingProfile && existingProfile[3]) {
      // Profile exists
      const [ipfsHash, profileDisplayName] = existingProfile
      setDisplayName(profileDisplayName)

      // Load profile data from IPFS
      if (ipfsHash) {
        ipfsService
          .getProfileData(ipfsHash)
          .then((profileData) => {
            setBio(profileData.bio || "")
            if (profileData.avatar) {
              setAvatarPreview(ipfsService.getGatewayUrl(profileData.avatar))
            }
          })
          .catch((err) => {
            console.error("Error loading profile from IPFS:", err)
          })
      }
    }
  }, [existingProfile])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB")
        return
      }

      setAvatarFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim()) {
      toast.error("Display name is required")
      return
    }

    if (displayName.length > 50) {
      toast.error("Display name must be 50 characters or less")
      return
    }

    setIsUploading(true)

    try {
      let avatarHash = ""

      // Upload avatar to IPFS if provided
      if (avatarFile) {
        toast.info("Uploading avatar to IPFS...")
        avatarHash = await ipfsService.uploadFile(avatarFile)
      }

      // Prepare profile data
      const profileData: ProfileData = {
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatar: avatarHash,
        createdAt: Date.now(),
      }

      // Upload profile data to IPFS
      toast.info("Uploading profile to IPFS...")
      const profileHash = await ipfsService.uploadProfileData(profileData)

      // Save to blockchain
      toast.info("Saving profile to blockchain...")
      await setProfile(profileHash, displayName.trim())
    } catch (err) {
      console.error("Profile setup error:", err)
      toast.error("Failed to create profile. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle successful profile creation
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Profile created successfully!")
      refetchProfile()
    }
  }, [isConfirmed, refetchProfile])

  // Handle profile creation error
  useEffect(() => {
    if (error) {
      toast.error("Failed to save profile to blockchain")
    }
  }, [error])

  const isLoading = isUploading || isPending || isConfirming

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {hasProfile ? "Update Profile" : "Create Your Profile"}
        </CardTitle>
        <CardDescription>
          {hasProfile
            ? "Update your profile information and avatar stored on IPFS"
            : "Set up your profile with display name and avatar. This information will be stored on IPFS."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-4">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Profile preview" />
                <AvatarFallback className="text-lg">
                  {displayName ? displayName.charAt(0).toUpperCase() : <Camera className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {avatarFile ? "Change Image" : "Upload Image"}
                </Button>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">{displayName.length}/50 characters</p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell others about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">{bio.length}/200 characters</p>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading || !displayName.trim()} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? "Uploading to IPFS..." : isPending ? "Confirming..." : "Processing..."}
              </>
            ) : hasProfile ? (
              "Update Profile"
            ) : (
              "Create Profile"
            )}
          </Button>

          {/* Info Alert */}
          <Alert>
            <AlertDescription>
              Your profile data will be stored on IPFS (InterPlanetary File System) for decentralized storage. The IPFS
              hash will be saved to the blockchain, ensuring your profile is permanently accessible.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  )
}
