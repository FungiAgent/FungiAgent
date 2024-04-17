import React from 'react';
import TxSummary from './TxSummary';
import ConfirmationButtons from './ConfirmationButtons';

// Define props interface
interface ConfirmationBoxSwapProps {
  confirmAction: () => void;
  rejectAction: () => void;
  isConfirmed: boolean;
  exchangeRate: number;
  priceImpact: number;
  networkCost: number;
  maxSlippage: number;
}

const ConfirmationBoxSwap = ({
  confirmAction,
  rejectAction,
  isConfirmed,
  exchangeRate,
  priceImpact,
  networkCost,
  maxSlippage
}: ConfirmationBoxSwapProps) => {
    return (
        <div className="space-y-4">
            <TxSummary 
              exchangeRate={exchangeRate} 
              priceImpact={priceImpact} 
              networkCost={networkCost} 
              maxSlippage={maxSlippage} 
            />
            <ConfirmationButtons 
              confirmAction={confirmAction} 
              rejectAction={rejectAction} 
              isConfirmed={isConfirmed} 
            />
        </div>
    );
};

export default ConfirmationBoxSwap;
