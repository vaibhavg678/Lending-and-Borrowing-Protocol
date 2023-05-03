// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./InterestRateCalculator.sol";

contract LendingPool {
    using SafeMath for uint256;

    IERC20 public USDT;
    InterestRateCalculator public interestRateCalculator;

    uint256 public totalETHDeposits;
    uint256 public totalUSDTDeposits;

    mapping(address => uint256) public ETHDeposits;
    mapping(address => uint256) public borrowedUSDT;
    mapping(address => uint256) public borrowedUSDTTimestamp;
    mapping(address => uint256) public USDTDeposits;

    constructor(address _USDT, address _interestRateCalculator) {
        USDT = IERC20(_USDT);
        interestRateCalculator = InterestRateCalculator(_interestRateCalculator);
    }

    function depositETH() external payable returns (uint256) {
        totalETHDeposits = totalETHDeposits.add(msg.value);
        ETHDeposits[msg.sender] = ETHDeposits[msg.sender].add(msg.value);
        return ETHDeposits[msg.sender];
    }

    function depositUSDT(uint256 _amount) external {
        USDT.transferFrom(msg.sender, address(this), _amount);
        totalUSDTDeposits = totalUSDTDeposits.add(_amount);
        USDTDeposits[msg.sender] = USDTDeposits[msg.sender].add(_amount);
    }

    function updateETHDeposits(uint256 _amount) external {
    totalETHDeposits = totalETHDeposits.sub(_amount);
}
    function increaseTotalUSDTDeposits(uint256 _amount) external {
    totalUSDTDeposits = totalUSDTDeposits.add(_amount);
}


    function borrowUSDT(uint256 _amount) external {
        uint256 collateralETH = ETHDeposits[msg.sender];
        uint256 borrowableAmount = interestRateCalculator.calculateBorrowableAmount(collateralETH);
        require(borrowableAmount >= _amount, "Insufficient collateral");

        USDT.transfer(msg.sender, _amount);

        totalUSDTDeposits = totalUSDTDeposits.sub(_amount);
        borrowedUSDT[msg.sender] = _amount;
        borrowedUSDTTimestamp[msg.sender] = block.timestamp;
    }

    function healthFactor(address _user) public view returns (uint256) {
        uint256 collateralValue = interestRateCalculator.calculateCollateralValue(ETHDeposits[_user]);
        uint256 borrowedValue = borrowedUSDT[_user];

        if (borrowedValue == 0) {
            return type(uint256).max;
        }

        return collateralValue.mul(100).div(borrowedValue);
    }

    function getInterestAmount(address _user) public view returns (uint256) {
    uint256 elapsedTime = block.timestamp.sub(borrowedUSDTTimestamp[_user]);
    uint256 interestRate = interestRateCalculator.calculateInterestRate(totalUSDTDeposits, totalETHDeposits);
    uint256 interestAmount = borrowedUSDT[_user].mul(interestRate).div(1e18).mul(elapsedTime).div(365 * 24 * 60 * 60);

    return interestAmount;
}


    function repayedUSDT(uint256 _amount) external returns (uint256) {
    require(_amount > 0, "Repay amount must be greater than 0");

    uint256 interestAmount = getInterestAmount(msg.sender);
    uint256 totalRepayAmount = borrowedUSDT[msg.sender].add(interestAmount);

    if (_amount >= totalRepayAmount) {
        USDT.transferFrom(msg.sender, address(this), totalRepayAmount);
        totalUSDTDeposits = totalUSDTDeposits.add(totalRepayAmount);
        borrowedUSDT[msg.sender] = 0;
        borrowedUSDTTimestamp[msg.sender] = 0;
    } else {
        USDT.transferFrom(msg.sender, address(this), _amount);
        totalUSDTDeposits = totalUSDTDeposits.add(_amount);
        borrowedUSDT[msg.sender] = borrowedUSDT[msg.sender].sub(_amount);
    }

    return totalRepayAmount;
}


}