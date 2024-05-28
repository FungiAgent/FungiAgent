import React from 'react';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';

type TransactionHistoryTableProps = {
  formatCurrency: (value: number) => string;
};

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ formatCurrency }) => {
    const { transactions, isLoading, error } = useTransactionHistory();

    console.log('Transactions:', transactions);
    console.log('Is Loading:', isLoading);
    console.log('Error:', error);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {(error as Error).message}</div>;
    }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
            {transactions.map((transaction, index) => (
                <tr key={index}>
                    <td>{transaction.date}</td>
                    <td>{transaction.id}</td>
                    <td>{formatCurrency(transaction.amount ?? 0)}</td>
                    <td>{transaction.from}</td>
                    <td>{transaction.to}</td>
                    <td>{transaction.status}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistoryTable;
