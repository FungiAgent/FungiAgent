// useCreateUserOp.ts
import { useCallback } from 'react';
import { BigNumber } from 'ethers';
import { UserOperation } from "@/lib/userOperations/types";

export const useCreateUserOp = () => {
    const createUserOp = useCallback((params: any) => {
        const { tokenAddress, amount, recipient } = params;

        if (!tokenAddress || !amount || !recipient) {
            console.error("Invalid parameters for creating a user operation.");
            return null;
        }

        try {
            // Create a user operation object
            const userOp: any = {
                // Populate the required fields based on your specific `UserOperation` structure
                to: recipient,
                tokenAddress,
                amount: BigNumber.from(amount),
                // Add any additional fields as needed
            };

            return userOp;
        } catch (error: any) {
            console.error("Error creating user operation:", error);
            return null;
        }
    }, []);

    return { createUserOp };
};
