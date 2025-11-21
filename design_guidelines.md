# Boost Design Guidelines

## Brand Narrative
**"From Survival to Thriving – The People's Yield Revolution"**

Boost is a movement, not just an app. In 2025, billions remain unbanked or battle hyperinflation in Argentina, Nigeria, Venezuela. Traditional finance has failed the masses. Crypto promised freedom, but DeFi became a playground for the tech-savvy elite with complicated interfaces and hidden risks.

Boost democratizes DeFi's best-kept secrets through radical simplicity and superior yields. It's a shield against economic chaos for everyday survivors, rocket fuel for bold risk-takers, and a bridge to impact for everyone.

### Core Personas
- **Maria in Buenos Aires**: Deposits $500 USDC, beats 100% inflation with 12% APY, sends 25% of yield to local school fund
- **Ahmed in Lagos**: Leverages ETH for 150% returns while funding clean water projects

### Brand Voice
- **Revolutionary, not corporate**: "Join the movement" not "use our product"
- **Empowering, not condescending**: Speak to resilience and ambition
- **Transparent, not jargony**: Zero crypto maze, banking-app simplicity
- **Impact-driven**: Personal gains → collective good

---

## Design Approach
**Emerging Market First**: Mobile-optimized, Celo-powered (gasless, sub-cent fees), built for $50 deposits and hyperinflation scenarios. Reference points: Venmo simplicity + Wall Street power.

## Core Design Principles
1. **Radical Simplicity**: 3 screens max, one wallet connect, zero jargon
2. **Dual-Mode Philosophy**: Inflation Shield (survival) vs Max Yield (thriving)
3. **Risk Transparency**: Visual hierarchy makes risk impossible to miss
4. **Impact Flywheel**: Global leaderboard, transparent tracking, community building
5. **Currency Flexibility**: USD primary with seamless local currency context

---

## Typography
- **Primary Font**: Inter (via Google Fonts)
- **Accent Font**: Space Grotesk (for vault headers, impact metrics, revolutionary messaging)
- **Hierarchy**:
  - Hero headlines: text-5xl/text-7xl, font-bold
  - Revolutionary taglines: text-2xl/text-3xl, font-semibold
  - Section headers: text-3xl/text-4xl, font-semibold
  - Card titles: text-xl, font-semibold
  - Body: text-base, font-normal
  - Micro-copy/disclaimers: text-sm, font-medium
  - APY displays: text-2xl/text-3xl, font-bold with tabular-nums

---

## Color System

### Inflation Shield (Safe Mode)
- Calm, trustworthy, protection-focused
- Blue-gray to soft teal gradients
- Icons: Shield, Lock, Heart

### Max Yield (Degen Mode)
- Energetic, ambitious, high-performance
- Vibrant purple to orange gradients
- Icons: Lightning, Fire, TrendingUp

### Impact Layer
- Warm coral/pink accent gradient
- Icons: Heart, Users, Globe
- Celebration animations for donations

---

## Component Library

### Navigation
- Logo: "Boost" (bold, accent font)
- Tagline option: "The People's Yield Revolution"
- Fixed top navbar with glass morphism
- Currency toggle and connect wallet right
- Mobile: hamburger menu

### Hero Section (Landing)
**Asymmetric Tiered Layout**:
- Primary column (70%): Inflation Shield narrative
  - Revolutionary headline: "Save in dollars. Protect your wealth."
  - Maria persona story integration
  - 8-18% APY prominently displayed
  - Risk level 3/10 visual indicator
  - Impact hook: "Optional: Donate yield to community causes"
  - Primary CTA: "Start Saving Safely"
  
- Secondary column (30%): Max Yield alternative
  - Badge: "For experienced DeFi users only"
  - 30-300%+ APY range
  - Risk level 8/10 visual warning
  - High risk disclosure
  - Secondary CTA: "Explore Strategies"
  
- Mobile: Inflation Shield first, Max Yield collapsible

### Vault/Strategy Cards

**Inflation Shield Cards**:
- Title: "Inflation Shield"
- APY: 8-18% (vs old 4-6%)
- Tagline: "Beat inflation by 10x what banks offer"
- Risk: 3/10 with visual dots
- Features: "Auto-optimized Uniswap V4 + Aave lending"
- Celo optimization badge
- Near-zero impermanent loss callout

