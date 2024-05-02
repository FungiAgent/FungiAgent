// useToolRequestListener.tsx
import { useEffect } from 'react';
import { agentCommunicationChannel, EVENT_TYPES } from '@/AI_Agent/AgentCommunicationChannel';
import { useUserOpContext } from '@/AI_Agent/Context/UserOpContext';
import { useSimLiFiTx } from '@/AI_Agent/hooks';
import { ConfirmationType } from '@/AI_Agent/hooks/useConfirmation';
import { useHandleSend } from '@/AI_Agent/hooks';
import { useERC20Transfer } from '@/hooks/useERC20Transfer';
import { UserOperation } from "@/lib/userOperations/types";
import { BigNumber } from "ethers";
import { useNotification } from '@/context/NotificationContextProvider';
import { useSimUO } from "@/hooks/useSimUO";
// import { useSimulateTransfer } from '@/AI_Agent/hooks';
import { useCreateUserOp } from './useCreateUserOp';

export const useToolRequestListener = ({ setConfirmationDetails, setParams, setShowConfirmationBox }) => {
    const { getQuote, extractConfirmationDetails, createUserOpFromQuote, simulateLifiTx } = useSimLiFiTx();
    const { setUserOp } = useUserOpContext(); // Get the setUserOp function
    const { handleSend } = useHandleSend();
    const [status, sendTransferUO] = useERC20Transfer();
    const { showNotification } = useNotification();
    const { simStatus, simTransfer } = useSimUO();
    const { createUserOp } = useCreateUserOp();
    // const { simulateTransfer, simulationResult } = useSimulateTransfer();


    useEffect(() => {
        const handleToolRequest = async (data) => {
            const { tool, params } = data;
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

            switch (tool) {
                case 'Simulate-Transfer': {
                    const userOp: any = await sendTransferUO(tokenAddress, BigNumber.from(amount), recipient);
                    console.log("User Operation:", userOp);
                    const simulationResult = await simTransfer(userOp);
                    console.log("Simulation Result:", simulationResult);
                    if (userOp) {
                        // setUserOp(userOp);
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
                        setUserOp(userOp); // Set the userOp in the global state
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
