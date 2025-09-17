# Labi Chat - Web3 Decentralized Chat DApp

A decentralized chat application built with Next.js, featuring custom .labi domain registry and IPFS-based profiles. Only users who own a .labi domain can participate in the chat network.

## 🌟 Features

- **Custom Domain Registry**: Register unique .labi domains on blockchain
- **Decentralized Profiles**: IPFS-stored user profiles with avatars
- **Wallet-Gated Access**: Only .labi domain holders can chat
- **Real-time Messaging**: Instant messaging between domain holders
- **Web3 Integration**: Built with Wagmi, Viem, and RainbowKit
- **Multi-Chain Support**: Sepolia and Lisk Sepolia testnets

## 🏗️ Architecture

### Smart Contracts
- **LabiRegistry.sol**: Manages .labi domain registration and resolution
- **UserProfiles.sol**: Links wallet addresses to IPFS profile data

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern UI components
- **Wagmi/Viem**: Ethereum interaction
- **RainbowKit**: Wallet connection

### Storage
- **IPFS (Pinata)**: Decentralized profile and avatar storage
- **Blockchain**: Domain ownership and profile hash storage
- **LocalStorage**: Demo chat message persistence

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Foundry (for smart contract deployment)
- MetaMask or compatible Web3 wallet
- Testnet ETH for Sepolia/Lisk Sepolia

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd web3-chat-dapp
npm install
\`\`\`

### 2. Environment Setup

Copy the environment template:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your environment variables:
\`\`\`env
# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract addresses (will be populated after deployment)
NEXT_PUBLIC_LABI_REGISTRY_ADDRESS=
NEXT_PUBLIC_USER_PROFILES_ADDRESS=

# Pinata IPFS credentials (get from https://pinata.cloud)
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
\`\`\`

### 3. Deploy Smart Contracts

Navigate to the contracts directory and set up Foundry:
\`\`\`bash
cd contracts
cp .env.example .env
\`\`\`

Fill in your contract deployment environment:
\`\`\`env
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
\`\`\`

Deploy contracts:
\`\`\`bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy to Sepolia testnet
./deploy.sh
\`\`\`

Copy the deployed contract addresses from `deployment-addresses.env` to your main `.env.local` file.

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 📋 User Flow

1. **Connect Wallet**: Connect MetaMask or compatible wallet
2. **Register Domain**: Choose and register a unique .labi domain
3. **Create Profile**: Set up profile with display name and avatar (stored on IPFS)
4. **Start Chatting**: Browse community members and start conversations

## 🔧 Development

### Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── chat/              # Chat interface page
│   ├── profile/           # Profile management page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── domain-*.tsx      # Domain registration components
│   ├── profile-*.tsx     # Profile management components
│   └── chat-*.tsx        # Chat interface components
├── contracts/            # Smart contracts and deployment
│   ├── LabiRegistry.sol  # Domain registry contract
│   ├── UserProfiles.sol  # Profile management contract
│   └── deploy/           # Deployment scripts
├── lib/                  # Utility libraries
│   ├── web3-config.ts    # Web3 configuration
│   ├── web3-hooks.ts     # Custom Web3 hooks
│   ├── ipfs.ts          # IPFS integration
│   └── chat-storage.ts   # Chat storage (demo)
└── scripts/              # Utility scripts
\`\`\`

### Key Components

- **WalletConnectButton**: RainbowKit wallet connection
- **DomainRegistration**: Domain registration interface
- **ProfileSetup**: IPFS profile creation
- **ChatWindow**: Real-time messaging interface
- **UserList**: Community member browser

### Custom Hooks

- `useCheckDomainAvailability`: Check if domain is available
- `useRegisterDomain`: Register new .labi domain
- `useUserProfile`: Get user profile from IPFS
- `useSetProfile`: Update user profile on IPFS

## 🌐 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

\`\`\`env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_LABI_REGISTRY_ADDRESS=deployed_registry_address
NEXT_PUBLIC_USER_PROFILES_ADDRESS=deployed_profiles_address
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
\`\`\`

## 🧪 Testing

### Local Testing

1. Use Sepolia testnet for testing
2. Get testnet ETH from faucets:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com/)

### Contract Verification

Contracts are automatically verified on Etherscan during deployment. View them at:
- Sepolia: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`

## 🔒 Security Considerations

### Smart Contract Security
- Domain ownership verification
- Input validation for domain names
- Reentrancy protection
- Access control for admin functions

### Frontend Security
- Wallet signature verification
- IPFS hash validation
- Input sanitization
- Rate limiting (recommended for production)

## 🚧 Production Considerations

### Current Demo Limitations
- Chat messages stored in localStorage (not persistent across devices)
- No real-time synchronization between users
- Basic message encryption not implemented

### Production Improvements
- WebSocket server for real-time messaging
- Message encryption and signing
- Decentralized messaging protocol (XMTP, Matrix)
- Message persistence in decentralized storage
- Push notifications
- Message search and history
- File sharing capabilities

## 🛠️ Troubleshooting

### Common Issues

**Wallet Connection Issues**
- Ensure you're on the correct network (Sepolia/Lisk Sepolia)
- Check that your wallet has testnet ETH

**Contract Interaction Failures**
- Verify contract addresses in environment variables
- Ensure sufficient gas fees
- Check network connectivity

**IPFS Upload Failures**
- Verify Pinata credentials
- Check file size limits (5MB for avatars)
- Ensure stable internet connection

### Getting Help

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure you have testnet ETH for transactions
4. Try refreshing the page and reconnecting wallet

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://rainbowkit.com)
- [Foundry Documentation](https://book.getfoundry.sh)
- [Pinata IPFS Documentation](https://docs.pinata.cloud)
