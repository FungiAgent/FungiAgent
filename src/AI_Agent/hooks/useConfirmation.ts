// useConfirmation.ts
import { useState, useCallback } from 'react';
import { useHandleSend } from '@/AI_Agent/hooks/useHandleSend';
import { useSimLiFiTx } from '@/AI_Agent/hooks';
import { useUserOpContext } from '@/AI_Agent/Context/UserOpContext';
import { useUserOperations } from '@/hooks/useUserOperations';

export enum ConfirmationType {
    Simple = 'Simple',
    Batch = 'Batch',
    Swap = 'Swap'
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
    const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showConfirmationBox, setShowConfirmationBox] = useState(false);
    const { handleSend } = useHandleSend();
    const { sendUserOperations } = useUserOperations();
    const { userOp, setUserOp } = useUserOpContext(); // Get the shared state

    const confirmAction = useCallback(async () => {
        if (confirmationDetails && userOp) {
            setIsConfirmed(true);
            console.log("Confirmation Details:", confirmationDetails);
            try {
                if (confirmationDetails.type === ConfirmationType.Simple) {
                    // await handleSend({
                    //     tokenAddress: confirmationDetails.tokenIn,
                    //     amount: confirmationDetails.amountToSend,
                    //     recipient: confirmationDetails.recipient,
                    // });
                    await sendUserOperations(userOp);
                } else if (confirmationDetails.type === ConfirmationType.Swap) {
                    console.log("User Operations to Execute:", userOp);
                    await sendUserOperations(userOp);
                }
                setShowConfirmationBox(false);
                setConfirmationDetails(null);
                setIsConfirmed(false);
            } catch (error) {
                console.error(`${confirmationDetails.type} transaction failed:`, error);
                setIsConfirmed(false);
            }
        }
    }, [confirmationDetails, userOp, handleSend, sendUserOperations]);

    const rejectAction = useCallback(() => {
        setIsConfirmed(false);
        setShowConfirmationBox(false);
        setConfirmationDetails(null);
    }, []);

    return { 
        confirmationDetails, setConfirmationDetails, 
        isConfirmed, setIsConfirmed, 
        showConfirmationBox, setShowConfirmationBox, 
        confirmAction, rejectAction, setUserOp 
    };
};
