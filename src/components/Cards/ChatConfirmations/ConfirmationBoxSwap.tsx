import React from "react";
import TxSummary from "./TxSummary";
import ConfirmationButtons from "./ConfirmationButtons";

// Define props interface
interface ConfirmationBoxSwapProps {
    confirmAction: () => void;
    rejectAction: () => void;
    isConfirmed: boolean;
    amountToSwap: number | undefined;
    amountToReceive: number | undefined;
    tokenInSymbol: string | undefined; // Token symbol
    tokenOutSymbol: string | undefined; // Token symbol
    tokenInLogo: string | undefined; // Logo URL
    tokenOutLogo: string | undefined; // Logo URL
    tool: string | undefined;
    gasCost: number | undefined;
    // feeCost?: number | undefined;
    maxSlippage: number | undefined;
    tokenInDecimals?: number | undefined;
    tokenOutDecimals?: number | undefined;
}

const ConfirmationBoxSwap = ({
    confirmAction,
    rejectAction,
    amountToSwap,
    amountToReceive,
    tokenInSymbol,
    tokenOutSymbol,
    tokenInLogo,
    tokenOutLogo,
    tool,
    gasCost,
    maxSlippage,
    isConfirmed,
    tokenInDecimals,
    tokenOutDecimals,
}: ConfirmationBoxSwapProps) => {
    return (
        <div className="space-y-4">
            <TxSummary
                amountToSwap={amountToSwap}
                amountToReceive={amountToReceive}
                tokenInSymbol={tokenInSymbol}
                tokenOutSymbol={tokenOutSymbol}
                tokenInLogo={tokenInLogo}
                tokenOutLogo={tokenOutLogo}
                tool={tool}
                gasCost={gasCost}
                // feeCost={feeCost}
                maxSlippage={maxSlippage}
                tokenInDecimals={tokenInDecimals}
                tokenOutDecimals={tokenOutDecimals}
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
