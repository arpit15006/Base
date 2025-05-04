# Project Copy Scripts

This directory contains scripts to help you copy the Base PingPong Arena project to another repository.

## Available Scripts

1. **setup-new-repo.sh** - Comprehensive script for copying and setting up the project
   ```bash
   ./setup-new-repo.sh /path/to/new/repository [--init-git] [--install-deps]
   ```

2. **copy-project.sh** - Basic script for copying project files
   ```bash
   ./copy-project.sh /path/to/new/repository
   ```

3. **verify-copy.sh** - Script to verify that all critical files were copied
   ```bash
   ./verify-copy.sh /path/to/new/repository
   ```

## Usage Instructions

For detailed instructions on how to use these scripts, please refer to the [COPY_INSTRUCTIONS.md](COPY_INSTRUCTIONS.md) file.

## Script Descriptions

### setup-new-repo.sh
This script provides a complete solution for copying the project and setting up the new repository. It can:
- Copy all project files to the target directory
- Initialize a new git repository (optional)
- Install dependencies (optional)
- Create a .env file from .env.example

### copy-project.sh
A simpler script that only copies the project files to the target directory, excluding unnecessary files like node_modules, .git, etc.

### verify-copy.sh
This script checks that all critical files and directories were copied correctly to the target directory. It's useful for troubleshooting if you encounter any issues after copying.

## Notes

- All scripts require `rsync` to be installed on your system
- The scripts should be run from the root directory of the Base PingPong Arena project
- Make sure to make the scripts executable before running them:
  ```bash
  chmod +x *.sh
  ```
