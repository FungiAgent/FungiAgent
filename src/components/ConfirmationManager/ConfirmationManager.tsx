import React from "react";
import { ConfirmationType } from "@/hooks/useConfirmation";
import ConfirmationBoxSimple from "@/components/Cards/ChatConfirmations/ConfirmationBoxSimple";
import ConfirmationBoxBatch from "@/components/Cards/ChatConfirmations/ConfirmationBoxBatch";
import ConfirmationBoxSwap from "@/components/Cards/ChatConfirmations/ConfirmationBoxSwap";

export const ConfirmationManager = ({
    confirmationDetails,
    confirmAction,
    rejectAction,
    showConfirmationBox,
    isConfirmed,
    setIsConfirmed,
}) => {
    if (!confirmationDetails || !showConfirmationBox) {
        return null;
    }

    try {
        switch (confirmationDetails.type) {
            case ConfirmationType.Simple:
                return (
                    <ConfirmationBoxSimple
                        confirmAction={confirmAction}
                        rejectAction={rejectAction}
                        isConfirmed={isConfirmed}
                        amountWithDecimals={
                            confirmationDetails.amountWithDecimals
                        }
                        tokenInSymbol={confirmationDetails.tokenInSymbol}
                        recipient={confirmationDetails.recipient}
                        gasCost={confirmationDetails.gasCost}
                        tokenInLogo={confirmationDetails.tokenInLogo}
                    />
                );

            case ConfirmationType.Batch:
                return (
                    <ConfirmationBoxBatch
                        confirmAction={confirmAction}
                        rejectAction={rejectAction}
                        isConfirmed={isConfirmed}
                        tokens={[]}
                        percentages={[0.5, 0.5]}
                        priceImpact={0.01}
                        networkCost={0.0001}
                        maxSlippage={0.01}
                    />
                );
            case ConfirmationType.Swap:
                return (
                    <ConfirmationBoxSwap
                        confirmAction={confirmAction}
                        rejectAction={rejectAction}
                        isConfirmed={isConfirmed}
                        amountToSwap={confirmationDetails.amountToSend}
                        amountToReceive={confirmationDetails.amountToReceiveMin}
                        tokenInSymbol={confirmationDetails.fromTokenSymbol}
                        tokenOutSymbol={confirmationDetails.toTokenSymbol}
                        tokenInLogo={confirmationDetails.fromTokenLogoURI}
                        tokenOutLogo={confirmationDetails.toTokenLogoURI}
                        tool={confirmationDetails.toolName}
                        gasCost={confirmationDetails.gasCost}
                        // feeCost={confirmationDetails.feeCost}
                        maxSlippage={confirmationDetails.slippage}
                    />
                );
            default:
                return <p>Error: Unknown confirmation type.</p>;
        }
    } catch (error) {
        console.error("Error rendering confirmation box:", error);
        return <p>Error displaying confirmation details.</p>;
    }
};
