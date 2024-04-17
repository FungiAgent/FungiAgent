import React, { useState } from 'react';
import Image from 'next/image';

const TxSummarySimple = ({ amountToSend, tokenIn, recipient, gasCost }) => {
  return (
    <div className="flex justify-between items-center h-[38px] rounded-full bg-white w-[454px]">
        <div className="flex items-center p-[15px] pl-5">
            <span>{amountToSend} {tokenIn} to {recipient}</span>
        </div>
        <Image src="/GasStation.svg" width={20} height={20} alt="Gas Station" />
        <p className="pr-4">
            <span>${gasCost}</span>
        </p>
    </div>
  );
};

export default TxSummarySimple;