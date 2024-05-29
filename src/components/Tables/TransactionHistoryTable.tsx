import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import getTransactionDetails from '@/lib/alchemy/getTransactionDetails';
import { Transaction, TransactionDetails } from '@/lib/alchemy/types';
import TransactionRow from './TransactionRow';

type TransactionHistoryTableProps = {
  formatCurrency: (value: number) => string;
};

const ITEMS_PER_PAGE = 10;

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ formatCurrency }) => {
  const { transactions, isLoading, error, fetchTransactions, pageKey } = useTransactionHistory();
  const [transactionDetails, setTransactionDetails] = useState<{ [key: string]: TransactionDetails }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTransactions, setLoadingTransactions] = useState<string[]>([]);

  const fetchTransactionDetails = useCallback(async (tx: Transaction) => {
    if (!transactionDetails[tx.id] && !loadingTransactions.includes(tx.id)) {
      setLoadingTransactions(prev => [...prev, tx.id]);
      try {
        const details = await getTransactionDetails(tx.id);
        setTransactionDetails(prevState => ({
          ...prevState,
          [tx.id]: details,
        }));
      } catch (e) {
        console.error('Failed to fetch transaction details', e);
      } finally {
        setLoadingTransactions(prev => prev.filter(id => id !== tx.id));
      }
    }
  }, [transactionDetails, loadingTransactions]);

  useEffect(() => {
    transactions.forEach(tx => fetchTransactionDetails(tx));
  }, [transactions, fetchTransactionDetails]);

  const handleNextPage = useCallback(() => {
    if (pageKey) {
      fetchTransactions(pageKey);
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [pageKey, fetchTransactions]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);

  const mergedTransactions = useMemo(() => {
    if (isLoading || error) return [];
    return transactions.map(transaction => {
      if (transaction.operationType === 'Swap') {
        const receivedTx = transactions.find(tx => tx.id === transaction.id && tx.operationType === 'Received');
        if (receivedTx) {
          transaction.receivedAmount = receivedTx.amount;
          transaction.receivedTokenSymbol = receivedTx.tokenSymbol;
        }
      }
      return transaction;
    });
  }, [transactions, isLoading, error]);

  const filteredTransactions = useMemo(() => {
    if (isLoading || error) return [];
    return mergedTransactions.filter(tx =>
      !(tx.operationType === 'Received' && tx.from.toLowerCase() === '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae')
    );
  }, [mergedTransactions, isLoading, error]);

  const sortedTransactions = useMemo(() => {
    if (isLoading || error) return [];
    return filteredTransactions.sort((a, b) => {
      const detailsA = transactionDetails[a.id];
      const detailsB = transactionDetails[b.id];
      if (detailsA && detailsB) {
        return detailsB.timestamp - detailsA.timestamp;
      }
      return 0;
    });
  }, [filteredTransactions, transactionDetails, isLoading, error]);

  const paginatedTransactions = useMemo(() => {
    if (isLoading || error) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedTransactions, currentPage, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div>
        {paginatedTransactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            details={transactionDetails[transaction.id]}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded">
          Previous
        </button>
        <button onClick={handleNextPage} disabled={!pageKey} className="px-4 py-2 bg-gray-200 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionHistoryTable;
