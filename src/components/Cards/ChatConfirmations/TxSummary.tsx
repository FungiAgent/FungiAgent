import React, { useState } from 'react';
import Image from 'next/image';

const TxSummaryHeader = ({ isExpanded, handleArrowClick, amountToSwap, amountToReceive, tokenInSymbol, tokenOutSymbol, tokenInLogo, tokenOutLogo, gasCost, feeCost, tokenInDecimals, tokenOutDecimals }) => {
  const formattedAmountToSwap = Number(amountToSwap) / Math.pow(10, tokenInDecimals);
  const formattedAmountToReceive = (Number(amountToReceive) / Math.pow(10, tokenOutDecimals)).toFixed(3);

  return (
    <div className="flex justify-between items-center h-[38px] rounded-full bg-white w-[454px]">
      <div className="flex items-center p-[15px] pl-5">
        {tokenInLogo && <Image src={tokenInLogo} width={20} height={20} alt={tokenInSymbol} className="mr-2" />}
        <span>{formattedAmountToSwap} {tokenInSymbol} = {formattedAmountToReceive} {tokenOutSymbol}</span>
        {tokenOutLogo && <Image src={tokenOutLogo} width={20} height={20} alt={tokenOutSymbol} className="mr-2" />}
      </div>
      <Image src="/GasStation.svg" width={20} height={20} alt="Gas Station" />
      <p>
      <span>${Number(gasCost) + Number(feeCost)}</span>
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

const TxSummaryDetails = ({ isExpanded, tool, gasCost, feeCost, maxSlippage }) => {
  return (
    isExpanded && (
      <div className="w-[454px] border-gray-300 pt-4 bg-white h-[129px] rounded-[20px]">
        <div className="flex justify-between pl-[15px] pr-[15px]">
          <span>Tool</span>
          <span>{tool}</span>
        </div>
        <div className="flex justify-between pl-[15px] pr-[15px] pt-3">
          <span>Network Cost</span>
          <span>${Number(gasCost) + Number(feeCost)}</span>
        </div>
        <div className="flex justify-between pl-[15px] pr-[15px] pt-3">
          <span>Max Slippage</span>
          <span>{maxSlippage}%</span>
        </div>
      </div>
    )
  );
};

const TxSummary = ({ amountToSwap, amountToReceive, tokenInSymbol, tokenOutSymbol, tokenInLogo, tokenOutLogo, tool, gasCost, feeCost, maxSlippage, tokenInDecimals, tokenOutDecimals }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleArrowClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-[454px]">
      <TxSummaryHeader
        isExpanded={isExpanded}
        handleArrowClick={handleArrowClick}
        amountToSwap={amountToSwap}
        amountToReceive={amountToReceive}
        tokenInSymbol={tokenInSymbol}
        tokenOutSymbol={tokenOutSymbol}
        tokenInLogo={tokenInLogo}
        tokenOutLogo={tokenOutLogo}
        gasCost={gasCost}
        feeCost={feeCost}
        tokenInDecimals={tokenInDecimals}
        tokenOutDecimals={tokenOutDecimals}
      />
      <br />
      <TxSummaryDetails
        isExpanded={isExpanded}
        tool={tool}
        gasCost={gasCost}
        feeCost={feeCost}
        maxSlippage={maxSlippage}
      />
    </div>
  );
};

export default TxSummary;