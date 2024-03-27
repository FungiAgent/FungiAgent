import { useState, useMemo } from "react";
import { BigNumber } from "ethers";
import { useNotification } from '@/context/NotificationContextProvider';
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { useSimUO } from "@/hooks/useSimUO";

export const useSimulateTransfer = () => {
  const { showNotification } = useNotification();
  const { simStatus, simTransfer } = useSimUO();
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [status, sendTransfer] = useERC20Transfer();

  const simulateTransfer = useMemo(() => {
    const handleSimulateTransfer = async (params: any) => {
      const { tokenAddress, amount, recipient } = params;
      console.log(`Simulated transfer of ${amount} tokens of ${tokenAddress} to ${recipient}`);

      if (
        tokenAddress === undefined ||
        amount === undefined ||
        recipient === undefined ||
        typeof sendTransfer !== "function"
      ) {
        showNotification({
          message: "Error simulating transfer",
          type: "error",
        });
        return Promise.resolve();
      }

      try {
        const resultTx: any = await sendTransfer(tokenAddress, BigNumber.from(amount), recipient);
        console.log("RESULT TX", resultTx);
        const result: any = await simTransfer(resultTx);

        if (!result || result.error) {
          throw new Error(result?.error || "Simulation failed. No result returned.");
        }

        setSimulationResult(result);
        showNotification({
          message: "Transfer simulated successfully",
          type: "success",
        });
      } catch (error: any) {
        showNotification({
          message: error.message,
          type: "error",
        });
        setSimulationResult(null); // Clear previous simulation results
      }
    };

    return handleSimulateTransfer;
  }, [showNotification, simTransfer, sendTransfer, setSimulationResult]);

  return { simulationResult, simulateTransfer };
};