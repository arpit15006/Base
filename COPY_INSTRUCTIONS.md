# How to Copy This Project to Another Repository

This document provides instructions on how to copy the Base PingPong Arena project to another repository.

## Prerequisites

- Ensure you have `rsync` installed on your system (comes pre-installed on most Unix-based systems)
- Bash shell environment

## Option 1: Using the Comprehensive Setup Script

The `setup-new-repo.sh` script provides a complete solution for copying the project and setting up the new repository.

```bash
./setup-new-repo.sh /path/to/new/repository [--init-git] [--install-deps]
```

Options:
- `--init-git`: Initialize a new git repository in the target directory
- `--install-deps`: Install dependencies after copying

Example:
```bash
# Copy files, initialize git, and install dependencies
./setup-new-repo.sh ~/projects/my-new-pingpong --init-git --install-deps
```

## Option 2: Basic Copy Script

For a simpler approach, you can use the basic copy script.

1. **Clone or create your target repository**

   ```bash
   # Either create a new directory
   mkdir /path/to/new/repository

   # Or clone an existing repository
   git clone https://github.com/your-username/your-new-repo.git
   ```

2. **Run the copy script**

   From the current project directory, run:

   ```bash
   ./copy-project.sh /path/to/new/repository
   ```

   This will copy all necessary files while excluding:
   - node_modules (dependencies)
   - .git (version control)
   - dist (build artifacts)
   - artifacts (contract artifacts)
   - cache (build cache)
   - .DS_Store (macOS system files)

3. **Set up the project in the new location**

   ```bash
   # Navigate to the new repository
   cd /path/to/new/repository

   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```

## Important Files

The script will copy all essential files including:

- Source code (src directory)
- Smart contracts (contracts directory)
- Configuration files (package.json, tsconfig.json, etc.)
- Public assets (public directory)
- Environment files (.env.example)

## Verifying Your Copy

After copying the project, you can verify that all critical files were copied correctly:

```bash
./verify-copy.sh /path/to/new/repository
```

This script will check for the presence of essential files and directories in the target location.

## Troubleshooting

If you encounter any issues:

1. **Missing files**: Run the verification script to check if all critical files were copied
2. **Dependency issues**: Try removing the node_modules folder and running `npm install` again
3. **Environment variables**: Make sure to set up your environment variables by copying `.env.example` to `.env` and filling in the required values

## Additional Setup

After copying, you may need to:

1. Initialize a new git repository if needed:
   ```bash
   git init
   ```

2. Set up your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your specific configuration
   ```

3. Deploy the smart contracts to your preferred network:
   ```bash
   npx hardhat run scripts/deploy-base.cjs --network <your-network>
   ```
