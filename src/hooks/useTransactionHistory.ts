import { useEffect, useState, useCallback } from 'react';
import { useGlobalContext } from '@/context/FungiContextProvider';
import useWallet from '@/hooks/useWallet';
import { getTransactionHistory } from '@/lib/alchemy/getTransactionHistory';
import { Transaction } from '@/lib/alchemy/types';

export function useTransactionHistory() {
  const { scAccount } = useWallet();
  const { alchemyClient } = useGlobalContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    console.log('Fetching transactions...');
    console.log('Alchemy Client:', alchemyClient);
    console.log('Smart Contract Account:', scAccount);

    if (alchemyClient && scAccount) {
      try {
        const txHistory: Transaction[] = await getTransactionHistory(scAccount);
        console.log('Transaction history fetched:', txHistory);
        if (txHistory) {
          setTransactions(txHistory);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Error fetching transaction history:', e);
        setError(e as any);
        setIsLoading(false);
      }
    } else {
      console.log('Alchemy client or SC account not available.');
    }
  }, [alchemyClient, scAccount]);

  useEffect(() => {
    fetchTransactions();
  }, [alchemyClient, fetchTransactions]);

  return { transactions, isLoading, error, fetchTransactions };
}
