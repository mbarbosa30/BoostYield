// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// ============ Interfaces ============

interface IPool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

interface IAToken is IERC20 {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);
}

/**
 * @title BoostAaveVault
 * @notice ERC4626-compliant vault that deposits cUSD into Aave V3 on Celo
 * @dev Implements yield-as-donation: users can donate % of profits to vetted causes
 */
contract BoostAaveVault is ERC20, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ State Variables ============

    IPool public immutable POOL;
    IERC20 public immutable ASSET;
    address public immutable ATOKEN;

    // User donation settings
    mapping(address => uint8) public donationPctOf;      // 0-100
    mapping(address => address) public beneficiaryOf;     // Cause address
    mapping(address => uint256) public principalOf;       // Original deposits (in assets)

    // ============ Events ============

    event DonationSet(address indexed user, uint8 pct, address cause);
    event Donated(address indexed user, uint256 amount, address indexed cause);

    // ============ Constructor ============

    constructor(
        address pool_,
        address asset_
    ) ERC20("Boost cUSD Vault", "bcUSD") {
        require(pool_ != address(0), "Invalid pool");
        require(asset_ != address(0), "Invalid asset");

        POOL = IPool(pool_);
        ASSET = IERC20(asset_);

        // Get aToken address from Aave pool
        // For Celo mainnet cUSD, the aToken is 0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB
        ATOKEN = 0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB;

        // Approve Aave pool to spend assets
        ASSET.forceApprove(address(POOL), type(uint256).max);
    }

    // ============ ERC4626-like Functions ============

    /**
     * @notice Deposit assets and mint shares
     * @param assets Amount of cUSD to deposit
     * @param receiver Address to receive vault shares
     * @return shares Amount of shares minted
     */
    function deposit(uint256 assets, address receiver) external nonReentrant returns (uint256 shares) {
        require(assets > 0, "Cannot deposit 0");
        require(receiver != address(0), "Invalid receiver");

        // Calculate shares to mint (1:1 initially, then based on total assets)
        shares = previewDeposit(assets);
        require(shares > 0, "Zero shares");

        // Track principal for this deposit
        principalOf[receiver] += assets;

        // Transfer assets from user
        ASSET.safeTransferFrom(msg.sender, address(this), assets);

        // Supply to Aave
        POOL.supply(address(ASSET), assets, address(this), 0);

        // Mint shares to receiver
        _mint(receiver, shares);

        return shares;
    }

    /**
     * @notice Redeem shares for assets
     * @param shares Amount of shares to burn
     * @param receiver Address to receive withdrawn assets (after donation)
     * @param owner Owner of the shares
     * @return assets Amount of assets withdrawn
     */
    function redeem(uint256 shares, address receiver, address owner) external nonReentrant returns (uint256 assets) {
        require(shares > 0, "Cannot redeem 0");
        require(receiver != address(0), "Invalid receiver");

        // Check allowance if caller is not owner
        if (msg.sender != owner) {
            uint256 currentAllowance = allowance(owner, msg.sender);
            require(currentAllowance >= shares, "Insufficient allowance");
            if (currentAllowance != type(uint256).max) {
                _approve(owner, msg.sender, currentAllowance - shares);
            }
        }

        // Calculate assets to withdraw
        assets = previewRedeem(shares);
        require(assets > 0, "Zero assets");

        // Calculate pro-rata principal for shares being redeemed
        uint256 totalUserShares = balanceOf(owner);
        uint256 userPrincipal = principalOf[owner];
        uint256 principalForShares = totalUserShares > 0 
            ? (userPrincipal * shares) / totalUserShares 
            : 0;

        // Update principal - ALWAYS reduce by pro-rata amount
        principalOf[owner] = userPrincipal > principalForShares 
            ? userPrincipal - principalForShares 
            : 0;

        // Burn shares
        _burn(owner, shares);

        // Withdraw from Aave (get underlying assets)
        uint256 withdrawn = POOL.withdraw(address(ASSET), assets, address(this));

        // Calculate donation (only on profits, never principal)
        uint256 profit = withdrawn > principalForShares ? withdrawn - principalForShares : 0;
        uint256 donation = (profit * donationPctOf[owner]) / 100;
        uint256 netAmount = withdrawn - donation;

        // Transfer donation in cUSD to beneficiary if set
        if (donation > 0 && beneficiaryOf[owner] != address(0)) {
            ASSET.safeTransfer(beneficiaryOf[owner], donation);
            emit Donated(owner, donation, beneficiaryOf[owner]);
        }

        // Transfer net amount (or full withdrawal if no donation) to receiver in cUSD
        ASSET.safeTransfer(receiver, donation > 0 ? netAmount : withdrawn);

        return withdrawn;
    }

    /**
     * @notice Preview how many shares will be minted for assets
     */
    function previewDeposit(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? assets : (assets * supply) / totalAssets();
    }

    /**
     * @notice Preview how many assets will be received for shares
     */
    function previewRedeem(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? 0 : (shares * totalAssets()) / supply;
    }

    /**
     * @notice Total assets held by vault (in Aave)
     */
    function totalAssets() public view returns (uint256) {
        return IAToken(ATOKEN).balanceOf(address(this));
    }

    /**
     * @notice Decimals (matches cUSD)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }

    // ============ Donation Settings ============

    /**
     * @notice Set donation percentage and beneficiary
     * @param pct Percentage of profits to donate (0-100)
     * @param cause Address to receive donations
     */
    function setMyDonation(uint8 pct, address cause) external {
        require(pct <= 100, "Invalid percentage");
        require(cause != address(0) || pct == 0, "Invalid cause");

        donationPctOf[msg.sender] = pct;
        beneficiaryOf[msg.sender] = cause;

        emit DonationSet(msg.sender, pct, cause);
    }
}
