import { sdk } from '@farcaster/miniapp-sdk';

// Type for Farcaster context (user info, location, etc.)
export type FarcasterContext = Awaited<typeof sdk.context> | null;

let isInitialized = false;

/**
 * Initialize the Farcaster Mini App SDK
 * Call this once when your app loads
 */
export async function initializeFarcaster(): Promise<void> {
  if (isInitialized) return;
  
  try {
    // Signal that the miniapp is ready
    await sdk.actions.ready();
    isInitialized = true;
    console.log('Farcaster SDK initialized');
  } catch (error) {
    console.error('Failed to initialize Farcaster SDK:', error);
  }
}

/**
 * Check if the app is running inside a Farcaster client
 */
export function isFarcasterMiniapp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check URL params for miniapp indicator
  const url = new URL(window.location.href);
  return (
    url.pathname.startsWith('/mini') ||
    url.searchParams.get('miniApp') === 'true' ||
    url.searchParams.get('fc') === 'true'
  );
}

/**
 * Get the current Farcaster context (user info, etc.)
 */
export async function getFarcasterContext(): Promise<FarcasterContext> {
  try {
    const context = await sdk.context;
    return context;
  } catch (error) {
    console.error('Failed to get Farcaster context:', error);
    return null;
  }
}

/**
 * Sign in with Farcaster
 * @param nonce Optional nonce for signature verification
 */
export async function signInWithFarcaster(nonce?: string) {
  try {
    const result = await sdk.actions.signIn({
      nonce: nonce || `boost-${Date.now()}`
    });
    return result;
  } catch (error) {
    console.error('Failed to sign in with Farcaster:', error);
    throw error;
  }
}

/**
 * Compose a cast (post) with pre-filled content
 * Embeds: max 2 URLs
 */
export async function composeCast(options: {
  text: string;
  embeds?: [] | [string] | [string, string];
}) {
  try {
    await sdk.actions.composeCast(options);
  } catch (error) {
    console.error('Failed to compose cast:', error);
    throw error;
  }
}

/**
 * Get Ethereum provider from Farcaster Wallet (if using Base/other supported chains)
 * Note: Celo is not natively supported, so we'll use RainbowKit instead
 */
export async function getFarcasterWalletProvider() {
  try {
    const provider = await sdk.wallet.getEthereumProvider();
    return provider;
  } catch (error) {
    console.warn('Farcaster wallet provider not available (expected for Celo):', error);
    return null;
  }
}

export { sdk };
