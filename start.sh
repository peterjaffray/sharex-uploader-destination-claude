#!/bin/bash

# ShareX Uploader For Claude (w/ AWS) Start Script

echo "🚀 Starting ShareX Uploader For Claude (w/ AWS)..."
echo "📸 Perfect for sharing with Claude Code and bypassing blockers!"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📋 Please copy .env.example to .env and configure your settings"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Server starting on port ${PORT:-3456}..."
npm start