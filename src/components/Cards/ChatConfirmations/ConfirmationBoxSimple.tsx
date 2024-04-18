import React from 'react';
import TxSummarySimple from './TxSimple';
import ConfirmationButtons from './ConfirmationButtons';

// Define props interface for clarity
interface ConfirmationBoxSimpleProps {
  confirmAction: () => void;
  rejectAction: () => void;
  isConfirmed: boolean;
  amountToSend: number | undefined;
  tokenIn: string | undefined;
  recipient: string | undefined;
  gasCost: number | undefined;
  logo?: string | undefined;
}

const ConfirmationBoxSimple = ({
  confirmAction,
  rejectAction,
  isConfirmed,
  amountToSend,
  tokenIn,
  recipient,
  gasCost,
  logo,
}: ConfirmationBoxSimpleProps) => {
    return (
        <div className="space-y-4">
            <TxSummarySimple 
              amountToSend={amountToSend} 
              tokenIn={tokenIn} 
              recipient={recipient} 
              gasCost={gasCost} 
              logo={logo}
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
