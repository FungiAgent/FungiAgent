import React, { useState, useEffect } from 'react';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import getTransactionDetails from '@/lib/alchemy/getTransactionDetails';
import { TransactionDetails } from '@/lib/alchemy/types';

type TransactionHistoryTableProps = {
  formatCurrency: (value: number) => string;
};

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ formatCurrency }) => {
  const { transactions, isLoading, error, fetchTransactions, pageKey } = useTransactionHistory();
  const [transactionDetails, setTransactionDetails] = useState<{ [key: string]: TransactionDetails }>({});

  useEffect(() => {
    const fetchDetails = async () => {
      const detailsMap: { [key: string]: TransactionDetails } = {};
      for (const transaction of transactions) {
        try {
          const details = await getTransactionDetails(transaction.id);
          console.log('Transaction Details:', details); // Log for debugging
          detailsMap[transaction.id] = details;
        } catch (e) {
          console.error('Failed to fetch transaction details', e);
        }
      }
      setTransactionDetails(detailsMap);
    };

    if (transactions.length > 0) {
      fetchDetails();
    }
  }, [transactions]);

  const handleNextPage = () => {
    if (pageKey) {
      fetchTransactions(pageKey);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Separate swap transactions and received transactions
  const swaps = transactions.filter(tx => tx.operationType === 'Swap');
  const received = transactions.filter(tx => tx.operationType === 'Received');

  return (
    <div>
      <div>
        {swaps.map((transaction, index) => {
          const details = transactionDetails[transaction.id];
          const receivedTx = received.find(tx => tx.id === transaction.id);
          const receivedAmount = receivedTx ? formatCurrency(receivedTx.amount ?? 0) : 'Loading...';
          const receivedSymbol = receivedTx ? receivedTx.tokenSymbol : '';
          const date = details ? new Date(details.timestamp * 1000).toLocaleDateString() : 'Loading...';
          console.log('Transaction ID:', transaction.id, 'Timestamp:', details?.timestamp);

          return (
            <div key={index} className="transaction">
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Swapped:</strong> {formatCurrency(transaction.amount ?? 0)} {transaction.tokenSymbol} for {receivedAmount} {receivedSymbol}</p>
              <p><strong>To:</strong> {transaction.to || 'Unknown'}</p>
              <p><strong>Hash:</strong> {transaction.id}</p>
              <hr />
            </div>
          );
        })}
        {transactions.filter(tx => tx.operationType !== 'Swap').map((transaction, index) => {
          const date = transactionDetails[transaction.id] ? new Date(transactionDetails[transaction.id].timestamp * 1000).toLocaleDateString() : 'Loading...';

          return (
            <div key={index} className="transaction">
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Amount:</strong> {formatCurrency(transaction.amount ?? 0)} {transaction.tokenSymbol}</p>
              <p><strong>To:</strong> {transaction.to || 'Unknown'}</p>
              <p><strong>Operation Type:</strong> {transaction.operationType}</p>
              <p><strong>Hash:</strong> {transaction.id}</p>
              <hr />
            </div>
          );
        })}
      </div>
      <div className="pagination-buttons">
        <button onClick={handleNextPage} disabled={!pageKey}>
          Load More
        </button>
      </div>
    </div>
  );
};

export default TransactionHistoryTable;
