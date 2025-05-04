# Deployment Guide for Base PingPong Arena

This guide provides detailed instructions for deploying the Base PingPong Arena application to production on Base mainnet.

## Prerequisites

- Node.js 16+ and npm
- A Base mainnet wallet with ETH for contract interactions and deployment
- A Vercel account (for the recommended deployment method)
- Git installed on your machine

## Deployment Options

### Option 1: Vercel Deployment (Recommended)

1. **Fork the Repository**
   - Fork this repository to your GitHub account

2. **Sign Up for Vercel**
   - Create an account at [Vercel](https://vercel.com) if you don't have one
   - Connect your GitHub account to Vercel

3. **Create a New Project**
   - Click "Add New" > "Project"
   - Select your forked repository
   - Configure the project with the following settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Configure Environment Variables**
   - Add the following environment variables in the Vercel project settings:
     ```
     VITE_CONTRACT_ADDRESS=0x64A40830192518cb78B4613Ab9cD509F8f29ec33
     VITE_PROVIDER_URL=https://mainnet.base.org
     VITE_PRODUCTION=true
     ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll receive a URL for your deployed application

### Option 2: Manual Deployment

1. **Build the Application**
   - Clone the repository: `git clone https://github.com/your-username/Base-PingPong-Arena.git`
   - Navigate to the project directory: `cd Base-PingPong-Arena`
   - Install dependencies: `npm install`
   - Create a `.env.production` file with the following content:
     ```
     VITE_CONTRACT_ADDRESS=0x64A40830192518cb78B4613Ab9cD509F8f29ec33
     VITE_PROVIDER_URL=https://mainnet.base.org
     VITE_PRODUCTION=true
     ```
   - Build the project: `npm run build`

2. **Deploy to Your Hosting Provider**
   - The build output will be in the `dist` directory
   - Upload the contents of the `dist` directory to your preferred hosting provider
   - Ensure your hosting provider is configured to handle client-side routing (all routes should redirect to index.html)

## Post-Deployment Verification

After deploying your application, verify the following:

1. **Connect Wallet**
   - Ensure you can connect your wallet to the application
   - Verify that the application connects to Base mainnet

2. **Game Functionality**
   - Create a new game with a stake amount
   - Join an existing game
   - Verify that the game mechanics work correctly

3. **Contract Interaction**
   - Verify that transactions are being sent to the correct contract address
   - Check that the contract interactions are successful on Base mainnet

## Troubleshooting

If you encounter issues during deployment:

1. **Vercel Build Failures**
   - Check the build logs for specific errors
   - Ensure all dependencies are correctly installed
   - Verify that the environment variables are correctly set

2. **Contract Connection Issues**
   - Confirm that the contract address in the environment variables is correct
   - Ensure the Base RPC URL is working properly
   - Check that your wallet is connected to Base mainnet

3. **Game Functionality Problems**
   - Clear your browser cache and try again
   - Check the browser console for any JavaScript errors
   - Verify that WebRTC connections are not being blocked by firewalls

## Updating the Deployment

To update your deployment after making changes:

1. **Vercel Deployment**
   - Push changes to your GitHub repository
   - Vercel will automatically rebuild and redeploy your application

2. **Manual Deployment**
   - Pull the latest changes: `git pull`
   - Rebuild the application: `npm run build`
   - Upload the updated `dist` directory to your hosting provider

## Support

If you need assistance with deployment, please open an issue on the GitHub repository or contact the project maintainer.
