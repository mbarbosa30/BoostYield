import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { celo } from 'wagmi/chains';

// WalletConnect project ID (optional for viewing, required for connecting wallet)
// Get one free at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

// Celo mainnet configuration
export const config = getDefaultConfig({
  appName: 'Relay Boost - DeFi Yield Platform',
  projectId,
  chains: [celo],
  transports: {
    [celo.id]: http(import.meta.env.VITE_CELO_RPC_URL || 'https://forno.celo.org'),
  },
  ssr: false,
});
