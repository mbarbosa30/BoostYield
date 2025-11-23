import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celo } from 'wagmi/chains';

// WalletConnect project ID - using a fresh one for Replit domains
const projectId = 'a01e488dc77a8abef37988808e0cad0e';

// Use getDefaultConfig for proper RainbowKit setup
export const config = getDefaultConfig({
  appName: 'Relay Boost',
  projectId,
  chains: [celo],
  ssr: false,
});
