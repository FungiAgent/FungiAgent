import { Alchemy, Network, AssetTransfersCategory, AssetTransfersResult } from 'alchemy-sdk';
import { Transaction } from './types';

const alchemyConfig = {
  apiKey: process.env.ARBITRUM_API_KEY, // Ensure this is correctly set in your environment
  network: Network.ARB_MAINNET
};

const alchemy = new Alchemy(alchemyConfig);

export const getTransactionHistory = async (address: string): Promise<Transaction[]> => {
  try {
    console.log('Calling Alchemy API for address:', address);
    const data = await alchemy.core.getAssetTransfers({
      fromBlock: '0x0',
      fromAddress: address,
      maxCount: 10,
      category: [
        AssetTransfersCategory.ERC20,
      ],
    });
    console.log('Data received from Alchemy:', data);

    return data.transfers.map((tx: AssetTransfersResult) => ({
      date: new Date(parseInt(tx.blockNum, 16) * 1000).toLocaleDateString(),
      id: tx.hash,
      amount: tx.value,
      from: tx.from,
      to: tx.to,
      status: tx.uniqueId ? 'Confirmed' : 'Pending',
    }));
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
};
