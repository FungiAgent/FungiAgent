import React from 'react';
import TxSummarySimple from './TxSimple';
import ConfirmationButtons from './ConfirmationButtons';

// Define props interface for clarity
interface ConfirmationBoxSimpleProps {
  confirmAction: () => void;
  rejectAction: () => void;
  isConfirmed: boolean;
  amountToSend: number;
  tokenIn: string;
  recipient: string;
  gasCost: number;
}

const ConfirmationBoxSimple = ({
  confirmAction,
  rejectAction,
  isConfirmed,
  amountToSend,
  tokenIn,
  recipient,
  gasCost
}: ConfirmationBoxSimpleProps) => {
    return (
        <div className="space-y-4">
            <TxSummarySimple 
              amountToSend={amountToSend} 
              tokenIn={tokenIn} 
              recipient={recipient} 
              gasCost={gasCost} 
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
