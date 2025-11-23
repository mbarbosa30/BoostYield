import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celo } from 'wagmi/chains';

// WalletConnect project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '9f5cc7091a0b9d4320f9b0d55901c74e';

// Use getDefaultConfig for proper RainbowKit setup
export const config = getDefaultConfig({
  appName: 'Relay Boost',
  projectId,
  chains: [celo],
  ssr: false,
});
