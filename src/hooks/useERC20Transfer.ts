import { useState } from "react";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { getCallDataTransfer } from "@/lib/userOperations/getCallDataTransfer";
import { BigNumber } from "alchemy-sdk";
import { UserOperation } from "@/lib/userOperations/types";
import { ethers } from "ethers";

export const useERC20Transfer = (
    tokenIn?: string,
    amountIn?: BigNumber,
    recipient?: string,
) => {
    // State to manage the status of the transfer
    const [status, setStatus] = useState<{
        disabled: boolean;
        text: string | null;
    }>({ disabled: true, text: "Enter an amount" });

    // Function to handle the ERC20 or native ETH transfer
    const sendTransferUO = async (
        tokenInParam?: string,
        amountInParam?: BigNumber,
        recipientParam?: string,
    ) => {
        try {
            // Update the status to indicate that the transfer is in progress
            setStatus({
                disabled: true,
                text: "Transferring...",
            });

            // Array to hold the user operations
            const userOps: UserOperation[] = [];

            // Use the parameters passed to the function or fallback to the hook parameters
            const tokenToUse = tokenInParam || tokenIn;
            const amountToUse = amountInParam || amountIn;
            const recipientToUse = recipientParam || recipient;

            // Ensure all necessary parameters are provided
            if (tokenToUse && amountToUse && recipientToUse) {
                if (tokenToUse !== ethers.constants.AddressZero) {
                    // Handle ERC20 transfer
                    userOps.push(
                        createApproveTokensUserOp({
                            tokenAddress: tokenToUse,
                            spender: recipientToUse,
                            amount: amountToUse,
                        }),
                    );
                    const callData = getCallDataTransfer(
                        recipientToUse,
                        tokenToUse,
                        amountToUse.toString(),
                    );
                    userOps.push(callData);
                } else {
                    // Handle native ETH transfer
                    const targetAddress = ethers.utils.getAddress(
                        recipientToUse,
                    ) as `0x${string}`;
                    userOps.push({
                        target: targetAddress,
                        data: "0x" as `0x${string}`,
                        value: BigInt(amountToUse.toString()), // Value in wei as bigint
                    });
                }

                // Reset the status to the default state
                setStatus({ disabled: true, text: "Enter an amount" });
                return userOps;
            } else {
                throw new Error("Missing required parameters for transfer");
            }
        } catch (error) {
            // Handle errors and reset the status to the default state
            setStatus({ disabled: true, text: "Enter an amount" });
            console.error(error);
        }
    };

    return [status, sendTransferUO];
};
