// useConfirmation.ts
import { useState, useCallback } from "react";
import { useHandleSend } from "@/hooks/useHandleSend";
import { useMind } from "@/hooks";
import { useUserOpContext } from "@/context/UserOpContext";
import { useUserOperations } from "@/hooks/useUserOperations";

export enum ConfirmationType {
    Simple = "Simple",
    Batch = "Batch",
    Swap = "Swap",
}

interface ConfirmationDetails {
    message: string;
    type: ConfirmationType;
    action?: () => Promise<void>;
    recipient?: string;
    gasCost?: number;
    feeCost?: number;
    amountToSend?: number;
    amountWithDecimals?: number;
    amountToReceive?: number;
    amountToReceiveDecimals?: number;
    tokenIn?: string;
    tokenInDecimals?: number;
    tokenOut?: string;
    tokenOutDecimals?: number;
    exchangeRate?: number;
    maxSlippage?: number;
    tokenInLogo?: string;
    tokenOutLogo?: string;
    tokenInSymbol?: string;
    tokenOutSymbol?: string;
    tool?: string;
    fromAddress?: string;
    fromChainId?: number;
    toChainId?: number;
}

export const useConfirmation = () => {
    const [confirmationDetails, setConfirmationDetails] =
        useState<ConfirmationDetails | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showConfirmationBox, setShowConfirmationBox] = useState(false);
    const { handleSend } = useHandleSend();
    const { sendUserOperations } = useUserOperations();
    const { userOp, setUserOp } = useUserOpContext(); // Get the shared state
    const { processInternalMessage } = useMind();

    const confirmAction = useCallback(async () => {
        if (confirmationDetails && userOp) {
            setIsConfirmed(true);
            // console.log("Confirmation Details:", confirmationDetails);
            try {
                if (confirmationDetails.type === ConfirmationType.Simple) {
                    await handleSend({
                        tokenAddress: confirmationDetails.tokenIn,
                        amount: confirmationDetails.amountToSend,
                        recipient: confirmationDetails.recipient,
                    });
                    const result = await sendUserOperations(userOp);
                    await processInternalMessage(
                        `The transfer was done successfully with ${JSON.stringify(result, null, 2)}. Now, explain to the user the results of the transaction along with hash information and where this transaction can be viewed on some sort of block explorer.`,
                    );
                } else if (confirmationDetails.type === ConfirmationType.Swap) {
                    // console.log("User Operations to Execute:", userOp);
                    const result = await sendUserOperations(userOp);
                    await processInternalMessage(
                        `The transfer was done successfully with ${JSON.stringify(result, null, 2)}. Now, explain to the user the results of the transaction along with hash information and where this transaction can be viewed on https://arbiscan.io.`,
                    );
                }
                setShowConfirmationBox(false);
                setConfirmationDetails(null);
                setIsConfirmed(false);
            } catch (error) {
                await processInternalMessage(
                    `The transfer failed. Now, explain to the user why this could have happened.`,
                );
                console.error(
                    `${confirmationDetails.type} transaction failed:`,
                    error,
                );
                setIsConfirmed(false);
            }
        }
    }, [confirmationDetails, userOp, handleSend, sendUserOperations]);

    const rejectAction = async () => {
        setIsConfirmed(false);
        setShowConfirmationBox(false);
        await processInternalMessage(
            `The user rejected the transaction. Let them know that you recognize their rejection and ask them if they would like help with anything else. Suggest other things they can do.`,
        );
        setConfirmationDetails(null);
    };

    return {
        confirmationDetails,
        setConfirmationDetails,
        isConfirmed,
        setIsConfirmed,
        showConfirmationBox,
        setShowConfirmationBox,
        confirmAction,
        rejectAction,
        setUserOp,
    };
};
