# Lending-and-Borrowing-Protocol

Lending and borrowing protocols on Ethereum are decentralized finance (DeFi) applications that allow users to lend and borrow assets without the need for traditional financial intermediaries like banks. These protocols use smart contracts to automate the lending and borrowing process, ensuring trustless and transparent transactions.

Here is the overview of how protocol works:

1. Depositing assets: Lenders deposit their assets (such as ETH, stablecoins, or other ERC20 tokens) into the lending protocol. In return, they receive interest-earning tokens, often referred to as aTokens or cTokens, depending on the protocol. These tokens represent the lender's share in the lending pool and accrue interest over time.

2. Interest rates: The protocol algorithmically determines the interest rates for both lending or borrowing, based on factors such as the supply and demand of the assets in the pool. As the demand for borrowing an asset increases, interest rates for both lending and borrowing that asset also increase.

**Here we have taken consideration of block.timestamp involved in calculation of interest rate**.

3. Borrowing assets: Borrowers can take out loans by depositing collateral (usually in the form of crypto assets) into the protocol. The collateral's value must exceed the value of the borrowed asset to account for potential price fluctuations and minimize the risk of default. The borrowing limit is defined by the health factor, which varies depending on the live pricing of collateral(**which we are getting from chainlink in our project**) of the asset involved and also on how much amount a borrower has borrowed.
 
If the value of health factor drops below a level which we defined it as Liquidation Threshold then collateral of borrowed would be liquidated.

4. Repaying loans: Borrowers are required to repay their loans, along with the accrued interest, within the specified time frame or risk having their collateral liquidated. Borrowers can repay their loans partially or in full at any time during the loan period. 

5. Liquidation: If the value of the collateral falls below the specified Health Factor, the protocol may liquidate the borrower's collateral to ensure that the lender's funds are protected. Liquidation is typically carried out by other users who receive a bonus for liquidating the under-collateralized positions.

So in this way the Lending and Borrowing protocol works on the basis of how much collateral a borrower has deposited, live pricing of the collateral borrowed how much amount he/she has borrowed, total deposits available by a particular lender in lending pool and has deposited. 
