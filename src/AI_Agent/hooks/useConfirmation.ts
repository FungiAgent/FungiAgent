import { useState, useCallback } from 'react';
import { useHandleSend } from '@/AI_Agent/hooks/useHandleSend';
import { useLiFiTx } from '@/AI_Agent/hooks';

export enum ConfirmationType {
    Simple = 'Simple',
    Batch = 'Batch',
    Swap = 'Swap'
}

interface ConfirmationDetails {
    message: string;
    type: ConfirmationType; // Use the enum for type safety
    action?: () => Promise<void>;
    recipient?: string;
    gasCost?: number;
    feeCost?: number;
    amountToSend?: number;
    amountWithDecimals?: number;
    amountToReceive?: number;
    amountToReceiveDecimals?: number;
    tokenIn?: string; // Token address
    tokenInDecimals?: number;
    tokenOut?: string; // Token address
    tokenOutDecimals?: number;
    exchangeRate?: number;
    maxSlippage?: number;
    tokenInLogo?: string; // Logo URL
    tokenOutLogo?: string; // Logo URL
    tokenInSymbol?: string; // Token symbol e.g. USDC
    tokenOutSymbol?: string; // Token symbol e.g. ETH
    tool?: string; // Tool chosen for swapping. e.g. Uniswap
    fromAddress?: string; // Address of the sender
    fromChainId?: number; // Chain ID of the sender
    toChainId?: number; // Chain ID of the recipient
}

export const useConfirmation = () => {
    const [params, setParams] = useState<any>({}); // Add the type of params if needed
    const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showConfirmationBox, setShowConfirmationBox] = useState(false);
    const { handleSend } = useHandleSend();
    const { sendLiFiTx } = useLiFiTx();

    const confirmAction = useCallback(async () => {
        if (confirmationDetails) {
            setIsConfirmed(true);
            try {
                if (confirmationDetails.type === ConfirmationType.Simple) {
                    await handleSend({
                        tokenAddress: confirmationDetails.tokenIn,
                        amount: confirmationDetails.amountToSend,
                        recipient: confirmationDetails.recipient
                    });
                } else if (confirmationDetails.type === ConfirmationType.Swap) {
                    await sendLiFiTx(params);
                }
                setShowConfirmationBox(false);
                setConfirmationDetails(null);
            } catch (error) {
                console.error(`${confirmationDetails.type} transaction failed:`, error);
                setIsConfirmed(false);
            }
        }
    }, [confirmationDetails, handleSend, params, sendLiFiTx]);
    

    const rejectAction = useCallback(() => {
        setIsConfirmed(false);
        setShowConfirmationBox(false);
        setConfirmationDetails(null);
    }, []);

    return { 
        confirmationDetails, setConfirmationDetails, 
        isConfirmed, setIsConfirmed, 
        showConfirmationBox, setShowConfirmationBox, 
        confirmAction, rejectAction, setParams 
    };
};
