import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { celo } from 'wagmi/chains';

// WalletConnect project ID (optional for viewing, required for connecting wallet)
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '9f5cc7091a0b9d4320f9b0d55901c74e';

// Configure connectors manually to avoid getDefaultConfig hook issues
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, metaMaskWallet, coinbaseWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'Relay Boost - DeFi Yield Platform',
    projectId,
  }
);

// Celo mainnet configuration using createConfig instead of getDefaultConfig
export const config = createConfig({
  connectors,
  chains: [celo],
  transports: {
    [celo.id]: http(import.meta.env.VITE_CELO_RPC_URL || 'https://forno.celo.org'),
  },
  ssr: false,
});
