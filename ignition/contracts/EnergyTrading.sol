// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title EnergyTrading
/// @notice Facilitates peer-to-peer energy trading using tokens
/// @dev Optimized for gas efficiency and security
contract EnergyTrading {
    // Custom errors
    error Unauthorized();
    error ContractIsPaused();
    error AlreadyRegistered();
    error NotRegistered();
    error InsufficientPayment();
    error InsufficientBalance();
    error InactiveOffer();
    error InsufficientEnergy();
    error InvalidParameters();
    error TransferFailed();

    // Constants
    uint256 private constant TOKEN_PRICE = 0.001 ether;
    uint256 private constant MAX_INT96 = type(uint96).max;

    // State variables packed for optimal storage
    address public immutable owner;
    bool public paused;
    uint248 public offerCount;

    // Structs optimized for storage packing
    struct User {
        uint96 energyTokenBalance;
        uint96 solarCapacity;
        uint96 storageCapacity;
        bool hasSolarPanels;
        bool hasBatteryStorage;
        bool isRegistered;
    }

    struct EnergyOffer {
        address seller;
        uint96 amount;
        uint96 pricePerUnit;
        uint32 timestamp;
        bool isActive;
    }

    // Mappings
    mapping(address => User) private users;
    mapping(uint256 => EnergyOffer) private energyOffers;
    // New mapping to track active offers
    mapping(uint256 => bool) private activeOfferIds;
    
    // Events
    event UserRegistered(address indexed user, uint96 solarCapacity, uint96 storageCapacity);
    event EnergyOffered(uint256 indexed offerId, address indexed seller, uint96 amount, uint96 pricePerUnit);
    event EnergyPurchased(uint256 indexed offerId, address indexed buyer, address indexed seller, uint96 amount, uint256 totalPrice);
    event EnergyTokensMinted(address indexed user, uint96 amount);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);

    constructor() {
        owner = msg.sender;
    }

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier notPaused() {
        if (paused) revert ContractIsPaused();
        _;
    }

    modifier onlyRegistered() {
        if (!users[msg.sender].isRegistered) revert NotRegistered();
        _;
    }

    // External functions
    function pause() external onlyOwner {
        paused = true;
        emit ContractPaused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit ContractUnpaused(msg.sender);
    }

    function registerUser(
        bool _hasSolarPanels,
        bool _hasBatteryStorage,
        uint96 _solarCapacity,
        uint96 _storageCapacity
    ) external notPaused {
        if (users[msg.sender].isRegistered) revert AlreadyRegistered();
        
        // Validate capacity values
        if (_hasSolarPanels && _solarCapacity == 0) revert InvalidParameters();
        if (_hasBatteryStorage && _storageCapacity == 0) revert InvalidParameters();
        
        users[msg.sender] = User({
            energyTokenBalance: 0,
            solarCapacity: _solarCapacity,
            storageCapacity: _storageCapacity,
            hasSolarPanels: _hasSolarPanels,
            hasBatteryStorage: _hasBatteryStorage,
            isRegistered: true
        });
        
        emit UserRegistered(msg.sender, _solarCapacity, _storageCapacity);
    }

    function getUserInfo(address _user) external view returns (
        uint96 energyTokenBalance,
        uint96 solarCapacity,
        uint96 storageCapacity,
        bool hasSolarPanels,
        bool hasBatteryStorage,
        bool isRegistered
    ) {
        User storage user = users[_user];
        return (
            user.energyTokenBalance,
            user.solarCapacity,
            user.storageCapacity,
            user.hasSolarPanels,
            user.hasBatteryStorage,
            user.isRegistered
        );
    }

    function mintEnergyTokens(uint96 _amount) external payable notPaused onlyRegistered {
        if (_amount == 0) revert InvalidParameters();
        
        uint256 cost = uint256(_amount) * TOKEN_PRICE;
        if (msg.value < cost) revert InsufficientPayment();
        
        // Check for overflow
        uint256 newBalance = users[msg.sender].energyTokenBalance + _amount;
        if (newBalance > MAX_INT96) revert InvalidParameters();
        
        users[msg.sender].energyTokenBalance = uint96(newBalance);
        emit EnergyTokensMinted(msg.sender, _amount);
        
        uint256 excess = msg.value - cost;
        if (excess > 0) {
            _safeTransferETH(msg.sender, excess);
        }
    }

    function createEnergyOffer(uint96 _amount, uint96 _pricePerUnit) external notPaused onlyRegistered {
        if (_amount == 0 || _pricePerUnit == 0) revert InvalidParameters();
        if (users[msg.sender].energyTokenBalance < _amount) revert InsufficientBalance();
        
        users[msg.sender].energyTokenBalance -= _amount;
        
        uint256 currentOfferId = offerCount;
        energyOffers[currentOfferId] = EnergyOffer({
            seller: msg.sender,
            amount: _amount,
            pricePerUnit: _pricePerUnit,
            timestamp: uint32(block.timestamp),
            isActive: true
        });
        
        activeOfferIds[currentOfferId] = true;
        emit EnergyOffered(currentOfferId, msg.sender, _amount, _pricePerUnit);
        
        unchecked {
            offerCount++;
        }
    }

    function purchaseEnergy(uint256 _offerId, uint96 _amount) external payable notPaused onlyRegistered {
        EnergyOffer storage offer = energyOffers[_offerId];
        if (!offer.isActive) revert InactiveOffer();
        if (_amount == 0) revert InvalidParameters();
        if (_amount > offer.amount) revert InsufficientEnergy();
        
        uint256 totalCost = uint256(_amount) * offer.pricePerUnit;
        if (msg.value < totalCost) revert InsufficientPayment();
        
        offer.amount -= _amount;
        if (offer.amount == 0) {
            offer.isActive = false;
            activeOfferIds[_offerId] = false;
        }
        
        // Check for overflow
        uint256 newBalance = users[msg.sender].energyTokenBalance + _amount;
        if (newBalance > MAX_INT96) revert InvalidParameters();
        users[msg.sender].energyTokenBalance = uint96(newBalance);
        
        // Process payments
        uint256 excess = msg.value - totalCost;
        _safeTransferETH(offer.seller, totalCost);
        
        if (excess > 0) {
            _safeTransferETH(msg.sender, excess);
        }
        
        emit EnergyPurchased(_offerId, msg.sender, offer.seller, _amount, totalCost);
    }

    function getActiveOffers() external view returns (uint256[] memory) {
        uint256 activeCount;
        
        // First pass: count active offers
        for (uint256 i = 0; i < offerCount;) {
            if (activeOfferIds[i]) {
                unchecked { ++activeCount; }
            }
            unchecked { ++i; }
        }
        
        // Create array of exact size needed
        uint256[] memory result = new uint256[](activeCount);
        
        // Second pass: populate array
        if (activeCount > 0) {
            uint256 currentIndex;
            for (uint256 i = 0; i < offerCount;) {
                if (activeOfferIds[i]) {
                    result[currentIndex] = i;
                    unchecked { ++currentIndex; }
                }
                unchecked { ++i; }
            }
        }
        
        return result;
    }

    function getUserBalance(address _user) external view returns (uint96) {
        return users[_user].energyTokenBalance;
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        _safeTransferETH(owner, balance);
    }

    // Internal functions
    function _safeTransferETH(address to, uint256 value) private {
        (bool success, ) = to.call{value: value}("");
        if (!success) revert TransferFailed();
    }
}