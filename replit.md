# Boost - DeFi Yield Platform

## Overview

Boost is a DeFi application designed to democratize yield generation, targeting emerging markets with high inflation. It offers two primary modes: "Inflation Shield" for stablecoin vaults, catering to unbanked users seeking safe yields, and "Max Yield" for experienced traders, providing leveraged strategies. The platform promotes an "impact flywheel" by enabling users to donate a portion of their earnings to vetted causes. It is mobile-first, integrates with the Celo blockchain for gasless transactions, and provides local currency context. The platform leverages Uniswap V4 and Aave protocols, aiming for historical yields of 8-18% for safe vaults and 30-300%+ for leveraged strategies.

## User Preferences

Preferred communication style: Simple, everyday language.
Risk messaging: Calibrated for investor/regulator friendliness while maintaining accessibility.

## System Architecture

### Frontend Architecture

The frontend is a React SPA built with TypeScript, utilizing Wouter for routing and TanStack React Query for server state management. UI components are built with Shadcn/ui on Radix UI primitives, styled with Tailwind CSS, following a "New York" design system. It supports dual light/dark themes and distinct component variants for "Safe" and "Degen" modes. The design emphasizes a mobile-first, banking app-like simplicity with a "3 screens max" philosophy and robust accessibility. Key patterns include compound components, controlled components, and `data-testid` for E2E testing. Currency flexibility supports USD, ARS, NGN, and BRL.

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
All three UIs share core transaction dialogs (Deposit, Withdraw, Donation Settings) for consistent functionality and display real-time APY from Aave V3 with smooth 60 FPS earnings animations using `requestAnimationFrame`.

### Farcaster Miniapp Integration

A fully-integrated mobile-first `/mini` route serves as a Farcaster miniapp with complete DeFi functionality:
- **SDK Integration:** Uses `@farcaster/miniapp-sdk` with proper `sdk.actions.ready()` lifecycle management
- **Manifest:** Published at `/.well-known/farcaster.json` with app metadata, splash screen configuration, and Celo chain requirements (eip155:42220)
- **Rich Embeds:** OpenGraph meta tags (`fc:miniapp`, `fc:frame`) enable rich social sharing in Farcaster feeds with 3:2 aspect ratio images
- **Full DeFi Flows:** Complete deposit, withdraw, and donation functionality within the Farcaster client
- **Viral Sharing:** `ShareCastButton` composes pre-filled casts with yield stats and donation impact
- **Real-time APY:** Fetches live APY from Aave V3's `currentLiquidityRate` (Ray format, 1e27) displayed across all pages
- **Smooth Animations:** 60 FPS earnings display using `requestAnimationFrame` with interpolated values between blockchain polls
- **Account Association:** Configured with real signature from FID 325440 for domain `Yield-Boost.replit.app`

## External Dependencies

### Blockchain Infrastructure

- **Target Chain:** Celo (mainnet) for gasless transactions and native stablecoins (cUSD).
- **DeFi Protocols:** Uniswap V4 (for liquidity pools), Aave V3 (for lending/borrowing and leveraged strategies).
- **Smart Contract:** `BoostAaveVault` (ERC4626 interface) on Celo mainnet.

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