import React from 'react';
import TxSummarySimple from './TxSimple';
import ConfirmationButtons from './ConfirmationButtons';

const ConfirmationBox = ({ confirmAction, rejectAction, isConfirmed }) => {
    return (
        <div className="space-y-4">
            <TxSummarySimple amountToSend={100} tokenIn="USDC" recipient="0x1234567890" gasCost={50} />
            <ConfirmationButtons confirmAction={confirmAction} rejectAction={rejectAction} isConfirmed={isConfirmed} />
        </div>
    );
};

export default ConfirmationBox;