import { Alchemy, Network } from 'alchemy-sdk';
import { TransactionDetails } from './types';

const alchemyConfig = {
  apiKey: process.env.ARBITRUM_API_KEY, // Ensure this is correctly set in your environment
  network: Network.ARB_MAINNET,
};

const alchemy = new Alchemy(alchemyConfig);

// Function to get the transaction details
async function getTransactionDetails(txHash: string): Promise<TransactionDetails> {
  try {
    // Fetch the transaction details using Alchemy SDK
    const transaction = await alchemy.core.getTransaction(txHash);
    
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Ensure blockNumber is defined
    if (transaction.blockNumber === null || transaction.blockNumber === undefined) {
      throw new Error("Block number is undefined");
    }

    // Fetch the transaction receipt to get gasUsed and other details
    const receipt = await alchemy.core.getTransactionReceipt(txHash);
    
    if (!receipt) {
      throw new Error("Transaction receipt not found");
    }

    // Fetch the block details to get the timestamp
    const block = await alchemy.core.getBlock(transaction.blockNumber);

    // Log the transaction details for debugging
    console.log('Transaction:', transaction);
    console.log('Receipt:', receipt);

    // Extract received token information from logs
    let receivedTokenSymbol = '';
    let receivedAmount = '';

    receipt.logs.forEach(log => {
        // Parse the log to extract token transfer information
        if (log.topics && log.topics.length > 0 && log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
            const toAddress = '0x' + log.topics[2].slice(26); // Extracting the 'to' address from the log
            if (toAddress.toLowerCase() === (transaction.to ?? '').toLowerCase()) {
                receivedTokenSymbol = 'ERC20'; // This is a placeholder; you might need to fetch token details from the contract address
                receivedAmount = log.data; // This is the amount of tokens received
            }
        }
    });

    return {
      hash: transaction.hash,
      blockNumber: transaction.blockNumber,
      timestamp: block.timestamp,
      from: transaction.from,
      to: transaction.to || "",
      value: transaction.value.toString(),
      gasUsed: receipt.gasUsed.toString(),
      gasPrice: transaction.gasPrice?.toString() || "0", // Provide a fallback value
      input: transaction.data || "", // Use data instead of input
      receivedTokenSymbol,
      receivedAmount,
    };
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
}

export default getTransactionDetails;
