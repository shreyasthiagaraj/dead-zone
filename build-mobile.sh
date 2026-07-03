#!/bin/bash
# Build script: copies web assets into www/ for Capacitor
set -e

echo "Building mobile app..."

# Clean
rm -rf www/*

# Copy web assets
cp index.html www/
cp -r sounds www/ 2>/dev/null || true
cp -r sprites www/ 2>/dev/null || true   # pixel-art pilot sprites (enemies + environments)

echo "Syncing Capacitor..."
npx cap sync ios

echo "Done! Open Xcode with: npx cap open ios"
