export interface ProfileData {
  displayName: string
  avatar?: string
  bio?: string
  createdAt: number
}

export class IPFSService {
  // Upload profile data to IPFS via secure API route
  async uploadProfileData(profileData: ProfileData): Promise<string> {
    try {
      const response = await fetch("/api/ipfs/upload-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error(`Failed to upload to IPFS: ${response.statusText}`)
      }

      const result = await response.json()
      return result.ipfsHash
    } catch (error) {
      console.error("Error uploading to IPFS:", error)
      throw error
    }
  }

  // Upload file (avatar) to IPFS via secure API route
  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ipfs/upload-file", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to upload file to IPFS: ${response.statusText}`)
      }

      const result = await response.json()
      return result.ipfsHash
    } catch (error) {
      console.error("Error uploading file to IPFS:", error)
      throw error
    }
  }

  // Retrieve data from IPFS (this can remain client-side as it's read-only)
  async getProfileData(ipfsHash: string): Promise<ProfileData> {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching from IPFS:", error)
      throw error
    }
  }

  // Get IPFS gateway URL for files
  getGatewayUrl(ipfsHash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
  }
}

export const ipfsService = new IPFSService()
