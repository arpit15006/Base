import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import pingPongContract from '@/lib/contract';
import { WalletState } from '@/lib/types';

interface WalletContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  walletState: WalletState;
  address: string | null;
  balance: string;
  chainId: number | null;
  isCorrectChain: boolean;
  switchToBaseChain: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

// Base Chain IDs
const BASE_MAINNET_CHAIN_ID = 8453;
const BASE_TESTNET_CHAIN_ID = 84532;

// Always use mainnet for the hackathon
const ACTIVE_CHAIN_ID = BASE_MAINNET_CHAIN_ID;

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletState, setWalletState] = useState<WalletState>('disconnected');
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number | null>(null);

  const refreshBalance = async () => {
    if (!address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const checkConnection = async () => {
    if (!window.ethereum) {
      setWalletState('not-installed');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        setWalletState('connected');
        setAddress(accounts[0].address);

        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));

        await refreshBalance();
        await pingPongContract.initialize(window.ethereum);
      } else {
        setWalletState('disconnected');
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletState('disconnected');
    }
  };

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setWalletState('connected');
          refreshBalance();
          pingPongContract.initialize(window.ethereum);
        } else {
          setAddress(null);
          setWalletState('disconnected');
        }
      });

      window.ethereum.on('chainChanged', (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
      });

      window.ethereum.on('connect', () => {
        setWalletState('connected');
        checkConnection();
      });

      window.ethereum.on('disconnect', () => {
        setWalletState('disconnected');
        setAddress(null);
        setBalance('0');
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setWalletState('connecting');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        setWalletState('connected');
        setAddress(accounts[0]);

        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));

        await refreshBalance();
        await pingPongContract.initialize(window.ethereum);

        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState('disconnected');
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const disconnect = () => {
    // Note: MetaMask doesn't support programmatic disconnection
    // We can only clear our state
    setWalletState('disconnected');
    setAddress(null);
    setBalance('0');
    toast.info('Wallet disconnected locally. You may need to disconnect in MetaMask.');
  };

  const switchToBaseChain = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not installed. Please install MetaMask to continue.');
      return;
    }

    // Convert chain ID to hex format
    const chainIdHex = `0x${ACTIVE_CHAIN_ID.toString(16)}`;
    const isMainnet = ACTIVE_CHAIN_ID === BASE_MAINNET_CHAIN_ID;
    const networkName = isMainnet ? 'Base Mainnet' : 'Base Sepolia Testnet';
    const rpcUrl = isMainnet ? 'https://mainnet.base.org' : 'https://sepolia.base.org';
    const blockExplorerUrl = isMainnet ? 'https://basescan.org' : 'https://sepolia.basescan.org';

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: networkName,
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: [blockExplorerUrl],
              },
            ],
          });
        } catch (addError) {
          console.error(`Error adding ${networkName} to MetaMask:`, addError);
          toast.error(`Failed to add ${networkName} to MetaMask. Please try again.`);
        }
      } else {
        console.error(`Error switching to ${networkName}:`, switchError);
        toast.error(`Failed to switch to ${networkName}. Please try again.`);
      }
    }
  };

  const isCorrectChain = chainId === ACTIVE_CHAIN_ID;

  return (
    <WalletContext.Provider
      value={{
        connect,
        disconnect,
        walletState,
        address,
        balance,
        chainId,
        isCorrectChain,
        switchToBaseChain,
        refreshBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
