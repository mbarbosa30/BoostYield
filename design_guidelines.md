# FlowShelter Design Guidelines

## Design Approach
**Hybrid Reference-Based**: Drawing from Coinbase (trust/accessibility), Robinhood (dual-mode risk clarity), and Revolut (currency flexibility) for financial product patterns, combined with clean component architecture for the impact/donation layer.

## Core Design Principles
1. **Dual-Personality Interface**: Calm reassurance for Safe mode, controlled energy for Degen mode
2. **Risk Transparency**: Visual hierarchy makes risk impossible to miss
3. **Impact Visibility**: Yield donations are celebrated, not hidden
4. **Currency Flexibility**: USD primary with seamless local currency context

---

## Typography
- **Primary Font**: Inter (via Google Fonts)
- **Accent Font**: Space Grotesk (for Safe vault headers and impact metrics)
- **Hierarchy**:
  - Hero headlines: text-5xl/text-6xl, font-bold
  - Section headers: text-3xl/text-4xl, font-semibold
  - Card titles: text-xl, font-semibold
  - Body: text-base, font-normal
  - Micro-copy/disclaimers: text-sm, font-medium
  - APY displays: text-2xl, font-bold with tabular-nums

---

## Layout System
**Spacing Primitives**: Tailwind units of 3, 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24 (desktop), py-12 (mobile)
- Card gaps: gap-6 to gap-8
- Max container width: max-w-7xl with px-6

---

## Component Library

### Navigation
- Fixed top navbar with glass morphism effect (backdrop-blur-lg, bg-opacity-90)
- Logo left, currency toggle and connect wallet right
- Mobile: hamburger menu with slide-out drawer

### Hero Section (Landing)
**Full-width, 85vh section** with dramatic split-screen treatment:
- Left half: "Protect my savings" with calm gradient overlay
- Right half: "Explore high-risk strategies" with energetic gradient
- Center divider with subtle glow effect
- Both sides have CTA buttons with blurred backgrounds (backdrop-blur-md bg-white/20)
- Tagline above: "Save in dollars. Choose safety or risk. Let your yield fund your community." (centered, text-4xl)

### Vault/Strategy Cards
**Safe Mode Cards**:
- Rounded-2xl with subtle border
- Shield icon (from Heroicons) in corner
- APY range displayed prominently with "Est." prefix
- Risk badge: "Low Risk" with dot indicator
- "Conservative yield" tagline
- Hover: subtle lift (translate-y-1) and shadow increase

**Degen Mode Cards**:
- Same structure but with warning accent border
- Fire/lightning icon from Heroicons
- Risk meter: horizontal bar with 1-10 scale, filled portions in warning gradient
- Large ⚠️ emoji + "High Risk" badge
- APY shown with "Variable, not guaranteed" subtext
- Pulse animation on risk meter

### Impact Layer Components
**Yield Donation Slider**:
- Horizontal slider with percentage markers (0%, 25%, 50%, 75%, 100%)
- Warm accent gradient fill as slider moves right
- Live preview text: "You keep X%, [Cause] receives Y%"
- Heart icon (Heroicons) animates when donation percentage increases

**Cause Selection Cards** (3-column grid on desktop, 1-column mobile):
- Photo/logo of cause at top (rounded-lg)
- Cause name and category tag
- Short description (2 lines, truncated)
- "Total yield received" metric with number
- "Support this cause" secondary button

### Dashboard Components
**Balance Display**:
- Large card with gradient background (calm for Safe, energetic for Degen)
- Primary balance: huge text (text-5xl) with USD
- Local currency equivalent below in text-xl
- Tabular numbers for easy scanning

**Performance Chart**:
- Simple line chart showing vault value over time
- Dual-axis: left shows USD value, right shows local currency
- Donated yield shown as shaded area below main line
- 7D/30D/90D/ALL toggle buttons

**Yield Breakdown**:
- Horizontal stacked bar showing earned vs donated yield
- Numbers on hover/tap
- Color-coded: user yield in primary, donated in warm accent

### Risk Disclosure Modal
- Centered modal with dark overlay (bg-black/50)
- Large warning icon at top
- Bullet points of key risks in clear language
- For Degen: 2-3 question quiz with radio buttons
- "I understand" checkbox must be checked to proceed
- Emphasized CTA button

### Withdrawal Flow
- Multi-step card with progress indicator at top
- Summary section showing:
  - Deposited amount
  - Current value (with P&L badge: green for profit, red for loss)
  - Total donated to date with cause name
- Amount input with "Max" button
- Preview of post-withdrawal state

---

## Visual Design Patterns

### Safe Mode Aesthetic
- Calm blue-gray to soft teal gradient backgrounds
- Rounded-xl corners throughout
- Subtle shadows (shadow-md)
- Shield, lock, savings icons throughout
- Soft, reassuring micro-copy

### Degen Mode Aesthetic
- Vibrant purple to orange gradients
- Slightly sharper corners (rounded-lg)
- Heavier shadows (shadow-lg)
- Lightning, fire, graph-up icons
- Bold warning badges with emoji
- Persistent risk meter in header when in Degen section

### Impact Layer Aesthetic
- Warm coral/pink accent gradient
- Heart, users, hand-holding icons (Heroicons)
- Cause cards feature actual photos
- Celebration micro-animations when yield is donated (confetti particle effect, very brief)

---

## Images

### Hero Section
**Large hero image**: Split-screen treatment with abstract financial imagery
- Left side: Soft, secure imagery (piggy bank, shield, safe deposit metaphor) with calm blue overlay
- Right side: Dynamic, energetic imagery (charts, fast movement, risk metaphor) with vibrant gradient overlay
- Both sides 50% width on desktop, stacked on mobile

### Cause Cards
**Photo requirements**: 
- Each cause card needs a 16:9 hero image
- Authentic photos of communities/beneficiaries
- Warm, human-centered imagery
- Examples: women's cooperative meeting, community gathering, local business

### About/How It Works Section
**Diagram images**:
- Visual flow showing: Deposit → Yield Generation → Split → Impact
- Illustrated icons for each step
- Clean, modern illustration style

---

## Page-Specific Layouts

### Landing Page (7 sections)
1. **Hero**: Split-screen dual CTA (85vh)
2. **How It Works**: 3-step visual explainer with icons and short copy (py-24)
3. **Safe Mode Showcase**: 2-column (description + vault card preview) (py-20)
4. **Degen Mode Showcase**: 2-column (vault card preview + description with warnings) (py-20)
5. **Impact Stories**: 3-column cause cards grid with "Browse all causes" CTA (py-24)
6. **Trust Indicators**: Partner logos, security badges, protocol integrations (py-16)
7. **Final CTA**: Centered with both mode options + "Start saving today" headline (py-24)

### Vault Dashboard
- Top stats row: 3-4 metric cards (balance, earned, donated, APY)
- Main chart section: performance over time
- Positions table: list of all active vaults/strategies
- Quick actions sidebar: deposit more, withdraw, change donation settings

### Cause Browse Page
- Filter bar at top: category tags (Women Empowerment, UBI, Public Goods, etc.)
- 3-column grid of cause cards
- Each card expandable to full details modal
- Aggregate impact metrics at top: "Total yield donated across all causes: $XXX"

---

## Accessibility & Micro-interactions
- All interactive elements have 44px minimum touch targets
- Focus states: visible ring-2 with appropriate accent
- Loading states: skeleton screens matching component shape
- Success states: brief green checkmark animation
- Error states: shake animation with red accent and clear error message
- Tooltips on hover for all APY estimates and risk meters