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
    const { simulateTransfer, simulationResult } = useSimulateTransfer(); // Use the new hook

    useEffect(() => {
        const handleToolRequest = async (data) => {
            const { tool, params } = data;

            switch (tool) {
                case "Simulate-Transfer": {
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
                    let passed = false;
                    let triedTools = [];
                    while (!passed) {
                        const quote = await getQuote({
                            ...params,
                            denyExchanges: triedTools,
                        });
                        // @ts-expect-error
                        triedTools.push(quote.tool);
                        const confirmationDetails =
                            extractConfirmationDetails(quote);
                        setConfirmationDetails(confirmationDetails);
                        const userOp = createUserOpFromQuote(quote);
                        const simResult = await simulateLifiTx(userOp);
                        if (simResult) {
                            setUserOp(userOp);
                            setShowConfirmationBox(true);
                            passed = true;
                        } else {
                            await processInternalMessage(
                                `The initial quote for ${JSON.stringify(quote, null, 2)} simulation failed. Give a brief message to the user explaining this and that you're trying a different swap tool`,
                            );
                        }
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
