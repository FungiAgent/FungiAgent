import { useState, useMemo } from "react";
import { BigNumber } from "ethers";
import { useNotification } from '@/context/NotificationContextProvider';
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useChatHistory } from '@/AI_Agent/Context/ChatHistoryContext';
import { SystemMessage } from '@langchain/core/messages';

export const useHandleSend = () => {
  const { showNotification } = useNotification();
  const [updatedSendTransfer, setUpdatedSendTransfer] = useState<any>(null);
  const [status, sendTransfer] = useERC20Transfer();
  const { sendUserOperations } = useUserOperations();
  const { addMessage } = useChatHistory();

  const handleSend = useMemo(() => {
    const handleSendTransfer = async (params: any) => {
      const { tokenAddress, amount, recipient } = params;

      if (
        tokenAddress === undefined ||
        amount === undefined ||
        recipient === undefined ||
        typeof sendTransfer !== "function"
      ) {
        showNotification({
          message: "Error sending tokens",
          type: "error",
        });
        return Promise.resolve();
      }

      try {
        const resultTx: any = await sendTransfer(tokenAddress, BigNumber.from(amount), recipient);
        console.log("RESULT TX", resultTx);
        await addMessage(new SystemMessage(`Sending ${amount} tokens of ${tokenAddress} to ${recipient}`));
        const result: any = await sendUserOperations(resultTx);
        setUpdatedSendTransfer(result);
        showNotification({
          message: "Transfer successful",
          type: "success",
        });
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
  }, [sendTransfer, showNotification, addMessage, sendUserOperations]);

  return { updatedSendTransfer, handleSend };
};