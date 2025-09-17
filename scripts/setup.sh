#!/bin/bash

# Labi Chat DApp Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up Labi Chat DApp..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry is not installed. Installing Foundry..."
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment files
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please fill in your environment variables in .env.local"
fi

# Set up contract environment
if [ ! -f contracts/.env ]; then
    echo "📝 Creating contract environment file..."
    cd contracts
    cp .env.example .env
    echo "⚠️  Please fill in your contract deployment variables in contracts/.env"
    cd ..
fi

# Install Foundry dependencies
echo "🔨 Setting up smart contracts..."
cd contracts
forge install
cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Fill in environment variables in .env.local"
echo "2. Fill in contract deployment variables in contracts/.env"
echo "3. Deploy contracts: cd contracts && ./deploy.sh"
echo "4. Start development server: npm run dev"
echo ""
echo "📚 See README.md for detailed instructions"
