import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { celo } from 'wagmi/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

// WalletConnect project ID
const projectId = 'a01e488dc77a8abef37988808e0cad0e';

// Check if running in Farcaster context
const isFarcaster = typeof window !== 'undefined' && 
  (window.location.pathname.startsWith('/mini') || 
   new URLSearchParams(window.location.search).get('fc') === 'true');

// Use createConfig with Farcaster connector when in miniapp, otherwise use RainbowKit
export const config = isFarcaster 
  ? createConfig({
      chains: [celo],
      connectors: [farcasterMiniApp()],
      transports: {
        [celo.id]: http('https://forno.celo.org'),
      },
      ssr: false,
    })
  : getDefaultConfig({
      appName: 'Relay Boost',
      projectId,
      chains: [celo],
      ssr: false,
    });
