// BoostAaveVault contract ABI
// Generated from the Solidity contract provided
export const BoostVaultABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "pool_", "type": "address" },
      { "internalType": "address", "name": "asset_", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "cause", "type": "address" }
    ],
    "name": "Donated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "pct", "type": "uint8" },
      { "indexed": false, "internalType": "address", "name": "cause", "type": "address" }
    ],
    "name": "DonationSet",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ATOKEN",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ASSET",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "POOL",
    "outputs": [{ "internalType": "contract IPool", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "beneficiaryOf",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "assets", "type": "uint256" },
      { "internalType": "address", "name": "receiver", "type": "address" }
    ],
    "name": "deposit",
    "outputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "donationPctOf",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "principalOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "shares", "type": "uint256" },
      { "internalType": "address", "name": "receiver", "type": "address" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "redeem",
    "outputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint8", "name": "pct", "type": "uint8" },
      { "internalType": "address", "name": "cause", "type": "address" }
    ],
    "name": "setMyDonation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAssets",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
    "name": "previewRedeem",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
    "name": "previewDeposit",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// cUSD token address on Celo mainnet
export const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122E05401653187cE' as const;

// Contract addresses - to be set after deployment
export const BOOST_VAULT_ADDRESS = import.meta.env.VITE_BOOST_VAULT_ADDRESS as `0x${string}` | undefined;
