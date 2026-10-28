#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --include=dev

echo "Running database migrations..."
NODE_ENV=production npx tsx src/scripts/runMigrations.ts

echo "Building TypeScript..."
npm run build

echo "Build complete!"
