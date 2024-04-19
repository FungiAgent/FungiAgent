import { useState, useCallback } from 'react';
import { useHandleSend } from '@/AI_Agent/hooks/useHandleSend';

export enum ConfirmationType {
    Simple = 'Simple',
    Batch = 'Batch',
    Swap = 'Swap'
}

interface ConfirmationDetails {
    message: string;
    type: ConfirmationType; // Use the enum for type safety
    action?: () => Promise<void>;
    recipient?: string | undefined;
    gasCost?: number | undefined;
    amountToSend?: number | undefined;
    amountWithDecimals?: number | undefined;
    tokenIn?: string | undefined; // Token address
    exchangeRate?: number | undefined;
    priceImpact?: number | undefined;
    logo?: string | undefined; // Logo URL
    symbol?: string | undefined; // Token symbol e.g. USDC
  }

export const useConfirmation = () => {
    const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showConfirmationBox, setShowConfirmationBox] = useState(false);
    const { handleSend } = useHandleSend();

    const confirmAction = useCallback(async () => {
        if (confirmationDetails) {
            setIsConfirmed(true);
            try {
                await handleSend({
                    tokenAddress: confirmationDetails.tokenIn, 
                    amount: confirmationDetails.amountToSend, 
                    recipient: confirmationDetails.recipient
                });
                setShowConfirmationBox(false);
                setConfirmationDetails(null);
            } catch (error) {
                console.error('Transaction failed:', error);
                setIsConfirmed(false);
            }
        }
    }, [confirmationDetails]);

    const rejectAction = useCallback(() => {
        setIsConfirmed(false);
        setShowConfirmationBox(false);
        setConfirmationDetails(null);
    }, []);

    return { 
        confirmationDetails, setConfirmationDetails, 
        isConfirmed, setIsConfirmed, 
        showConfirmationBox, setShowConfirmationBox, 
        confirmAction, rejectAction 
    };
};
