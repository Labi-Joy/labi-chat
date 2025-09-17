"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useWeb3 } from "@/lib/web3-simple"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AiOutlineLoading3Quarters,
  AiOutlineUpload,
  AiOutlineUser,
  AiOutlineCamera,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai"
import { toast } from "sonner"

interface UserRegistrationProps {
  onRegistrationComplete: (userData: { name: string; avatar: string; address: string }) => void
  existingUsers: Array<{ name: string; avatar: string; address: string }>
}

export function UserRegistration({ onRegistrationComplete, existingUsers }: UserRegistrationProps) {
  const { address, isConnected } = useWeb3()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isRegistering, setIsRegistering] = useState(false)

  // Check if name is already taken
  const isNameTaken = (inputName: string) => {
    return existingUsers.some((user) => user.name.toLowerCase() === inputName.toLowerCase())
  }

  // Validate name
  const isValidName = (inputName: string) => {
    return inputName.length >= 3 && inputName.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(inputName)
  }

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

    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!name.trim()) {
      toast.error("Name is required")
      return
    }

    if (!isValidName(name)) {
      toast.error("Name must be 3-20 characters and contain only letters, numbers, underscores, and hyphens")
      return
    }

    if (isNameTaken(name)) {
      toast.error("This name is already taken. Please choose a different name.")
      return
    }

    if (!avatarFile) {
      toast.error("Please select an avatar image")
      return
    }

    setIsRegistering(true)

    try {
      const userData = {
        name: name.trim(),
        avatar: avatarPreview, // Use the base64 preview directly
        address: address,
      }

      // Store in localStorage for demo purposes
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      registeredUsers.push(userData)
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

      toast.success(`Welcome ${name}! You're now registered.`)
      onRegistrationComplete(userData)
    } catch (err) {
      console.error("Registration error:", err)
      toast.error("Failed to register. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  const getNameStatus = () => {
    if (!name || name.length < 3) return null

    if (!isValidName(name)) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <AiOutlineCloseCircle className="h-4 w-4" />
          Invalid name format
        </div>
      )
    }

    if (isNameTaken(name)) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <AiOutlineCloseCircle className="h-4 w-4" />
          Name already taken
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 text-green-600">
        <AiOutlineCheckCircle className="h-4 w-4" />
        Name available
      </div>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AiOutlineUser className="h-5 w-5" />
          Register to Chat
        </CardTitle>
        <CardDescription>Choose your display name and avatar to join the chat</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-4">
            <Label>Avatar *</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
                <AvatarFallback className="text-lg">
                  {name ? name.charAt(0).toUpperCase() : <AiOutlineCamera className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRegistering}
                >
                  <AiOutlineUpload className="mr-2 h-4 w-4" />
                  {avatarFile ? "Change Image" : "Upload Image"}
                </Button>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Display Name *</Label>
            <Input
              id="name"
              placeholder="Enter your name (3-20 characters)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              disabled={isRegistering}
            />
            <div className="flex items-center justify-between">
              {getNameStatus()}
              <p className="text-xs text-muted-foreground">{name.length}/20 characters</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              isRegistering || !name.trim() || !isValidName(name) || isNameTaken(name) || !avatarFile || !isConnected
            }
            className="w-full"
            size="lg"
          >
            {isRegistering ? (
              <>
                <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register & Join Chat"
            )}
          </Button>

          {/* Info Alert */}
          <Alert>
            <AlertDescription>
              Your avatar will be stored locally for this demo. Choose a unique name that others will see in the chat.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  )
}
