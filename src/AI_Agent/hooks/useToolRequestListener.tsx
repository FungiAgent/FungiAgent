// useToolRequestListener.tsx
import { useEffect } from 'react';
import { agentCommunicationChannel, EVENT_TYPES } from '@/AI_Agent/AgentCommunicationChannel';
import { useUserOpContext } from '@/AI_Agent/Context/UserOpContext';
import { useSimLiFiTx } from '@/AI_Agent/hooks';
import { ConfirmationType } from '@/AI_Agent/hooks/useConfirmation';

export const useToolRequestListener = ({ setConfirmationDetails, setParams, setShowConfirmationBox }) => {
    const { getQuote, extractConfirmationDetails, createUserOpFromQuote, simulateLifiTx } = useSimLiFiTx();
    const { setUserOp } = useUserOpContext(); // Get the setUserOp function

    useEffect(() => {
        const handleToolRequest = async (data) => {
            const { tool, params, result } = data;

            switch (tool) {
                case 'Simulate-Transfer': {
                    setConfirmationDetails({
                        message: `Please confirm the transfer of ${params.amount} from ${params.tokenAddress} to ${params.recipient}`,
                        type: ConfirmationType.Simple,
                    });
                    setShowConfirmationBox(true);
                    break;
                }
                case 'LiFi-Simulator': {
                    const quote = await getQuote(params);
                    const confirmationDetails = extractConfirmationDetails(quote);
                    setConfirmationDetails(confirmationDetails);
                    console.log("Confirmation Details:", confirmationDetails);

                    const userOp = createUserOpFromQuote(quote);
                    console.log("User Operation:", userOp);

                    simulateLifiTx(userOp);

                    setUserOp(userOp); // Set the userOp in the global state
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
    }, [getQuote, extractConfirmationDetails, setConfirmationDetails, setShowConfirmationBox, setUserOp, createUserOpFromQuote, simulateLifiTx]);
};
