# Relay Boost - DeFi Yield Platform

## Overview

Relay Boost is a DeFi application designed to democratize yield generation, targeting emerging markets with high inflation. It offers two primary modes: "Inflation Shield" for stablecoin vaults, catering to unbanked users seeking safe yields, and "Max Yield" for experienced traders, providing leveraged strategies. The platform promotes an "impact flywheel" by enabling users to donate a portion of their earnings to vetted causes. It is mobile-first, integrates with the Celo blockchain for gasless transactions, and provides local currency context. The platform leverages Uniswap V4 and Aave protocols, aiming for historical yields of 8-18% for safe vaults and 30-300%+ for leveraged strategies.

## User Preferences

Preferred communication style: Simple, everyday language.
Risk messaging: Calibrated for investor/regulator friendliness while maintaining accessibility.

## System Architecture

### Frontend Architecture

The frontend is a React SPA built with TypeScript, utilizing Wouter for routing and TanStack React Query for server state management. UI components are built with Shadcn/ui on Radix UI primitives, styled with Tailwind CSS, following a "New York" design system. It supports dual light/dark themes and distinct component variants for "Safe" and "Degen" modes. The design emphasizes a mobile-first, banking app-like simplicity with a "3 screens max" philosophy and robust accessibility. Key patterns include compound components, controlled components, and `data-testid` for E2E testing. Currency flexibility supports USD, ARS, NGN, and BRL.

**Multi-Token Support:** The application supports multiple stablecoins and native assets on Celo through a unified `TokenContext` that provides runtime token switching. Token configuration is centralized in `TOKEN_CONFIGS` mapping (in `BoostVaultABI.ts`), with each token specifying its address, decimals, and corresponding vault address. Currently supported tokens include cUSD (18 decimals), USDC bridged (6 decimals), USDT (6 decimals), and CELO (18 decimals). The `TokenSelector` component allows users to toggle between available tokens across all pages (/simple, /degen, /mini), with all vault operations (deposit, withdraw, APY fetching, balance checking) dynamically adapting to the selected token. Tokens without deployed vault contracts are automatically disabled in the UI via zero-address validation.

### Backend Architecture

The backend is an Express.js REST API running on Node.js. It uses Vite middleware for development (HMR, SSR) and serves static files in production. Routes are centralized with an `/api` prefix. An abstract `IStorage` interface allows flexible data storage, currently implemented with in-memory `MemStorage` but designed for PostgreSQL with Drizzle ORM. API design prioritizes storage abstraction, raw body preservation for webhooks, and credential-based requests for session management.

### Data Storage Solutions

Drizzle ORM with Zod schema validation is used for database interaction, targeting PostgreSQL via `@neondatabase/serverless`. Schemas are defined in `shared/schema.ts` for client/server consistency, with auto-generated migrations. The current `MemStorage` implementation provides an in-memory map for development, with a clear path to Drizzle-backed PostgreSQL for production.

### Authentication and Authorization

While authentication is not fully implemented, the system is designed for cookie-based sessions stored in PostgreSQL. React Query is configured for 401 handling, and wallet-based authentication will be used for blockchain interactions. Risk disclosure modals act as user acknowledgment gates before vault access.

### Dual-UI Implementation

The platform features three distinct user interfaces:
- **`/degen`**: A crypto-native interface with sophisticated Wall Street terminology, data-dense dashboards, a dark theme, and professional impact metrics for donations ("Zero-Fee Philanthropy")
- **`/simple`**: An emerging markets interface with plain language, bright design, progress visualizations, and community-focused messaging for donations ("Share Your Growth")
- **`/mini`**: A mobile-optimized Farcaster miniapp with streamlined UX for in-app DeFi transactions and viral sharing

All three UIs share:
- Core transaction dialogs (Deposit, Withdraw, Donation Settings) that dynamically adapt to the selected token (cUSD/USDC/USDT/CELO)
- TokenSelector component for runtime token switching with automatic availability detection
- Real-time APY fetching from Aave V3 pool based on selected token
- Smooth 60 FPS earnings animations using `requestAnimationFrame`
- Dynamic vault address configuration via TokenContext with zero-address validation
- **YieldPreferenceSelector:** Users can choose to receive yield in stablecoins (SAME) or convert to CELO at withdrawal (Phase 1 MVP complete)
- **TokenSuggestionForm:** Community-driven token suggestion system for future yield conversion options with partnership pipeline

### Farcaster Miniapp Integration

