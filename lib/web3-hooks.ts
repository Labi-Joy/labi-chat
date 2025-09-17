import { useWeb3 } from "./web3-simple"

// Hook for checking domain availability
export function useCheckDomainAvailability(domainName: string) {
  const { readContract } = useWeb3()

  const checkAvailability = async () => {
    if (!domainName || domainName.length < 3) return null

    try {
      const result = await readContract(process.env.NEXT_PUBLIC_LABI_REGISTRY_ADDRESS!, "isAvailable", [domainName])
      return result
    } catch (error) {
      console.error("Error checking domain availability:", error)
      return null
    }
  }

  return { checkAvailability }
}

// Hook for getting registration fee
export function useRegistrationFee() {
  const { readContract } = useWeb3()

  const getRegistrationFee = async () => {
    try {
      const result = await readContract(process.env.NEXT_PUBLIC_LABI_REGISTRY_ADDRESS!, "registrationFee", [])
      return result
    } catch (error) {
      console.error("Error getting registration fee:", error)
      return null
    }
  }

  return { getRegistrationFee }
}

// Hook for registering a domain
export function useRegisterDomain() {
  const { writeContract } = useWeb3()

  const registerDomain = async (domainName: string, registrationFee: string) => {
    try {
      const result = await writeContract(
        process.env.NEXT_PUBLIC_LABI_REGISTRY_ADDRESS!,
        "register",
        [domainName],
        registrationFee,
      )
      return result
    } catch (error) {
      console.error("Error registering domain:", error)
      throw error
    }
  }

  return { registerDomain }
}

// Hook for getting user's domains
export function useUserDomains(address: string | undefined) {
  const { readContract } = useWeb3()

  const getUserDomains = async () => {
    if (!address) return []

    try {
      const result = await readContract(process.env.NEXT_PUBLIC_LABI_REGISTRY_ADDRESS!, "getDomainsOf", [address])
      return result || []
    } catch (error) {
      console.error("Error getting user domains:", error)
      return []
    }
  }

  return { getUserDomains, data: [] }
}

// Hook for getting user's primary domain
export function usePrimaryDomain(address: string | undefined) {
  const { readContract } = useWeb3()

  const getPrimaryDomain = async () => {
    if (!address) return null

    try {
      const result = await readContract(process.env.NEXT_PUBLIC_LABI_REGISTRY_ADDRESS!, "primaryDomain", [address])
      return result
    } catch (error) {
      console.error("Error getting primary domain:", error)
      return null
    }
  }

  return { getPrimaryDomain }
}

// Hook for resolving domain to address
export function useResolveDomain(domainName: string) {
  const { readContract } = useWeb3()

  const resolveDomain = async () => {
    if (!domainName) return null

    try {
      const result = await readContract(process.env.NEXT_PUBLIC_LABI_REGISTRY_ADDRESS!, "resolve", [domainName])
      return result
    } catch (error) {
      console.error("Error resolving domain:", error)
      return null
    }
  }

  return { resolveDomain }
}

// Hook for getting user profile
export function useUserProfile(address: string | undefined) {
  const { readContract } = useWeb3()

  const getUserProfile = async () => {
    if (!address) return null

    try {
      const result = await readContract(process.env.NEXT_PUBLIC_USER_PROFILES_ADDRESS!, "getProfile", [address])
      return result
    } catch (error) {
      console.error("Error getting user profile:", error)
      return null
    }
  }

  return { getUserProfile }
}

// Hook for setting user profile
export function useSetProfile() {
  const { writeContract } = useWeb3()

  const setProfile = async (ipfsHash: string, displayName: string) => {
    try {
      const result = await writeContract(process.env.NEXT_PUBLIC_USER_PROFILES_ADDRESS!, "setProfile", [
        ipfsHash,
        displayName,
      ])
      return result
    } catch (error) {
      console.error("Error setting profile:", error)
      throw error
    }
  }

  return { setProfile }
}

// Hook for checking if user has a profile
export function useHasProfile(address: string | undefined) {
  const { readContract } = useWeb3()

  const hasProfile = async () => {
    if (!address) return false

    try {
      const result = await readContract(process.env.NEXT_PUBLIC_USER_PROFILES_ADDRESS!, "getProfile", [address])
      return result && result.isActive
    } catch (error) {
      console.error("Error checking if user has profile:", error)
      return false
    }
  }

  return { hasProfile }
}

// Hook for getting all registered domains
export function useAllDomains() {
  const { readContract } = useWeb3()

  const getAllDomains = async () => {
    try {
      const result = await readContract(process.env.NEXT_PUBLIC_LABI_REGISTRY_ADDRESS!, "getAllDomains", [])
      return result || []
    } catch (error) {
      console.error("Error getting all domains:", error)
      return []
    }
  }

  return { getAllDomains }
}

// Hook for getting all user profiles
export function useAllProfiles() {
  const { readContract } = useWeb3()

  const getAllProfiles = async () => {
    try {
      const result = await readContract(process.env.NEXT_PUBLIC_USER_PROFILES_ADDRESS!, "getAllProfiles", [])
      return result || []
    } catch (error) {
      console.error("Error getting all profiles:", error)
      return []
    }
  }

  return { getAllProfiles }
}
