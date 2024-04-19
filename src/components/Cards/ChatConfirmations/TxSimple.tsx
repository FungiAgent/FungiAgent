import React from 'react';
import Image from 'next/image';

const TxSummarySimple = ({ amountWithDecimals, symbol, recipient, gasCost, logo }) => {
  // Function to shorten the recipient address
  const getShortAddress = (address) => {
    if (typeof address === 'string' && address.length > 10) { // Ensure it's a string and long enough
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address; // Return original if not applicable
};

  return (
    <div className="flex justify-between items-center h-[38px] rounded-full bg-white w-[454px] shadow">
        <div className="flex items-center pl-5">
            {logo && <Image src={logo} width={20} height={20} alt={symbol} className="mr-2" />}
            <span className="mr-4">{amountWithDecimals} {symbol} to {getShortAddress(recipient)}</span>
        </div>
        <div className="flex items-center">
            <Image src="/GasStation.svg" width={20} height={20} alt="Gas Station" />
            <p className="pr-4 pl-2">{gasCost} wei</p>
        </div>
    </div>
  );
};

export default TxSummarySimple;
