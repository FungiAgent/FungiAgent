import React from 'react';
import TxSummarySimple from './TxSimple';
import ConfirmationButtons from './ConfirmationButtons';

// Define props interface for clarity
interface ConfirmationBoxSimpleProps {
  confirmAction: () => void;
  rejectAction: () => void;
  isConfirmed: boolean;
  amountWithDecimals: number | undefined;
  tokenInSymbol: string | undefined;
  recipient: string | undefined;
  gasCost: number | undefined;
  tokenInLogo?: string | undefined;
}

const ConfirmationBoxSimple = ({
  confirmAction,
  rejectAction,
  isConfirmed,
  amountWithDecimals,
  tokenInSymbol,
  recipient,
  gasCost,
  tokenInLogo,
}: ConfirmationBoxSimpleProps) => {
    return (
        <div className="space-y-4">
            <TxSummarySimple 
              tokenInSymbol={tokenInSymbol} 
              recipient={recipient} 
              gasCost={gasCost} 
              tokenInLogo={tokenInLogo}
              amountWithDecimals={amountWithDecimals}
            />
            <ConfirmationButtons 
              confirmAction={confirmAction} 
              rejectAction={rejectAction} 
              isConfirmed={isConfirmed} 
            />
        </div>
    );
};

export default ConfirmationBoxSimple;
