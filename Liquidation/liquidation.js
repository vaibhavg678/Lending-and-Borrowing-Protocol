// liquidation.js

async function initWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else {
      console.log("Please install MetaMask!");
    }
  }
  
  async function initLiquidationContract() {
    const liquidationABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_lendingPool",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_interestRateCalculator",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "LIQUIDATION_THRESHOLD",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getLiquidationBonus",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_borrower",
                    "type": "address"
                }
            ],
            "name": "getRepayAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "healthFactor",
                    "type": "uint256"
                }
            ],
            "name": "getRepayPercentage",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getTotalCollateralIncludingBonus",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "interestRateCalculator",
            "outputs": [
                {
                    "internalType": "contract InterestRateCalculator",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "lendingPool",
            "outputs": [
                {
                    "internalType": "contract LendingPool",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_borrower",
                    "type": "address"
                }
            ],
            "name": "liquidate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "liquidationBonuses",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    const liquidationAddress = 0x35E372e67FA1B36B497A93C4316990D6331EE159;
    const lendingPoolABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_USDT",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_interestRateCalculator",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "ETHDeposits",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "USDT",
            "outputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "USDTDeposits",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "borrowUSDT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "borrowedUSDT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "borrowedUSDTTimestamp",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "depositETH",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "depositUSDT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getInterestAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "healthFactor",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "increaseTotalUSDTDeposits",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "interestRateCalculator",
            "outputs": [
                {
                    "internalType": "contract InterestRateCalculator",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "repayedUSDT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalETHDeposits",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalUSDTDeposits",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "updateETHDeposits",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    const lendingPoolAddress = 0xB609aD6c326F088B20816dDdA38A6B8422DE7D73;
    const interestRateCalculatorABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_ethUsdPriceFeed",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "collateralETH",
                    "type": "uint256"
                }
            ],
            "name": "calculateBorrowableAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "collateralETH",
                    "type": "uint256"
                }
            ],
            "name": "calculateCollateralValue",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "totalBorrowedUSDT",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalDepositedUSDT",
                    "type": "uint256"
                }
            ],
            "name": "calculateInterestRate",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "demoEthUsdPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "demoMode",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ethUsdPriceFeed",
            "outputs": [
                {
                    "internalType": "contract AggregatorV3Interface",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getLatestETHUSDPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "newPrice",
                    "type": "uint256"
                }
            ],
            "name": "setLatestETHUSDPrice",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "toggleDemoMode",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    const interestRateCalculatorAddress = 0x3DC997197321cAb39A6f99b06Ba8Dd2Fbe2188Fb;
  
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const liquidationContract = new web3.eth.Contract(liquidationABI, liquidationAddress);
    const lendingPoolContract = new web3.eth.Contract(lendingPoolABI, lendingPoolAddress);
    const interestRateCalculatorContract = new web3.eth.Contract(interestRateCalculatorABI, interestRateCalculatorAddress);
  
    // Add more functions here for interacting with the Liquidation contract
  }
  
  async function liquidate() {
    const borrower = document.getElementById("borrower").value;
    const accounts = await web3.eth.getAccounts();
    await liquidationContract.methods.liquidate(borrower).send({ from: accounts[0] });
  }
  
  async function deposit() {
    const ethAmount = document.getElementById("ethDepositAmount").value;
    const weiAmount = web3.utils.toWei(ethAmount, "ether");
    const accounts = await web3.eth.getAccounts();
    await liquidationContract.methods.deposit().send({ from: accounts[0], value: weiAmount });
  }

  async function getLiquidationBonus() {
    try {
      const bonus = await liquidationContract.methods.getLiquidationBonus().call();
      document.getElementById('liquidationBonusDisplay').innerText = `Liquidation Bonus: ${bonus}%`;
    } catch (error) {
      console.error(error);
      alert('Error: Unable to fetch liquidation bonus.');
    }
  }
  
  async function getRepayAmount() {
    try {
      const amount = await liquidationContract.methods.getRepayAmount().call();
      document.getElementById('repayAmountDisplay').innerText = `Repay Amount: ${web3.utils.fromWei(amount, 'mwei')} USDT`;
    } catch (error) {
      console.error(error);
      alert('Error: Unable to fetch repay amount.');
    }
  }
  
  async function getRepayPercentage() {
    try {
      const percentage = await liquidationContract.methods.getRepayPercentage().call();
      document.getElementById('repayPercentageDisplay').innerText = `Repay Percentage: ${percentage}%`;
    } catch (error) {
      console.error(error);
      alert('Error: Unable to fetch repay percentage.');
    }
  }
  
  async function getTotalCollateralIncludingBonus() {
    try {
      const total = await liquidationContract.methods.getTotalCollateralIncludingBonus().call();
      document.getElementById('totalCollateralIncludingBonusDisplay').innerText = `Total Collateral Including Bonus: ${web3.utils.fromWei(total, 'ether')} ETH`;
    } catch (error) {
      console.error(error);
      alert('Error: Unable to fetch total collateral including bonus.');
    }
  }
  async function displayLiquidationThreshold() {
    const threshold = await liquidationContract.methods.LIQUIDATION_THRESHOLD().call();
    document.getElementById('liquidationThresholdDisplay').innerText = `Liquidation Threshold: ${threshold}%`;
  }
  
  async function liquidationBonuses() {
    try {
      const bonuses = await liquidationContract.methods.liquidationBonuses().call();
      document.getElementById('liquidationBonusesDisplay').innerText = `Liquidation Bonuses: ${bonuses}`;
    } catch (error) {
      console.error(error);
      alert('Error: Unable to fetch liquidation bonuses.');
    }
  }
  
  document.getElementById('getLiquidationBonus').addEventListener('click', getLiquidationBonus);
document.getElementById('getRepayAmount').addEventListener('click', getRepayAmount);
document.getElementById('getRepayPercentage').addEventListener('click', getRepayPercentage);
document.getElementById('getTotalCollateralIncludingBonus').addEventListener('click', getTotalCollateralIncludingBonus);
document.getElementById('liquidationBonuses').addEventListener('click', liquidationBonuses);

initWeb3().then(() => {
    initLiquidationContract().then(() => {
      // You can remove the displayLiquidationThreshold() function call here,
      // as it will be called when the user clicks the button.
    });
  });
  