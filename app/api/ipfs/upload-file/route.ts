import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "IPFS upload endpoint" })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const pinataJWT = process.env.PINATA_JWT

    if (!pinataJWT) {
      return NextResponse.json({ error: "IPFS service not configured" }, { status: 500 })
    }

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)
    uploadFormData.append(
      "pinataMetadata",
      JSON.stringify({
        name: `avatar-${file.name}-${Date.now()}`,
        keyvalues: {
          type: "avatar",
        },
      }),
    )

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: uploadFormData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload file to IPFS: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json({ ipfsHash: result.IpfsHash })
  } catch (error) {
    console.error("Error uploading file to IPFS:", error)
    return NextResponse.json({ error: "Failed to upload file to IPFS" }, { status: 500 })
  }
}
