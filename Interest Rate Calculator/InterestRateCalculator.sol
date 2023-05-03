// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract InterestRateCalculator is Ownable {
    using SafeMath for uint256;

    AggregatorV3Interface public ethUsdPriceFeed;

    uint256 public demoEthUsdPrice;
    bool public demoMode;

    constructor(address _ethUsdPriceFeed) {
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
    }

    function getLatestETHUSDPrice() public view returns (uint256) {
        if (demoMode) {
            return demoEthUsdPrice;
        } else {
            (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
            return uint256(price);
        }
    }

    function toggleDemoMode() external onlyOwner {
        demoMode = !demoMode;
    }

    function setLatestETHUSDPrice(uint256 newPrice) external onlyOwner {
        demoEthUsdPrice = newPrice;
    }

    function calculateBorrowableAmount(uint256 collateralETH) public view returns (uint256) {
        uint256 ethUsdPrice = getLatestETHUSDPrice();
        uint256 collateralInUSD = collateralETH.mul(ethUsdPrice);
        return collateralInUSD.mul(75).div(100); // 75% LTV (Loan-to-Value)
    }

    function calculateCollateralValue(uint256 collateralETH) public view returns (uint256) {
        uint256 ethUsdPrice = getLatestETHUSDPrice();
        return collateralETH.mul(ethUsdPrice);
    }

    function calculateInterestRate(uint256 totalBorrowedUSDT, uint256 totalDepositedUSDT) public pure returns (uint256) {
        uint256 utilizationRate = totalBorrowedUSDT.mul(1e18).div(totalDepositedUSDT);

        // Define a simple interest rate model:
        // - Base rate: 2%
        // - Additional rate: 18% (for 100% utilization)
        uint256 baseRate = 2 * 1e16; // 2%
        uint256 additionalRate = utilizationRate.mul(18).div(100); // Up to 18% for 100% utilization

        uint256 interestRate = baseRate.add(additionalRate);
        return interestRate;
    }
}