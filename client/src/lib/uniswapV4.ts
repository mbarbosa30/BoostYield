// Uniswap v4 integration for Celo mainnet
// Official deployment addresses from https://docs.celo.org/tooling/contracts/uniswap-contracts

export const UNISWAP_V4_ADDRESSES = {
  poolManager: '0x288dc841A52FCA2707c6947B3A777c5E56cd87BC' as const,
  universalRouter: '0xcb695bc5d3aa22cad1e6df07801b061a05a0233a' as const,
  permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3' as const,
  quoter: '0x28566da1093609182dff2cb2a91cfd72e61d66cd' as const,
  stateView: '0xbc21f8720babf4b20d195ee5c6e99c52b76f2bfb' as const,
};

// Minimal Universal Router ABI for swap execution
export const UNIVERSAL_ROUTER_ABI = [
  {
    inputs: [
      { internalType: 'bytes', name: 'commands', type: 'bytes' },
      { internalType: 'bytes[]', name: 'inputs', type: 'bytes[]' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' }
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
] as const;

// Permit2 ABI for token approvals
export const PERMIT2_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint160', name: 'amount', type: 'uint160' },
      { internalType: 'uint48', name: 'expiration', type: 'uint48' }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'allowance',
    outputs: [
      { internalType: 'uint160', name: 'amount', type: 'uint160' },
      { internalType: 'uint48', name: 'expiration', type: 'uint48' },
      { internalType: 'uint48', name: 'nonce', type: 'uint48' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// V4 Quoter ABI for getting swap quotes
export const V4_QUOTER_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'currency0', type: 'address' },
          { internalType: 'address', name: 'currency1', type: 'address' },
          { internalType: 'uint24', name: 'fee', type: 'uint24' },
          { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
          { internalType: 'address', name: 'hooks', type: 'address' }
        ],
        internalType: 'struct PoolKey',
        name: 'poolKey',
        type: 'tuple'
      },
      { internalType: 'bool', name: 'zeroForOne', type: 'bool' },
      { internalType: 'uint128', name: 'exactAmount', type: 'uint128' }
    ],
    name: 'quoteExactInputSingle',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// Universal Router V4_SWAP command
export const COMMANDS = {
  V4_SWAP: '0x00',
  WRAP_ETH: '0x0b',
  UNWRAP_WETH: '0x0c',
  PERMIT2_TRANSFER_FROM: '0x01',
} as const;
