# Boost - DeFi Yield Platform

## Overview

Boost is a DeFi application that democratizes yield generation through a dual-mode approach: safe stablecoin vaults (Inflation Shield) for unbanked/high-inflation users, and high-risk leveraged strategies (Max Yield) for experienced traders. Built with a revolutionary narrative of "From Survival to Thriving," the platform enables users to earn yields and optionally donate portions to vetted causes, creating an "impact flywheel" that connects personal gains with collective good.

The application targets emerging markets (Argentina, Nigeria, Venezuela, Brazil) with mobile-first design, Celo blockchain integration for gasless transactions, and local currency context. It combines Uniswap V4 liquidity pools with Aave lending protocols, with historical yields in the 8-18% range for safe vaults and 30-300%+ range for leveraged strategies.

## Recent Changes (November 2025)

**Narrative Refinement & Legal/Compliance Calibration:**
- Softened APY claims from guaranteed numbers to "historically X-Y%" language throughout
- Removed competitor comparisons (e.g., "outperforms Summer.fi")
- Changed "fortress" and "near-zero" language to "designed to reduce" and "aims to minimize"
- Strengthened risk disclosures in modals with 6-7 specific warnings per mode
- Updated all copy to avoid overpromising while maintaining emotional narrative strength
- Added regulatory disclaimers: "not FDIC insured," "past performance doesn't predict future returns"
- Maintained dual persona storytelling (Maria/Ahmed) but with tempered yield expectations

**Landing Page Structure:**
- Simplified HeroSection to quick decision point with concise risk labels
- Expanded SafeShowcaseSection with complete Maria persona story and detailed benefits
- Expanded DegenShowcaseSection with complete Ahmed persona story and comprehensive warnings
- All CTAs consistently trigger risk disclosure modals before vault access

## User Preferences

Preferred communication style: Simple, everyday language.
Risk messaging: Calibrated for investor/regulator friendliness while maintaining accessibility.

## System Architecture

### Frontend Architecture

**React SPA with TypeScript**
- Framework: React 18 with TypeScript in strict mode
- Routing: Wouter for lightweight client-side routing
- State Management: TanStack React Query v5 for server state, React hooks for local state
- UI Framework: Shadcn/ui component library built on Radix UI primitives
- Styling: Tailwind CSS with custom design system following "New York" style variant
- Build Tool: Vite with custom development and production configurations

**Design System**
- Typography: Inter (primary), Space Grotesk (accent for headers/impact metrics)
- Color Modes: Dual light/dark theme support with CSS custom properties
- Component Variants: Safe mode (shield/protection theme) vs Degen mode (warning/high-risk theme)
- Visual Language: Banking app simplicity with "3 screens max" philosophy
- Accessibility: Mobile-first responsive design with maximum-scale viewport constraint

**Key Frontend Patterns**
- Compound component pattern for complex UI (cards, dialogs, carousels)
- Controlled components with optional callback props for state lifting
- Test-driven attributes via `data-testid` for reliable E2E testing
- Elevation system using `hover-elevate` and `active-elevate-2` utility classes
- Currency flexibility with USD/ARS/NGN/BRL support and exchange rate display

### Backend Architecture

**Express.js REST API**
- Runtime: Node.js with ES modules
- Framework: Express with JSON body parsing and raw body verification support
- Development: Vite middleware integration for HMR and SSR capability
- Production: Static file serving from compiled `dist/public` directory
- Session Management: Placeholder for connect-pg-simple (PostgreSQL session store)

**Server Organization**
- Development entry: `server/index-dev.ts` with Vite integration and auto-reload
- Production entry: `server/index-prod.ts` with pre-built static assets
- Routes: Centralized in `server/routes.ts` with `/api` prefix convention
- Storage Interface: Abstract `IStorage` interface with in-memory implementation (`MemStorage`)
- Logging: Custom time-stamped logging with request duration tracking

**API Design Decisions**
- Storage abstraction allows swapping between memory, PostgreSQL, or other backends without route changes
- Raw body preservation on requests for webhook signature verification (e.g., blockchain event hooks)
- Credential-based requests for session cookie support
- Error handling with automatic non-OK response rejection

### Data Storage Solutions

**Database Schema (Drizzle ORM)**
- ORM: Drizzle with Zod schema validation
- Dialect: PostgreSQL via `@neondatabase/serverless` driver
- Schema Location: `shared/schema.ts` for client/server sharing
- Migrations: Auto-generated in `./migrations` directory via `drizzle-kit push`

**Current Schema**
- Users table: UUID primary key, unique username, password (not hashed in base schema)
- Zod validation schemas generated via `createInsertSchema` for type-safe inserts
- TypeScript type inference from schema using `$inferSelect`

**Storage Abstraction**
- Interface separates storage operations from business logic
- Current implementation: In-memory Map for development/testing
- Production readiness: Schema defined for PostgreSQL with Neon serverless compatibility
- Pattern supports future migration to Drizzle-backed storage without route refactoring

### Authentication and Authorization

**Current State**
- Placeholder user schema with username/password fields
- No active authentication implementation in routes
- Session store configured (`connect-pg-simple`) but not integrated
- Query client configured with `credentials: "include"` for cookie-based auth

**Intended Design**
- Cookie-based sessions stored in PostgreSQL
- React Query with 401 handling (either `returnNull` or `throw` based on context)
- Wallet-based authentication for blockchain interactions (not yet implemented)
- Risk disclosure modals as user acknowledgment gates before vault access

### External Dependencies

**Blockchain Infrastructure**
- Target Chain: Celo (gasless transactions, sub-cent fees, native stablecoins like cUSD)
- DeFi Protocols: Uniswap V4 (liquidity pools), Aave (lending/borrowing for leverage)
- Strategy Types: Auto-optimized stable pools (safe), leveraged LP positions (degen)

**Third-Party Services**
- Database: Neon serverless PostgreSQL (configured but not provisioned)
- Fonts: Google Fonts (Inter, Space Grotesk)
- Asset Hosting: Local `attached_assets` directory with generated images for causes and hero backgrounds

**NPM Dependencies (Key)**
- UI: `@radix-ui/*` primitives, `tailwindcss`, `class-variance-authority`, `clsx`
- Data: `@tanstack/react-query`, `drizzle-orm`, `drizzle-zod`, `zod`
- Blockchain: None yet installed (pending Ethers.js/Viem/Wagmi integration)
- Utils: `date-fns`, `wouter`, `nanoid`

**Development Tools**
- Replit-specific: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`
- Build: `esbuild` for server bundling, `vite` for client bundling
- Type Checking: TypeScript with strict mode, path aliases for `@/`, `@shared/`, `@assets/`

**Missing Integrations (Per PRD)**
- No wallet connection library (e.g., RainbowKit, Wagmi)
- No blockchain interaction layer (Ethers.js/Viem)
- No smart contract ABIs or deployment addresses
- No fiat on/off-ramp integration
- No tax reporting or transaction export functionality