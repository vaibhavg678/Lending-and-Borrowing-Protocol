async function initWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else {
      console.log("Please install MetaMask!");
    }
  }

async function setLatestETHUSDPrice() {
    const ethUsdPrice = document.getElementById('ethUsdPrice').value;
    const ethUsdPriceInWei = web3.utils.toWei(ethUsdPrice, 'ether');
    try {
        await interestRateCalculator.methods.setLatestETHUSDPrice(ethUsdPriceInWei).send({ from: accounts[0] });
        alert('Latest ETH/USD price set successfully');
    } catch (error) {
        console.error(error);
        alert('Error setting latest ETH/USD price');
    }
}

async function toggleDemoMode() {
    try {
        await interestRateCalculator.methods.toggleDemoMode().send({ from: accounts[0] });
        alert('Demo mode toggled successfully');
    } catch (error) {
        console.error(error);
        alert('Error toggling demo mode');
    }
}


// Calculate Borrowable Amount
async function calculateBorrowableAmount() {
    const ethCollateralAmount = document.getElementById('ethCollateralAmount').value;
    const weiCollateralAmount = web3.utils.toWei(ethCollateralAmount, 'ether');
    try {
        const borrowableAmountInWei = await interestRateCalculator.methods.calculateBorrowableAmount(weiCollateralAmount).call();
        const borrowableAmount = web3.utils.fromWei(borrowableAmountInWei, 'mwei');
        alert(`Borrowable USDT Amount: ${borrowableAmount}`);
    } catch (error) {
        console.error(error);
        alert('Error calculating borrowable amount');
    }
}

async function calculateCollateralValue() {
    const borrowedUsdtAmount = document.getElementById('borrowedUsdtAmount').value;
    const borrowedUsdtAmountInWei = web3.utils.toWei(borrowedUsdtAmount, 'mwei');
    try {
        const collateralValueInWei = await interestRateCalculator.methods.calculateCollateralValue(borrowedUsdtAmountInWei).call();
        const collateralValue = web3.utils.fromWei(collateralValueInWei, 'ether');
        alert(`Collateral Value in ETH: ${collateralValue}`);
    } catch (error) {
        console.error(error);
        alert('Error calculating collateral value');
    }
}

async function calculateInterestRate() {
    const borrowedUsdtAmount = document.getElementById('borrowedUsdtAmountForInterestRate').value;
    const borrowedUsdtAmountInWei = web3.utils.toWei(borrowedUsdtAmount, 'mwei');
    try {
        const interestRate = await interestRateCalculator.methods.calculateInterestRate(borrowedUsdtAmountInWei).call();
        alert(`Interest Rate: ${interestRate}%`);
    } catch (error) {
        console.error(error);
        alert('Error calculating interest rate');
    }
}

async function displayDemoModeStatus() {
    try {
      const demoMode = await liquidationContract.methods.demoMode().call();
      if (demoMode) {
        document.getElementById('demoModeStatus').innerText = "Demo Mode: ON";
      } else {
        document.getElementById('demoModeStatus').innerText = "Demo Mode: OFF";
      }
    } catch (error) {
      console.error("Error fetching demo mode status:", error);
    }
  }
  

async function getLatestETHUSDPrice() {
    try {
        const latestPrice = await interestRateCalculator.methods.getLatestETHUSDPrice().call();
        const latestPriceInUSD = web3.utils.fromWei(latestPrice, 'ether');
        alert(`Latest ETH/USD Price: ${latestPriceInUSD} USD`);
    } catch (error) {
        console.error(error);
        alert('Error getting latest ETH/USD price');
    }
}



document.getElementById('setLatestETHUSDPrice').addEventListener('click', setLatestETHUSDPrice);
document.getElementById('toggleDemoMode').addEventListener('click', toggleDemoMode);
document.getElementById('calculateBorrowableAmount').addEventListener('click', calculateBorrowableAmount);
document.getElementById('calculateCollateralValue').addEventListener('click', calculateCollateralValue);
document.getElementById('calculateInterestRate').addEventListener('click', calculateInterestRate);
document.getElementById('demoEthUsdPrice').addEventListener('click', demoEthUsdPrice);
document.getElementById('demoMode').addEventListener('click', demoMode);
document.getElementById('ethUsdPriceFeed').addEventListener('click', ethUsdPriceFeed);
document.getElementById('getLatestETHUSDPrice').addEventListener('click', getLatestETHUSDPrice);



initWeb3().then(() => {
    initInterestRateCalculatorContract().then(() => {
      displayDemoModeStatus();
    });
  });