import React from 'react';
import TxSummarySimple from './TxSimple';
import ConfirmationButtons from './ConfirmationButtons';

// Define props interface for clarity
interface ConfirmationBoxSimpleProps {
  confirmAction: () => void;
  rejectAction: () => void;
  isConfirmed: boolean;
  amountWithDecimals: number | undefined;
  symbol: string | undefined;
  recipient: string | undefined;
  gasCost: number | undefined;
  logo?: string | undefined;
}

const ConfirmationBoxSimple = ({
  confirmAction,
  rejectAction,
  isConfirmed,
  amountWithDecimals,
  symbol,
  recipient,
  gasCost,
  logo,
}: ConfirmationBoxSimpleProps) => {
    return (
        <div className="space-y-4">
            <TxSummarySimple 
              symbol={symbol} 
              recipient={recipient} 
              gasCost={gasCost} 
              logo={logo}
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
