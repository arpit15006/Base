#!/bin/bash

# Check if target directory is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <target_directory>"
    exit 1
fi

TARGET_DIR="$1"

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory does not exist."
    exit 1
fi

# List of critical files and directories to check
CRITICAL_FILES=(
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "hardhat.config.cjs"
    "contracts/PingPongGame.sol"
    "src/App.tsx"
    "public/favicon.ico"
    ".env.example"
)

# Check each critical file
echo "Verifying critical files..."
MISSING=0

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$TARGET_DIR/$file" ]; then
        echo "❌ Missing: $file"
        MISSING=$((MISSING + 1))
    else
        echo "✅ Found: $file"
    fi
done

# Check critical directories
CRITICAL_DIRS=(
    "src"
    "contracts"
    "public"
    "scripts"
)

echo -e "\nVerifying critical directories..."
for dir in "${CRITICAL_DIRS[@]}"; do
    if [ ! -d "$TARGET_DIR/$dir" ]; then
        echo "❌ Missing: $dir directory"
        MISSING=$((MISSING + 1))
    else
        echo "✅ Found: $dir directory"
    fi
done

# Summary
echo -e "\nVerification complete!"
if [ $MISSING -eq 0 ]; then
    echo "All critical files and directories were copied successfully."
else
    echo "Warning: $MISSING critical files or directories are missing."
    echo "Please check the copy process and try again."
fi
