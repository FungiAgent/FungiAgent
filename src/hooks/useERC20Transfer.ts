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
  const [status, setStatus] = useState<{ disabled: boolean; text: string | null; }>({ disabled: true, text: "Enter an amount" });

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
          // ERC20 Transfer
          userOps.push(
            createApproveTokensUserOp({
              tokenAddress: tokenToUse,
              spender: recipientToUse,
              amount: amountToUse,
            })
          );
          const callData = getCallDataTransfer(recipientToUse, tokenToUse, amountToUse.toString());
          userOps.push(callData);
        } else {
          // Native ETH Transfer
          const targetAddress = ethers.utils.getAddress(recipientToUse) as `0x${string}`;
          userOps.push({
            target: targetAddress,
            data: '0x' as `0x${string}`,
            value: BigInt(amountToUse.toString()), // Value in wei as bigint
          });
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
