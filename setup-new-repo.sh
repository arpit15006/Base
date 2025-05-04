#!/bin/bash

# Check if target directory is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <target_directory> [--init-git] [--install-deps]"
    echo "Options:"
    echo "  --init-git      Initialize a new git repository in the target directory"
    echo "  --install-deps  Install dependencies after copying"
    exit 1
fi

TARGET_DIR="$1"
INIT_GIT=false
INSTALL_DEPS=false

# Parse additional arguments
shift
while [ "$#" -gt 0 ]; do
    case "$1" in
        --init-git)
            INIT_GIT=true
            ;;
        --install-deps)
            INSTALL_DEPS=true
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
    shift
done

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Target directory does not exist. Creating it..."
    mkdir -p "$TARGET_DIR"
fi

# Use rsync to copy files while excluding unnecessary directories
echo "Copying project files to $TARGET_DIR..."
rsync -av --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'artifacts' \
    --exclude 'cache' \
    --exclude '.DS_Store' \
    --exclude '.vite' \
    ./ "$TARGET_DIR"

echo "Project files copied successfully to $TARGET_DIR"

# Initialize git repository if requested
if [ "$INIT_GIT" = true ]; then
    echo "Initializing git repository in $TARGET_DIR..."
    (cd "$TARGET_DIR" && git init && git add . && git commit -m "Initial commit")
    echo "Git repository initialized"
fi

# Install dependencies if requested
if [ "$INSTALL_DEPS" = true ]; then
    echo "Installing dependencies in $TARGET_DIR..."
    (cd "$TARGET_DIR" && npm install)
    echo "Dependencies installed"
fi

# Create .env file if it doesn't exist
if [ ! -f "$TARGET_DIR/.env" ] && [ -f "$TARGET_DIR/.env.example" ]; then
    echo "Creating .env file from .env.example..."
    cp "$TARGET_DIR/.env.example" "$TARGET_DIR/.env"
    echo "Please update the .env file with your specific configuration"
fi

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. cd $TARGET_DIR"
if [ "$INSTALL_DEPS" = false ]; then
    echo "2. npm install (to install dependencies)"
fi
if [ ! -f "$TARGET_DIR/.env" ]; then
    echo "3. cp .env.example .env (to set up environment variables)"
fi
echo "4. npm run dev (to start the development server)"
