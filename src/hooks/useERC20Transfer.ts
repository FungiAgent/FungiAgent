import { useState } from 'react';
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { getCallDataTransfer } from "@/lib/userOperations/getCallDataTransfer";
import { BigNumber } from 'alchemy-sdk';
import { UserOperation } from "@/lib/userOperations/types";
import { ethers } from 'ethers';

export const useERC20Transfer = (
  tokenIn?: string,
  amountIn?: BigNumber,
  recipient?: string
) => {
  const [status, setStatus] = useState<{
    disabled: boolean;
    text: string | null;
  }>({ disabled: true, text: "Enter an amount" });

  const sendTransferUO = async (
    tokenInParam?: string,
    amountInParam?: BigNumber,
    recipientParam?: string
  ) => {
    try {
      setStatus({
        disabled: true,
        text: "Transferring...",
      });

      const userOps: UserOperation[] = [];

      const tokenToUse = tokenInParam || tokenIn;
      const amountToUse = amountInParam || amountIn;
      const recipientToUse = recipientParam || recipient;

      if (tokenToUse && amountToUse && recipientToUse) {
        if (tokenToUse !== ethers.constants.AddressZero) {
          userOps.push(
            createApproveTokensUserOp({
              tokenAddress: tokenToUse,
              spender: recipientToUse,
              amount: amountToUse,
            })
          );

          userOps.push(getCallDataTransfer(recipientToUse, tokenToUse, amountToUse));
        } else {
          userOps.push(getCallDataTransfer(recipientToUse, tokenToUse, amountToUse));
        }

        // Generate approve call data
        const approveOperation = createApproveTokensUserOp({
          tokenAddress: tokenToUse,
          spender: recipientToUse,
          amount: amountToUse,
        });

        // Generate transfer call data
        const transferOperation = getCallDataTransfer(recipientToUse, tokenToUse, amountToUse);

        // Verify the operations are correctly formed
        if (!approveOperation || !transferOperation) {
          throw new Error("Failed to generate call data for approve and/or transfer.");
        }

        setStatus({ disabled: true, text: "Enter an amount" });
        return userOps;
      } else {
        throw new Error("Missing required parameters for transfer");
      }
    } catch (error) {
      setStatus({ disabled: true, text: "Enter an amount" });
      console.error(error);
    }
  };

  return [status, sendTransferUO];
};