A fully-integrated mobile-first `/mini` route serves as a Farcaster miniapp with complete DeFi functionality:
- **SDK Integration:** Uses `@farcaster/miniapp-sdk` with proper `sdk.actions.ready()` lifecycle management
- **Wallet Connection:** Uses standard RainbowKit for wallet connections. Note: Warpcast's native wallet supports Base/Ethereum but not Celo, so users connect via Celo-compatible wallets (Valora, MetaMask Mobile) through WalletConnect
- **Context Awareness:** Detects Farcaster context via `sdk.context` to enable miniapp-specific features (e.g., ShareCastButton)
- **Manifest:** Published at `/.well-known/farcaster.json` with app metadata, splash screen configuration, and Celo chain requirements (eip155:42220)
- **Rich Embeds:** OpenGraph meta tags (`fc:miniapp`, `fc:frame`) enable rich social sharing in Farcaster feeds with 3:2 aspect ratio images
- **Full DeFi Flows:** Complete deposit, withdraw, and donation functionality within the Farcaster client
- **Viral Sharing:** `ShareCastButton` composes pre-filled casts with yield stats and donation impact
- **Real-time APY:** Fetches live APY from Aave V3's `currentLiquidityRate` (Ray format, 1e27) displayed across all pages
- **Smooth Animations:** 60 FPS earnings display using `requestAnimationFrame` with interpolated values between blockchain polls
- **Account Association:** Configured with real signature from FID 325440 for domain `relayboost.app`

## Deployment

### Production Domain
- **Primary Domain:** https://relayboost.app
- **Development Domain:** https://Yield-Boost.replit.app

### Farcaster Integration Notes
The Farcaster `accountAssociation` signature in `/.well-known/farcaster.json` is cryptographically tied to the domain it was created for. The signature has been updated for the production domain `relayboost.app`.

All Farcaster manifest URLs, HTML meta tags, and account association signature have been updated to use `relayboost.app`.

## External Dependencies

### Blockchain Infrastructure

- **Target Chain:** Celo (mainnet) for gasless transactions and native stablecoins.
- **Supported Tokens:**
  - cUSD: 0x765DE816845861e75A25fCA122bb6898B8B1282a (18 decimals) ✅ Active
  - USDC (bridged/Wormhole): 0xcebA9300f2b948710d2653dD7B07f33A8B32118C (6 decimals) ✅ Active
    - Note: Using bridged USDC as native USDC (0xef4229c8c3250C675F21BCefa42f58EfbfF6002a) is not supported on Aave V3 Celo
  - USDT (native Tether): 0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e (6 decimals) ✅ Active
  - CELO (native asset): 0x471EcE3750Da237f93B8E339c536989b8978a438 (18 decimals) ✅ Active
- **DeFi Protocols:** 
  - Aave V3 Pool (0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402) for lending/borrowing and leveraged strategies
  - Uniswap V4 (for future yield conversion swaps):
    - PoolManager: 0x288dc841A52FCA2707c6947B3A777c5E56cd87BC
    - UniversalRouter: 0xcb695bc5d3aa22cad1e6df07801b061a05a0233a
    - Permit2: 0x000000000022D473030F116dDEE9F6B43aC78BA3
    - V4Quoter: 0x9cF4222e95B2D4B51Edf35D3B31B93b6CdD0BdA7
- **Smart Contracts:**
  - cUSD Vault: `BoostAaveVault` at 0x775e8a5cbf69143482c89dcf9461d96cd49efb18 (ERC4626)
  - USDC Vault: `BoostAaveVault` at 0xEE191B1aa821C42E4646ca5FdC5ACDd3aBE31F90 (ERC4626)
  - USDT Vault: `BoostAaveVault` at 0xF0401D830B2e0daeda33ee58e04124A67EdcC734 (ERC4626)
  - CELO Vault: `BoostAaveVault` at 0xFCC13010E9e6FfE7E6d90c24896f5b9CCB14C78B (ERC4626)

### Third-Party Services

- **Database:** Neon serverless PostgreSQL (configured for future use).
- **Fonts:** Google Fonts (Inter, Space Grotesk).
- **Asset Hosting:** Local `attached_assets` directory.

### NPM Dependencies (Key Categories)

- **UI:** `@radix-ui/*`, `tailwindcss`, `class-variance-authority`, `clsx`, `shadcn/ui`.
- **Data:** `@tanstack/react-query`, `drizzle-orm`, `drizzle-zod`, `zod`.
- **Blockchain:** `wagmi`, `viem`, `rainbowkit`, `@farcaster/miniapp-sdk`.
- **Utilities:** `date-fns`, `wouter`, `nanoid`.

### Development Tools

- **Replit-specific:** `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`.
- **Bundlers:** `esbuild`, `vite`.
- **Type Checking:** TypeScript.