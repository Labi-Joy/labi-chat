"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface RegisteredUser {
  name: string
  avatar: string
  address: string
}

interface RegisteredUsersListProps {
  users: RegisteredUser[]
  currentUserAddress?: string
}

export function RegisteredUsersList({ users, currentUserAddress }: RegisteredUsersListProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Users (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No users registered yet. Be the first to join!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Registered Users ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.map((user, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.avatar ? (user.avatar.startsWith('data:') ? user.avatar : `https://gateway.pinata.cloud/ipfs/${user.avatar}`) : "/placeholder.svg"}
                  alt={`${user.name}'s avatar`}
                />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.name}</span>
                  {user.address === currentUserAddress && (
                    <Badge variant="secondary" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.address.slice(0, 6)}...{user.address.slice(-4)}
                </p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
