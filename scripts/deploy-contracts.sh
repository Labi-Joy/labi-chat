#!/bin/bash

# Smart Contract Deployment Script
# Deploys LabiRegistry and UserProfiles contracts to testnets

set -e

echo "🚀 Deploying Labi Chat Smart Contracts..."

# Check if we're in the contracts directory
if [ ! -f "foundry.toml" ]; then
    echo "❌ Please run this script from the contracts directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy .env.example and fill in your values."
    exit 1
fi

# Source environment variables
source .env

# Check required environment variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set in .env file"
    exit 1
fi

if [ -z "$ALCHEMY_API_KEY" ]; then
    echo "❌ ALCHEMY_API_KEY not set in .env file"
    exit 1
fi

echo "✅ Environment variables loaded"

# Install dependencies
echo "📦 Installing Foundry dependencies..."
forge install

# Compile contracts
echo "🔨 Compiling contracts..."
forge build

echo "✅ Contracts compiled successfully"

# Deploy to Sepolia
echo "🌐 Deploying to Sepolia testnet..."
forge script contracts/deploy/Deploy.s.sol:DeployScript \
    --rpc-url sepolia \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY

echo "✅ Deployed to Sepolia"

# Deploy to Lisk Sepolia
echo "🌐 Deploying to Lisk Sepolia testnet..."
forge script contracts/deploy/Deploy.s.sol:DeployScript \
    --rpc-url lisk_sepolia \
    --broadcast

echo "✅ Deployed to Lisk Sepolia"

# Check if deployment addresses file was created
if [ -f "deployment-addresses.env" ]; then
    echo "📋 Deployment addresses saved to deployment-addresses.env"
    echo "📝 Please copy these addresses to your main .env.local file:"
    echo ""
    cat deployment-addresses.env
    echo ""
else
    echo "⚠️  deployment-addresses.env not found. Check deployment logs for contract addresses."
fi

echo "🎉 Contract deployment complete!"
echo ""
echo "Next steps:"
echo "1. Copy contract addresses to your .env.local file"
echo "2. Start the development server: npm run dev"
echo "3. Test domain registration and profile creation"
