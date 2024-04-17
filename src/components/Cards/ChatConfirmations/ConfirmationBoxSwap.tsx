import React from 'react';
import TxSummary from './TxSummary';
import ConfirmationButtons from './ConfirmationButtons';

const ConfirmationBoxSwap = ({ confirmAction, rejectAction, isConfirmed }) => {
    return (
        <div className="space-y-4">
            <TxSummary usdcToEthRate={0.01} priceImpact={0.5} networkCost={0.5} maxSlippage={0.5} />
            <ConfirmationButtons confirmAction={confirmAction} rejectAction={rejectAction} isConfirmed={isConfirmed} />
        </div>
    );
};

export default ConfirmationBoxSwap;