**Max Yield Cards**:
- Title: "Max Yield"
- APY: 30-300%+ (vs old 20-50%)
- Tagline: "Auto-looped leverage, one-click entry"
- Risk: 8/10 with warning dots
- Features: "Outperforms Summer.fi manual strategies"
- Liquidation buffer mention
- ⚠️ "Can lose everything" warning

### Impact Layer Components

**Yield Donation Slider**:
- 0-100% donation percentage
- Global leaderboard integration
- "Turn earning into a force for good"
- Tax receipt mention
- Community building emphasis

**Cause Selection Cards**:
- Education in Africa, rainforest protection, clean water
- Total yield donated metric
- Transparent on-chain tracking
- Impact stories integration

---

## APY & Risk Messaging

### Inflation Shield
- **APY Range**: 8-18%
- **Messaging**: "Beat 100% inflation", "10x what banks offer", "Shield against economic chaos"
- **Risk Level**: 3/10 (Low)
- **Target**: Unbanked, hyperinflation survivors, $50+ deposits

### Max Yield
- **APY Range**: 30-300%+
- **Messaging**: "Rocket fuel for returns", "Auto-looped leverage", "Buffered against liquidation"
- **Risk Level**: 8/10 (High)
- **Target**: Yield-hungry degens, experienced DeFi users

---

## Visual Design Patterns

### Inflation Shield Aesthetic
- Calm blue-gray to soft teal gradients
- Rounded-xl corners
- Subtle shadows (shadow-md)
- Shield, lock, heart icons
- Reassuring, empowering copy
- Maria persona integration

### Max Yield Aesthetic
- Vibrant purple to orange gradients
- Sharper corners (rounded-lg)
- Heavier shadows (shadow-lg)
- Lightning, fire, trending-up icons
- Bold warning badges
- Ahmed persona integration
- Persistent risk meter

### Impact Layer Aesthetic
- Warm coral/pink accents
- Heart, globe, users icons
- Cause photos (authentic, human-centered)
- Celebration micro-animations
- Global leaderboard visualization

---

## Key Value Props

### vs Traditional Banks/CeFi
- 10-20x higher yields
- No KYC barriers
- Full self-custody
- Optional philanthropy

### vs Other DeFi Apps
- Simpler UI (3 screens max)
- Auto-routes to best chains/pools
- Celo for low fees
- Combined UniV4 + Aave magic
- Unique donation flywheel

### Emerging Market Optimization
- Gasless entry via Celo
- Sub-cent transaction fees
- $50 minimum deposits
- Native stables (cUSD)
- Local cause resonance

---

## Page-Specific Layouts

### Landing Page (7 sections)
1. **Hero**: Asymmetric tiered layout (Inflation Shield primary, Max Yield secondary)
2. **How It Works**: Radical simplicity messaging, 3-screen max, Celo optimization
3. **Inflation Shield Showcase**: Maria story, 8-18% APY, emerging market focus
4. **Max Yield Showcase**: Ahmed story, 30-300%+ APY, auto-looping emphasis
5. **Impact Stories**: Global leaderboard, community building, force for good
6. **Trust Indicators**: Uniswap V4, Aave, Celo badges
7. **Final CTA**: "Join the revolution – protect, optimize, and give today"

---

## Messaging Framework

### Headlines
- "From Survival to Thriving"
- "The People's Yield Revolution"
- "Your money fights back, grows, and gives back"
- "Save in dollars. Choose safety or risk."
- "Join the revolution"

### Taglines
- "Earn More, Risk Smart, Give Effortlessly"
- "As easy as Venmo, as powerful as Wall Street"
- "Beat inflation. Build resilience. Create shared prosperity."
- "One wallet connect. One deposit. Zero jargon."

### Call-to-Actions
- Primary: "Start Saving Safely" (Inflation Shield)
- Secondary: "Explore Strategies" (Max Yield)
- Impact: "Support a Cause"
- Final: "Join the Revolution"

---

## Accessibility & Micro-interactions
- 44px minimum touch targets
- Focus states: visible ring-2
- Loading: skeleton screens
- Success: brief checkmark animation
- Error: shake animation with clear message
- Tooltips on APY estimates and risk meters
- Celebration animations for yield donations (confetti, brief)
