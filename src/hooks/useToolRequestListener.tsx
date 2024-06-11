import { useEffect } from "react";
import {
    agentCommunicationChannel,
    EVENT_TYPES,
} from "@/agent/AgentCommunicationChannel";
import { useUserOpContext } from "@/context/UserOpContext";
import { ConfirmationType } from "@/hooks/useConfirmation";
import { useNotification } from "@/context/NotificationContextProvider";
import { useMind, useSimLiFiTx } from "@/hooks";
import { useSimulateTransfer } from "./useSimulateTransfer";
import { useChatHistory } from "@/context/ChatHistoryContext";
import { AIMessage, SystemMessage } from "@langchain/core/messages";

export const useToolRequestListener = ({
    setConfirmationDetails,
    setParams,
    setShowConfirmationBox,
}) => {
    const {
        getQuote,
        extractConfirmationDetails,
        createUserOpFromQuote,
        simulateLifiTx,
    } = useSimLiFiTx();
    const { setUserOp } = useUserOpContext();
    const { processInternalMessage } = useMind();
    const { showNotification } = useNotification();
    const { simulateTransfer, simulationResult } = useSimulateTransfer(); // Use the new hook
    const { addMessage, addAIMessage } = useChatHistory();

    useEffect(() => {
        const handleToolRequest = async (data) => {
            const { tool, params } = data;
            console.log(
                "tool and params: ",
                JSON.stringify({ tool, params }, null, 2),
            );

            switch (tool) {
                case "Simulate-Transfer": {
                    console.log("--- IN SIM TRANSFER ---");
                    const result = await simulateTransfer(params); // Simulate transfer
                    if (result) {
                        const { userOp, simulationResult } = result;

                        // Determine if the transaction is sponsored
                        const isSponsored = !simulationResult.changes.some(
                            (change) => change.assetType === "NATIVE",
                        );

                        setConfirmationDetails({
                            message: `Please confirm the transfer of ${params.amount} from ${params.tokenAddress} to ${params.recipient}`,
                            type: ConfirmationType.Simple,
                            amountToSend: simulationResult.changes[1].rawAmount,
                            tokenAddress:
                                simulationResult.changes[1].contractAddress,
                            recipient: simulationResult.changes[1].to,
                            amountWithDecimals:
                                simulationResult.changes[1].amount,
                            tokenInSymbol: simulationResult.changes[1].symbol,
                            tokenInLogo: simulationResult.changes[1].logo,
                            gasCost: isSponsored
                                ? 0
                                : simulationResult.changes[0].amount, // Set gas cost to 0 if sponsored
                        });
                        setUserOp(userOp); // Store user operation
                        setShowConfirmationBox(true);
                    } else {
                        console.error(
                            "Simulation failed or returned an invalid result.",
                        );
                    }
                    break;
                }
                case "LiFi-Simulator": {
                    console.log("--- IN LIFI SIM ---");

                    console.log("1. Getting quote...");
                    const quote = await getQuote(params);
                    console.log("2. Extracting details...");

                    const confirmationDetails =
                        extractConfirmationDetails(quote);
                    setConfirmationDetails(confirmationDetails);
                    console.log("3. Creating user ops from quote...");

                    const userOp = createUserOpFromQuote(quote);
                    console.log("4. Simulating Lifi Tx...");

                    const simResult = await simulateLifiTx(userOp);
                    // todo: remove
                    if (simResult) {
                        setUserOp(userOp);
                        // await processInternalMessage(
                        //     "The swap was successful.",
                        // );
                        setShowConfirmationBox(true);
                    } else {
                        console.log("0. Processing internal message...");

                        await processInternalMessage(
                            "The swap simulation failed. Tell the user and explain why it could have happened due to reasons of chain activity and configurations of the swap.",
                        );
                    }

                    break;
                }
                default:
                    console.log("Unknown tool:", tool);
            }
        };

        agentCommunicationChannel.on(
            EVENT_TYPES.TOOL_REQUEST,
            handleToolRequest,
        );

        return () => {
            agentCommunicationChannel.off(
                EVENT_TYPES.TOOL_REQUEST,
                handleToolRequest,
            );
        };
    }, [
        simulateTransfer,
        simulationResult,
        getQuote,
        setConfirmationDetails,
        setShowConfirmationBox,
        setUserOp,
        createUserOpFromQuote,
        simulateLifiTx,
    ]);
};
