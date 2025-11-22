# Farcaster Mini App Setup Guide

## Current Status

✅ **Completed:**
- Farcaster SDK integrated (`@farcaster/miniapp-sdk`)
- `/mini` route with mobile-optimized UI
- Manifest file at `/.well-known/farcaster.json`
- OpenGraph meta tags (`fc:miniapp`) in `index.html`
- Real-time APY from Aave V3
- Share cast functionality
- Deposit/Withdraw/Donation flows

⚠️ **Requires Action:**
- Account association signature (see below)

## Account Association Setup

The manifest at `client/public/.well-known/farcaster.json` contains placeholder values for `accountAssociation`. You need to generate a real signature to verify domain ownership.

### Steps to Generate Account Association:

1. **Enable Developer Mode in Farcaster:**
   - Visit: https://farcaster.xyz/~/settings/developer-tools
   - Toggle on "Developer Mode"

2. **Generate Account Association:**
   - Go to Farcaster Developer Tools
   - Navigate to "Mini Apps" section
   - Follow the prompts to sign a message proving you control your Farcaster account
   - This will generate the `header`, `payload`, and `signature` values

3. **Update the Manifest:**
   - Replace the placeholder values in `client/public/.well-known/farcaster.json`:
     ```json
     {
       "accountAssociation": {
         "header": "YOUR_ACTUAL_HEADER",
         "payload": "YOUR_ACTUAL_PAYLOAD",
         "signature": "YOUR_ACTUAL_SIGNATURE"
       },
       ...
     }
     ```

4. **Verify:**
   - Use Farcaster's manifest audit tool to verify your manifest is valid
   - URL: https://farcaster.xyz/~/developer-tools/manifest-audit

## Testing Your Mini App

### In Development:
1. Run the app locally: `npm run dev`
2. Visit: http://localhost:5000/mini
3. The SDK will initialize automatically

### In Farcaster Client:
1. Deploy your app to Replit
2. Share a URL to your app in a cast
3. The `fc:miniapp` meta tags will create a rich embed
4. Users can click "Earn Yield" to launch the mini app

## Manifest Configuration

The manifest includes:
- **App Name:** Boost - Yield Revolution
- **Home URL:** /mini
- **Splash Color:** #10b981 (emerald)
- **Required Chain:** Celo (eip155:42220)
- **Capabilities:**
  - Sign In with Farcaster
  - Ethereum provider access
  - Compose cast

## Image Requirements

Farcaster mini apps require specific image dimensions:

- **Splash Image:** 200x200px (icon.png)
- **Embed Image:** 3:2 aspect ratio (og-image.png)
- **Icon:** Any size (icon.png)

All images are served from `client/public/`.

## Resources

- [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/)
- [SDK Reference](https://miniapps.farcaster.xyz/docs/sdk/context)
- [Manifest Specification](https://miniapps.farcaster.xyz/docs/specification)
- [Developer Tools](https://farcaster.xyz/~/settings/developer-tools)
