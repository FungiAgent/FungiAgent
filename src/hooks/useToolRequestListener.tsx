// useToolRequestListener.tsx
import { useEffect } from 'react';
import { agentCommunicationChannel, EVENT_TYPES } from '@/agent/AgentCommunicationChannel';
import { useUserOpContext } from '@/context/UserOpContext';
import { ConfirmationType } from '@/hooks/useConfirmation';
import { useNotification } from '@/context/NotificationContextProvider';
import { useSimLiFiTx } from '@/hooks';
import { useSimulateTransfer } from './useSimulateTransfer';

export const useToolRequestListener = ({ setConfirmationDetails, setParams, setShowConfirmationBox }) => {
    const { getQuote, extractConfirmationDetails, createUserOpFromQuote, simulateLifiTx } = useSimLiFiTx();
    const { setUserOp } = useUserOpContext();
    const { showNotification } = useNotification();
    const { simulateTransfer, simulationResult } = useSimulateTransfer(); // Use the new hook

    useEffect(() => {
        const handleToolRequest = async (data) => {
            const { tool, params } = data;

            switch (tool) {
                case 'Simulate-Transfer': {
                    const result = await simulateTransfer(params); // Simulate transfer
                    if (result) {
                        const { userOp, simulationResult } = result;

                        setConfirmationDetails({
                            message: `Please confirm the transfer of ${params.amount} from ${params.tokenAddress} to ${params.recipient}`,
                            type: ConfirmationType.Simple,
                            amountToSend: simulationResult.changes[1].rawAmount,
                            tokenAddress: simulationResult.changes[1].contractAddress,
                            recipient: simulationResult.changes[1].to,
                            amountWithDecimals: simulationResult.changes[1].amount,
                            tokenInSymbol: simulationResult.changes[1].symbol,
                            tokenInLogo: simulationResult.changes[1].logo,
                            gasCost: simulationResult.changes[0].amount,
                        });
                        setUserOp(userOp); // Store user operation
                        setShowConfirmationBox(true);
                    } else {
                        console.error("Simulation failed or returned an invalid result.");
                    }
                    break;
                }
                case 'LiFi-Simulator': {
                    const quote = await getQuote(params);
                    const confirmationDetails = extractConfirmationDetails(quote);
                    setConfirmationDetails(confirmationDetails);

                    const userOp = createUserOpFromQuote(quote);
                    simulateLifiTx(userOp);
                    setUserOp(userOp);
                    setShowConfirmationBox(true);
                    break;
                }
                default:
                    console.log("Unknown tool:", tool);
            }
        };

        agentCommunicationChannel.on(EVENT_TYPES.TOOL_REQUEST, handleToolRequest);

        return () => {
            agentCommunicationChannel.off(EVENT_TYPES.TOOL_REQUEST, handleToolRequest);
        };
    }, [simulateTransfer, simulationResult, getQuote, setConfirmationDetails, setShowConfirmationBox, setUserOp, createUserOpFromQuote, simulateLifiTx]);
};
