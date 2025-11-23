import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celo } from 'wagmi/chains';

// WalletConnect project ID
const projectId = 'a01e488dc77a8abef37988808e0cad0e';

// Use standard RainbowKit config for reliable wallet connections
export const config = getDefaultConfig({
  appName: 'Relay Boost',
  projectId,
  chains: [celo],
  ssr: false,
});
