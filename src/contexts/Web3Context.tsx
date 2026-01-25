import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

// Monad Testnet configuration
export const MONAD_TESTNET = {
  chainId: 10143,
  chainIdHex: '0x279f',
  name: 'Monad Testnet',
  rpcUrl: 'https://testnet-rpc.monad.xyz',
  symbol: 'MON',
  decimals: 18,
  blockExplorer: 'https://testnet.monadexplorer.com',
};

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  formatAddress: (address: string) => string;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Supported chains (add more as needed)
const SUPPORTED_CHAINS: Record<number, string> = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon Mainnet',
  80001: 'Mumbai Testnet',
  31337: 'Localhost',
  10143: 'Monad Testnet',
};

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!account;
  const isCorrectNetwork = chainId === MONAD_TESTNET.chainId;

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const switchNetwork = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('MetaMask not detected');
      return;
    }

    try {
      // Try to switch to Monad Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainIdHex }],
      });
      toast.success(`Switched to ${MONAD_TESTNET.name}`);
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: MONAD_TESTNET.chainIdHex,
                chainName: MONAD_TESTNET.name,
                nativeCurrency: {
                  name: MONAD_TESTNET.symbol,
                  symbol: MONAD_TESTNET.symbol,
                  decimals: MONAD_TESTNET.decimals,
                },
                rpcUrls: [MONAD_TESTNET.rpcUrl],
                blockExplorerUrls: [MONAD_TESTNET.blockExplorer],
              },
            ],
          });
          toast.success(`Added and switched to ${MONAD_TESTNET.name}`);
        } catch (addError) {
          toast.error('Failed to add Monad Testnet');
        }
      } else {
        toast.error('Failed to switch network');
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('MetaMask not detected', {
        description: 'Please install MetaMask to connect your wallet.',
      });
      return;
    }

    setIsConnecting(true);

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const walletSigner = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);

      setProvider(browserProvider);
      setSigner(walletSigner);
      setAccount(accounts[0]);
      setChainId(currentChainId);

      const chainName = SUPPORTED_CHAINS[currentChainId] || `Chain ${currentChainId}`;
      toast.success('Wallet connected!', {
        description: `Connected to ${chainName}`,
      });

      // Prompt to switch if not on Monad
      if (currentChainId !== MONAD_TESTNET.chainId) {
        toast.info('Switch to Monad Testnet for full functionality', {
          action: {
            label: 'Switch',
            onClick: () => switchNetwork(),
          },
        });
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      if (error.code === 4001) {
        toast.error('Connection rejected', {
          description: 'You rejected the connection request.',
        });
      } else {
        toast.error('Connection failed', {
          description: error.message || 'Failed to connect wallet.',
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [switchNetwork]);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    toast.info('Wallet disconnected');
  }, []);

  // Handle account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        toast.info('Account changed', {
          description: formatAddress(accounts[0]),
        });
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      const chainName = SUPPORTED_CHAINS[newChainId] || `Chain ${newChainId}`;
      toast.info('Network changed', {
        description: chainName,
      });
      // Reload provider on chain change
      if (account) {
        connectWallet();
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, connectWallet, disconnectWallet]);

  // Auto-connect if previously connected
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const checkConnection = async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await browserProvider.listAccounts();
        
        if (accounts.length > 0) {
          const walletSigner = await browserProvider.getSigner();
          const network = await browserProvider.getNetwork();
          
          setProvider(browserProvider);
          setSigner(walletSigner);
          setAccount(await walletSigner.getAddress());
          setChainId(Number(network.chainId));
        }
      } catch (error) {
        console.log('No existing connection found');
      }
    };

    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        chainId,
        isConnecting,
        isConnected,
        isCorrectNetwork,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        formatAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
