import React, { useState } from 'react';
import Image from 'next/image';
import { Transaction, TransactionDetails } from '@/lib/alchemy/types';
import ClipboardIcon from '/public/img/clipboard-svgrepo-com.svg';
import ClipboardCheckIcon from '/public/img/clipboard-check-svgrepo-com.svg';
import { shortenAddress, copyToClipboard } from '@/utils';

type TransactionRowProps = {
  transaction: Transaction;
  details?: TransactionDetails;
  formatCurrency: (value: number) => string;
};

const TransactionRow: React.FC<TransactionRowProps> = React.memo(({ transaction, details, formatCurrency }) => {
  const dateTime = details ? new Date(details.timestamp * 1000).toLocaleString() : 'Loading...';
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, key: string) => {
    copyToClipboard(text);
    setCopied(prevState => ({ ...prevState, [key]: true }));
    setTimeout(() => {
      setCopied(prevState => ({ ...prevState, [key]: false }));
    }, 2000);
  };

  const renderSwapDetails = () => (
    <>
      <p className="text-blue-600 font-semibold">{dateTime}</p>
      <p className="font-bold text-xl">Swapped</p>
      <p className="text-lg">{formatCurrency(transaction.amount ?? 0)} {transaction.tokenSymbol} for {formatCurrency(transaction.receivedAmount ?? 0)} {transaction.receivedTokenSymbol}</p>
      <p className="text-gray-600">
        To: {shortenAddress(transaction.to || 'Unknown')}
        <button onClick={() => handleCopy(transaction.to || 'Unknown', transaction.to || 'Unknown')} className="ml-2">
          <Image src={copied[transaction.to || 'Unknown'] ? ClipboardCheckIcon : ClipboardIcon} alt="Copy Icon" width={16} height={16} />
        </button>
      </p>
      <p className="text-gray-500">
        Hash: {shortenAddress(transaction.id)}
        <button onClick={() => handleCopy(transaction.id, transaction.id)} className="ml-2">
          <Image src={copied[transaction.id] ? ClipboardCheckIcon : ClipboardIcon} alt="Copy Icon" width={16} height={16} />
        </button>
      </p>
    </>
  );

  const renderOtherDetails = () => (
    <>
      <p className="text-blue-600 font-semibold">{dateTime}</p>
      <p className="font-bold text-xl">{transaction.operationType}</p>
      <p className="text-lg">{formatCurrency(transaction.amount ?? 0)} {transaction.tokenSymbol} to {shortenAddress(transaction.to || 'Unknown')}</p>
      <p className="text-gray-600">
        To: {shortenAddress(transaction.to || 'Unknown')}
        <button onClick={() => handleCopy(transaction.to || 'Unknown', transaction.to || 'Unknown')} className="ml-2">
          <Image src={copied[transaction.to || 'Unknown'] ? ClipboardCheckIcon : ClipboardIcon} alt="Copy Icon" width={16} height={16} />
        </button>
      </p>
      <p className="text-gray-500">
        Hash: {shortenAddress(transaction.id)}
        <button onClick={() => handleCopy(transaction.id, transaction.id)} className="ml-2">
          <Image src={copied[transaction.id] ? ClipboardCheckIcon : ClipboardIcon} alt="Copy Icon" width={16} height={16} />
        </button>
      </p>
    </>
  );

  return (
    <div className="p-4 bg-white">
      {transaction.operationType === 'Swap' ? renderSwapDetails() : renderOtherDetails()}
    </div>
  );
});

export default TransactionRow;
