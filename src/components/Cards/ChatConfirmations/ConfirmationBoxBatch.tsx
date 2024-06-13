import React from "react";
import TxBatch from "./TxBatch";
import ConfirmationButtons from "./ConfirmationButtons";

// Define props interface for clarity and type safety
interface ConfirmationBoxBatchProps {
    confirmAction: () => void;
    rejectAction: () => void;
    isConfirmed: boolean;
    tokens: any[];
    percentages: number[];
    priceImpact: number;
    networkCost: number;
    maxSlippage: number;
}

const ConfirmationBoxBatch = ({
    confirmAction,
    rejectAction,
    isConfirmed,
    tokens,
    percentages,
    priceImpact,
    networkCost,
    maxSlippage,
}: ConfirmationBoxBatchProps) => {
    return (
        <div className="space-y-4">
            <TxBatch
                tokens={tokens}
                percentages={percentages}
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

export default ConfirmationBoxBatch;
