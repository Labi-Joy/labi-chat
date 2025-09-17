import { type NextRequest, NextResponse } from "next/server"

export interface ProfileData {
  displayName: string
  avatar?: string
  bio?: string
  createdAt: number
}

export async function GET() {
  return NextResponse.json({ message: "IPFS profile upload endpoint" })
}

export async function POST(request: NextRequest) {
  try {
    const profileData: ProfileData = await request.json()

    const pinataJWT = process.env.PINATA_JWT

    if (!pinataJWT) {
      return NextResponse.json({ error: "IPFS service not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: JSON.stringify({
        pinataContent: profileData,
        pinataMetadata: {
          name: `profile-${profileData.displayName}-${Date.now()}`,
          keyvalues: {
            type: "profile",
            displayName: profileData.displayName,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to upload to IPFS: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json({ ipfsHash: result.IpfsHash })
  } catch (error) {
    console.error("Error uploading to IPFS:", error)
    return NextResponse.json({ error: "Failed to upload to IPFS" }, { status: 500 })
  }
}
