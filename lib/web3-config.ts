import { http, createConfig } from "wagmi"
import { sepolia } from "wagmi/chains"
import { injected, metaMask, walletConnect } from "wagmi/connectors"

// Custom Lisk Sepolia chain configuration
export const liskSepolia = {
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia-api.lisk.com"],
    },
  },
  blockExplorers: {
    default: { name: "Lisk Sepolia Explorer", url: "https://sepolia-blockscout.lisk.com" },
  },
  testnet: true,
} as const

export const config = createConfig({
  chains: [sepolia, liskSepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id",
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [liskSepolia.id]: http(),
  },
})

// Contract addresses (will be populated after deployment)
export const CONTRACTS = {
  LABI_REGISTRY: process.env.NEXT_PUBLIC_LABI_REGISTRY_ADDRESS || "",
  USER_PROFILES: process.env.NEXT_PUBLIC_USER_PROFILES_ADDRESS || "",
} as const

// Contract ABIs
export const LABI_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "register",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "resolve",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "isAvailable",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllDomains",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "getDomainsOf",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "getDomainInfo",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "registeredAt", type: "uint256" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registrationFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "primaryDomain",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "name", type: "string" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "DomainRegistered",
    type: "event",
  },
] as const

export const USER_PROFILES_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_ipfsHash", type: "string" },
      { internalType: "string", name: "_displayName", type: "string" },
    ],
    name: "setProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getProfile",
    outputs: [
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "string", name: "displayName", type: "string" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "domainName", type: "string" }],
    name: "getProfileByDomain",
    outputs: [
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "string", name: "displayName", type: "string" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "hasProfile",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllProfiles",
    outputs: [
      { internalType: "address[]", name: "users", type: "address[]" },
      { internalType: "string[]", name: "ipfsHashes", type: "string[]" },
      { internalType: "string[]", name: "displayNames", type: "string[]" },
      { internalType: "uint256[]", name: "updatedAts", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "string", name: "ipfsHash", type: "string" },
      { indexed: false, internalType: "string", name: "displayName", type: "string" },
    ],
    name: "ProfileUpdated",
    type: "event",
  },
] as const
