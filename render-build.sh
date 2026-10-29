#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --include=dev

echo "Building TypeScript..."
npm run build

echo "Running database migrations..."
npm run migration:run || echo "Migration script notice: database migrations will run on server start"

echo "Build complete!"
