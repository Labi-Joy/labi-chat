# Deployment Guide

This guide walks you through deploying the Labi Chat DApp to production.

## Prerequisites

- Node.js 18+
- Foundry installed
- Vercel account (for frontend deployment)
- Testnet ETH for contract deployment
- Pinata account for IPFS storage
- WalletConnect project ID

## Step 1: Environment Setup

### 1.1 WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID

### 1.2 Pinata IPFS Setup

1. Sign up at [Pinata](https://pinata.cloud)
2. Go to API Keys section
3. Create a new API key with admin permissions
4. Copy API Key, Secret Key, and JWT token

### 1.3 Alchemy RPC Setup

1. Sign up at [Alchemy](https://alchemy.com)
2. Create a new app for Ethereum Sepolia
3. Copy your API key

### 1.4 Etherscan API Key

1. Sign up at [Etherscan](https://etherscan.io)
2. Go to API Keys section
3. Create a new API key

## Step 2: Smart Contract Deployment

### 2.1 Prepare Contract Environment

\`\`\`bash
cd contracts
cp .env.example .env
\`\`\`

Fill in your contract `.env`:
\`\`\`env
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
\`\`\`

### 2.2 Deploy Contracts

\`\`\`bash
# Install dependencies
forge install

# Compile contracts
forge build

# Deploy to Sepolia
forge script contracts/deploy/Deploy.s.sol:DeployScript \
    --rpc-url sepolia \
    --broadcast \
    --verify

# Deploy to Lisk Sepolia
forge script contracts/deploy/Deploy.s.sol:DeployScript \
    --rpc-url lisk_sepolia \
    --broadcast
\`\`\`

### 2.3 Save Contract Addresses

After deployment, copy the contract addresses from the output and save them for the next step.

## Step 3: Frontend Deployment

### 3.1 Prepare Frontend Environment

Create `.env.local` in the root directory:
\`\`\`env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_LABI_REGISTRY_ADDRESS=deployed_registry_address
NEXT_PUBLIC_USER_PROFILES_ADDRESS=deployed_profiles_address
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
\`\`\`

### 3.2 Deploy to Vercel

#### Option A: Vercel CLI
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_LABI_REGISTRY_ADDRESS
vercel env add NEXT_PUBLIC_USER_PROFILES_ADDRESS
vercel env add NEXT_PUBLIC_PINATA_JWT

# Redeploy with environment variables
vercel --prod
\`\`\`

#### Option B: Vercel Dashboard
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import your GitHub repository
4. Add environment variables in the project settings
5. Deploy

## Step 4: Testing Deployment

### 4.1 Get Testnet ETH

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com/)

### 4.2 Test User Flow

1. Connect wallet to your deployed app
2. Register a .labi domain
3. Create a profile with avatar
4. Test chat functionality

## Step 5: Production Considerations

### 5.1 Security Checklist

- [ ] Contract addresses are correct
- [ ] Environment variables are secure
- [ ] IPFS credentials have appropriate permissions
- [ ] Wallet connection works on target networks

### 5.2 Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Set up proper caching headers
- [ ] Optimize images and assets
- [ ] Monitor IPFS upload performance

### 5.3 Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Monitor contract interactions
- [ ] Track IPFS upload success rates
- [ ] Monitor wallet connection rates

## Troubleshooting

### Contract Deployment Issues

**Gas estimation failed**
- Increase gas limit in deployment script
- Check network congestion

**Verification failed**
- Ensure Etherscan API key is correct
- Wait a few minutes and try manual verification

### Frontend Deployment Issues

**Environment variables not working**
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check Vercel function logs

**Wallet connection issues**
- Verify WalletConnect project ID
- Check network configuration
- Test with different wallets

### IPFS Upload Issues

**Upload failures**
- Check Pinata API limits
- Verify JWT token permissions
- Test with smaller files first

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables
3. Test on testnets first
4. Check contract verification on Etherscan

## Next Steps

After successful deployment:

1. Share your DApp with the community
2. Gather user feedback
3. Plan production improvements
4. Consider implementing real-time messaging backend
