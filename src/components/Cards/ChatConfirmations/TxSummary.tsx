import React, { useState } from 'react';
import Image from 'next/image';

const TxSummaryHeader = ({ isExpanded, handleArrowClick, amountToSwap, amountToReceive, tokenIn, tokenOut, gasCost }) => {
  return (
    <div className="flex justify-between items-center h-[38px] rounded-full bg-white w-[454px]">
      <div className="flex items-center p-[15px] pl-5">
        <span>{amountToSwap} {tokenIn} = {amountToReceive} {tokenOut}</span>
      </div>
      <Image src="/GasStation.svg" width={20} height={20} alt="Gas Station" />
      <p>
        <span>${gasCost}</span>
      </p>
      <div className="cursor-pointer pr-[15px]" onClick={handleArrowClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

const TxSummaryDetails = ({ isExpanded, priceImpact, networkCost, maxSlippage }) => {
  return (
    isExpanded && (
      <div className="w-[454px] border-gray-300 pt-4 bg-white h-[129px] rounded-[20px]">
        <div className="flex justify-between pl-[15px] pr-[15px]">
          <span>Price Impact</span>
          <span>{priceImpact}%</span>
        </div>
        <div className="flex justify-between pl-[15px] pr-[15px] pt-3">
          <span>Network Cost</span>
          <span>${networkCost}</span>
        </div>
        <div className="flex justify-between pl-[15px] pr-[15px] pt-3">
          <span>Max Slippage</span>
          <span>{maxSlippage}%</span>
        </div>
      </div>
    )
  );
};

const TxSummary = ({ exchangeRate, priceImpact, networkCost, maxSlippage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleArrowClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-[454px]">
      <TxSummaryHeader
        isExpanded={isExpanded}
        handleArrowClick={handleArrowClick}
        amountToSwap={100}
        amountToReceive={exchangeRate * 100}
        tokenIn="USDC"
        tokenOut="ETH"
        gasCost={50}
      />
      <br />
      <TxSummaryDetails
        isExpanded={isExpanded}
        priceImpact={priceImpact}
        networkCost={networkCost}
        maxSlippage={maxSlippage}
      />
    </div>
  );
};

export default TxSummary;