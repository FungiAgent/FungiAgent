// useSimulateTransfer.ts
import { useState, useCallback } from "react";
import { BigNumber } from "ethers";
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { useSimUO } from "@/hooks/useSimUO";
import { useNotification } from "@/context/NotificationContextProvider";

export const useSimulateTransfer = () => {
    const { showNotification } = useNotification();
    const { simTransfer } = useSimUO();
    const [status, sendTransferUO] = useERC20Transfer();
    const [simulationResult, setSimulationResult] = useState<any>(null);

    const simulateTransfer = useCallback(
        async (params: any) => {
            const { tokenAddress, amount, recipient } = params;

            if (
                !tokenAddress ||
                !amount ||
                !recipient ||
                typeof sendTransferUO !== "function"
            ) {
                showNotification({
                    message: "Invalid parameters for simulating transfer.",
                    type: "error",
                });
                setSimulationResult(null); // Clear previous results
                return null;
            }

            try {
                const resultTx: any = await sendTransferUO(
                    tokenAddress,
                    BigNumber.from(amount),
                    recipient,
                );
                const simulation: any = await simTransfer(resultTx);

                if (!simulation || simulation.error) {
                    throw new Error(simulation?.error || "Simulation failed.");
                }

                setSimulationResult(simulation);
                showNotification({
                    message: "Transfer simulated successfully.",
                    type: "success",
                });

                return { userOp: resultTx, simulationResult: simulation };
            } catch (error: any) {
                showNotification({
                    message: error.message,
                    type: "error",
                });
                setSimulationResult(null);
                return null;
            }
        },
        [sendTransferUO, showNotification, simTransfer],
    );

    return { simulateTransfer, simulationResult, status };
};
