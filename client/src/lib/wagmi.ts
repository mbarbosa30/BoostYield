import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { celo } from 'wagmi/chains';

// WalletConnect project ID is REQUIRED for RainbowKit
// Get one free at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'VITE_WALLETCONNECT_PROJECT_ID environment variable is required. ' +
    'Get a free project ID at https://cloud.walletconnect.com/sign-up'
  );
}

// Celo mainnet configuration
export const config = getDefaultConfig({
  appName: 'Boost - DeFi Yield Platform',
  projectId,
  chains: [celo],
  transports: {
    [celo.id]: http(import.meta.env.VITE_CELO_RPC_URL || 'https://forno.celo.org'),
  },
  ssr: false,
});
