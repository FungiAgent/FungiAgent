import React from 'react';
import TxBatch from './TxBatch';
import ConfirmationButtons from './ConfirmationButtons';

const ConfirmationBoxBatch = ({ confirmAction, rejectAction, isConfirmed }) => {
    return (
        <div className="space-y-4">
            <TxBatch tokens={[{ name: 'USD Coin', symbol: 'USDC', logo: '/tokens/USDC.svg' }, { name: 'Ethereum', symbol: 'ETH', logo: '/tokens/ETH.svg' }]} percentages={[50, 50]} priceImpact={0.5} networkCost={0.5} maxSlippage={0.5} />
            <ConfirmationButtons confirmAction={confirmAction} rejectAction={rejectAction} isConfirmed={isConfirmed} />
        </div>
    );
};

export default ConfirmationBoxBatch;