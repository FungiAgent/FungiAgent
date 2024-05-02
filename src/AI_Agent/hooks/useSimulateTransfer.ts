// useSimulateTransfer.ts
import { useState, useMemo } from "react";
import { BigNumber } from "ethers";
import { useNotification } from '@/context/NotificationContextProvider';
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { useSimUO } from "@/hooks/useSimUO";
import { useChatHistory } from '@/AI_Agent/Context/ChatHistoryContext';
import { SystemMessage } from '@langchain/core/messages';

export const useSimulateTransfer = () => {
    const { showNotification } = useNotification();
    const { simResult, simStatus, simTransfer } = useSimUO();
    const [simulationResult, setSimulationResult] = useState<any>(null);
    const [status, sendTransferUO] = useERC20Transfer();
    const { addMessage } = useChatHistory();

    const simulateTransfer = useMemo(() => {
        const handleSimulateTransfer = async (params: any) => {
            const { tokenAddress, amount, recipient } = params;

            if (
                tokenAddress === undefined ||
                amount === undefined ||
                recipient === undefined ||
                typeof sendTransferUO !== "function"
            ) {
                showNotification({
                    message: "Error simulating transfer",
                    type: "error",
                });
                return Promise.resolve();
            }

            try {
                const resultTx: any = await sendTransferUO(tokenAddress, BigNumber.from(amount), recipient);
                const result: any = await simTransfer(resultTx);

                if (!result || result.error) {
                    throw new Error(result?.error || "Simulation failed. No result returned.");
                }

                setSimulationResult(result);
                await addMessage(new SystemMessage(`Simulation result: ${JSON.stringify(result)}`));
                showNotification({
                    message: "Transfer simulated successfully",
                    type: "success",
                });
            } catch (error: any) {
                showNotification({
                    message: error.message,
                    type: "error",
                });
                setSimulationResult(null);
                await addMessage(new SystemMessage(error.message));
            }
        };

        return handleSimulateTransfer;
    }, [sendTransferUO, showNotification, simTransfer, addMessage]);

    return { simulationResult, simulateTransfer, simStatus };
};
