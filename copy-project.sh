#!/bin/bash

# Check if target directory is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <target_directory>"
    exit 1
fi

TARGET_DIR="$1"

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Target directory does not exist. Creating it..."
    mkdir -p "$TARGET_DIR"
fi

# Use rsync to copy files while excluding unnecessary directories
rsync -av --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'artifacts' \
    --exclude 'cache' \
    --exclude '.DS_Store' \
    --exclude '.vite' \
    ./ "$TARGET_DIR"

echo "Project copied successfully to $TARGET_DIR"
echo "To complete setup in the new location:"
echo "1. cd $TARGET_DIR"
echo "2. npm install (or yarn install)"
echo "3. npm run dev (to start the development server)"
