// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./LendingPool.sol";
import "./InterestRateCalculator.sol";

contract Liquidation {
    using SafeMath for uint256;

    LendingPool public lendingPool;
    InterestRateCalculator public interestRateCalculator;

    uint256 public constant LIQUIDATION_THRESHOLD = 110; // Corresponds to a 1.1 health factor

    mapping(address => uint256) public liquidationBonuses;

    constructor(address _lendingPool, address _interestRateCalculator) {
        lendingPool = LendingPool(_lendingPool);
        interestRateCalculator = InterestRateCalculator(_interestRateCalculator);
    }

    function liquidate(address _borrower) external {
    uint256 healthFactor = lendingPool.healthFactor(_borrower);
    require(healthFactor < LIQUIDATION_THRESHOLD, "Loan is not undercollateralized");

    uint256 collateralETH = lendingPool.ETHDeposits(_borrower);
    uint256 borrowedAmount = lendingPool.borrowedUSDT(_borrower);

    uint256 repayPercentage = getRepayPercentage(healthFactor);
    uint256 interestAmount = lendingPool.getInterestAmount(_borrower);
    uint256 totalRepayAmount = borrowedAmount.add(interestAmount);
    uint256 repayAmount = totalRepayAmount.mul(repayPercentage).div(100);

    IERC20 USDT = IERC20(lendingPool.USDT());
    lendingPool.increaseTotalUSDTDeposits(repayAmount);
    USDT.transferFrom(msg.sender, address(lendingPool), repayAmount);
    
    uint256 collateralPortion = collateralETH.mul(repayAmount).div(totalRepayAmount);
    uint256 liquidationBonus = collateralPortion.mul(5).div(100); // 5% liquidation bonus
    
     
  //  lendingPool.updateETHDeposits(totalCollateralToTransfer);
    
    
    liquidationBonuses[msg.sender] = liquidationBonuses[msg.sender].add(liquidationBonus);

}


    function getLiquidationBonus(address _user) public view returns (uint256) {
        return liquidationBonuses[_user];
    }
    function getRepayAmount(address _borrower) public view returns (uint256) {
    uint256 healthFactor = lendingPool.healthFactor(_borrower);
    uint256 borrowedAmount = lendingPool.borrowedUSDT(_borrower);
    uint256 interestAmount = lendingPool.getInterestAmount(_borrower);
    uint256 totalRepayAmount = borrowedAmount.add(interestAmount);
    uint256 repayPercentage = getRepayPercentage(healthFactor);
    uint256 repayAmount = totalRepayAmount.mul(repayPercentage).div(100);
    return repayAmount;
}

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
    }

    function getTotalCollateralIncludingBonus(address _user) public view returns (uint256) {
        return lendingPool.ETHDeposits(_user).add(liquidationBonuses[_user]);
    }



    function getRepayPercentage(uint256 healthFactor) public pure returns (uint256) {
        uint256 buffer = 10; // 10% buffer above the liquidation threshold
        uint256 maxHealthFactor = LIQUIDATION_THRESHOLD.add(LIQUIDATION_THRESHOLD.mul(buffer).div(100));
        if (healthFactor >= maxHealthFactor) {
            return 0;
        }
        uint256 range = maxHealthFactor.sub(LIQUIDATION_THRESHOLD);
        uint256 difference = maxHealthFactor.sub(healthFactor);
        uint256 repayPercentage = difference.mul(100).div(range);
        return repayPercentage;
    }
}
