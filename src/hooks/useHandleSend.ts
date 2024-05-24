import { useState, useMemo } from "react";
import { BigNumber, ethers } from "ethers";
import { useNotification } from '@/context/NotificationContextProvider';
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useChatHistory } from '@/context/ChatHistoryContext';
import { SystemMessage } from '@langchain/core/messages';

export const useHandleSend = () => {
  const { showNotification } = useNotification();
  const [updatedSendTransfer, setUpdatedSendTransfer] = useState<any>(null);
  const [status, sendTransferUO] = useERC20Transfer();
  const { sendUserOperations } = useUserOperations();
  const { addMessage } = useChatHistory();

  const handleSend = useMemo(() => {
    const handleSendTransfer = async (params: any) => {
      const { tokenAddress, amount, recipient, tokenDecimals } = params;

      if (
        tokenAddress === undefined ||
        amount === undefined ||
        recipient === undefined ||
        tokenDecimals === undefined ||  // Ensure tokenDecimals is checked
        typeof sendTransferUO !== "function"
      ) {
        showNotification({
          message: "Error sending tokens",
          type: "error",
        });
        return Promise.resolve();
      }

      try {
        const rawAmount = BigNumber.from((parseFloat(amount) * Math.pow(10, tokenAddress === ethers.constants.AddressZero ? 18 : tokenDecimals)).toString());
        const userOps = await sendTransferUO(tokenAddress, rawAmount, recipient);

        if (userOps) {
          const resultTx: any = await sendUserOperations(userOps, tokenAddress === ethers.constants.AddressZero ? rawAmount.toHexString() : '0x0');
          
          await addMessage(new SystemMessage(`Sending ${amount} tokens of ${tokenAddress} to ${recipient}`));
          const result: any = await sendUserOperations(resultTx);
          setUpdatedSendTransfer(result);
          showNotification({
            message: "Transfer successful",
            type: "success",
          });
        } else {
          showNotification({
            message: "Error generating user operations",
            type: "error",
          });
        }
      } catch (error: any) {
        showNotification({
          message: error.message,
          type: "error",
        });
        setUpdatedSendTransfer(null); // Clear previous simulation results
        await addMessage(new SystemMessage(error.message));
      }
    };

    return handleSendTransfer;
  }, [sendTransferUO, showNotification, addMessage, sendUserOperations]);

  return { updatedSendTransfer, handleSend };
};
