import { useState, useMemo } from "react";
import { BigNumber, ethers } from "ethers";
import { useNotification } from '@/context/NotificationContextProvider';
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useChatHistory } from '@/context/ChatHistoryContext';
import { SystemMessage } from '@langchain/core/messages';

export const useHandleSend = () => {
  // Hook to display notifications
  const { showNotification } = useNotification();
  
  // State to keep track of the transfer status
  const [updatedSendTransfer, setUpdatedSendTransfer] = useState<any>(null);

  // Hook to initiate ERC20 transfer and get its status
  const [status, sendTransferUO] = useERC20Transfer();

  // Hook to send user operations
  const { sendUserOperations } = useUserOperations();

  // Hook to add messages to the chat history
  const { addMessage } = useChatHistory();

  // useMemo to memoize the handleSend function to avoid unnecessary re-renders
  const handleSend = useMemo(() => {
    // Function to handle the transfer of tokens
    const handleSendTransfer = async (params: any) => {
      const { tokenAddress, amount, recipient, tokenDecimals } = params;

      // Validate the input parameters
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
        // Convert the amount to the appropriate format based on token decimals
        const rawAmount = BigNumber.from((parseFloat(amount) * Math.pow(10, tokenAddress === ethers.constants.AddressZero ? 18 : tokenDecimals)).toString());
        
        // Generate the user operations for the transfer
        const userOps = await sendTransferUO(tokenAddress, rawAmount, recipient);

        if (userOps) {
          // Send the user operations
          const resultTx: any = await sendUserOperations(userOps, tokenAddress === ethers.constants.AddressZero ? rawAmount.toHexString() : '0x0');
          
          // Add a system message to the chat history
          await addMessage(new SystemMessage(`Sending ${amount} tokens of ${tokenAddress} to ${recipient}`));
          
          // Perform the actual transfer
          const result: any = await sendUserOperations(resultTx);
          setUpdatedSendTransfer(result);
          
          // Notify the user of success
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
        // Handle any errors that occur during the transfer process
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

  // Return the transfer status and the handleSend function
  return { updatedSendTransfer, handleSend };
};
