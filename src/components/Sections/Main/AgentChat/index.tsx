import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/Container/PageContainer';
import { useTokensInfo } from '@/hooks/useTokensInfo';
import { generateQueryFromPortfolio } from '../../../../AI_Agent/Utils/generateQueryFromPortfolio';
import useScAccountPositions from "@/domain/position/useScAccountPositions";
import useScAccountSpotPosition from "@/domain/position/useScAccountSpotPosition";
import Secondary from "./secondary";

import { agentCommunicationChannel, EVENT_TYPES } from '@/AI_Agent/AgentCommunicationChannel';
import { useSimulateTransfer } from '@/AI_Agent/hooks/useSimulateTransfer';
import { useHandleSend } from '@/AI_Agent/hooks/useSendTransfer';
import { useSimLiFiTx } from '@/AI_Agent/hooks/useSimLiFiTx';
import useWallet from "@/hooks/useWallet";
import { useLiFiTx } from '@/AI_Agent/hooks/useLiFiTx';
import { useLiFiBatch } from '@/AI_Agent/hooks/useLiFiBatch';
import { TokenInfo } from '@/domain/tokens/types';
import { useMind } from '@/AI_Agent/hooks/useMind';
import { useChatHistory } from '@/AI_Agent/Context/ChatHistoryContext';
import { AIMessage, SystemMessage } from '@langchain/core/messages';
import ChatDisplay from '@/AI_Agent/ChatDisplay';
import { BaseMessage } from '@langchain/core/messages';

interface ConfirmationDetails {
    action: () => Promise<void>;
    message: string;
}

const AgentChat = () => {
    const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false); // New state to track confirmation
    const { processChatMessage } = useMind();
    const { addMessage, getHistory } = useChatHistory();
    const [chatHistory, setChatHistory] = useState<BaseMessage[]>([]);
    const [tokenAddress, setTokenAddress] = useState<string>("0xaf88d065e77c8cc2239327c5edb3a432268e5831");
    const [amount, setAmount] = useState<string>("1000000");
    const [recipient, setRecipient] = useState<string>("0x141571912eC34F9bE50a6b8DC805e71Df70fAdAD");
    const { tokens } = useTokensInfo();
    const [query, setQuery] = useState<string>("");
    const [agentResponse, setAgentResponse] = useState<string>("");
    const { simulationResult, simulateTransfer } = useSimulateTransfer();
    const { updatedSendTransfer, handleSend } = useHandleSend();
    const { status, simLiFiTx } = useSimLiFiTx();
    const { sendLiFiTx } = useLiFiTx();
    const { addToBatch, batchedOperations, executeBatchOperations } = useLiFiBatch();
    const { totalBalance } = useScAccountPositions();
    const { totalCash } = useScAccountSpotPosition();
    const [length, setLength] = useState(tokens.length);
    const [tokenFrom, setTokenFrom] = useState<TokenInfo | undefined>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [forceTableReload, setForceTableReload] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    
    const { scAccount } = useWallet();

    const getCurrentDate = () => {
        return new Date().toISOString();
    };

    const handleQuerySubmit = async (query: string) => {
        if (tokens.length > 0 && query.trim() !== "") {
            const portfolioQuery = generateQueryFromPortfolio(tokens);
            const date = getCurrentDate();
            const portfolio = portfolioQuery;
            const scaAddress = scAccount;

            try {
                // Call Mind's processChatMessage and await its response
                const response = await processChatMessage(query, date, portfolio, scaAddress);
                // Directly set the response as the agent's response
                setAgentResponse(response);
                // const history = await getHistory();
                // console.log("Chat history: ", history.map((msg) => msg.lc_id[2]));

            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error processing chat message:", error);
            }

            setQuery(""); // Clear the text input box after processing
            setIsInputEmpty(true); // Reset input validation state
        }
    };

    const formatCurrency = (value: number | bigint) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    // Method to handle confirmation
    const confirmAction = async () => {
        if (confirmationDetails) {
            setIsConfirmed(true); // Update confirmation state
            await confirmationDetails.action();
            setConfirmationDetails(null); // Clear the confirmation details
        }
    };

    // Method to handle rejection
    const rejectAction = () => {
        setIsConfirmed(false); // Reset confirmation state
        setConfirmationDetails(null); // Clear the confirmation details
    };

    useEffect(() => {
        setTokenAddress(tokenAddress);
        setAmount(amount);
        setRecipient(recipient);
    }, [tokenAddress, amount, recipient]);

    useEffect(() => {
        const updateChatHistory = async () => {
            const history: BaseMessage[] = await getHistory(); // Assume getHistory() returns a Promise
            setChatHistory(history);
        };

        updateChatHistory();
    }, [getHistory]);

    useEffect(() => {
        const handleToolRequest = (data: { tool: string; params: any; result: string }) => {
            const { tool, params, result } = data;

            // Define the actions for each tool request
            const actions = {
                'Perform-Transfer': async () => {
                    await handleSend(params);
                    // Here you would add a message to the chat confirming the action has been taken
                },
                // Define other actions if needed
            };

            switch (tool) {
                case 'Simulate-Transfer':
                    console.log('Simulate-Transfer tool invoked with params:', params);
                    simulateTransfer(params);
                    break;
                case 'Perform-Transfer':
                    // Set up confirmation details for actions that require confirmation
                    setConfirmationDetails({
                        action: actions['Perform-Transfer'],
                        message: 'Please confirm the transfer: ' + params.amount + ' to ' + params.recipient,
                    });
                    // Add a message to the chat asking for confirmation
                    addMessage(new AIMessage('Please confirm the transfer: ' + params.amount + ' to ' + params.recipient));
                    break;
                case 'LiFi-Simulator':
                    console.log('LiFi-Simulation tool invoked with params:', params);
                    simLiFiTx(params);
                    break;
                case 'LiFi-Transaction':
                    console.log('LiFi-Transaction tool invoked with params:', params);
                    sendLiFiTx(params);
                    break;
                case 'Add-Operation-To-Batch':
                    console.log('Add-Operation-To-Batch tool invoked with params:', params);
                    addToBatch(params);
                    console.log('Batched operations:', batchedOperations);
                    break;
                case 'Execute-Batch-Operations':
                    console.log('Execute-Batch-Operations tool invoked');
                    executeBatchOperations();
                    break;
                default:
                    console.log('Unknown tool:', tool);
            }

            setAgentResponse((prevResponse) => prevResponse + '\n' + result);
        };

        agentCommunicationChannel.on(EVENT_TYPES.TOOL_REQUEST, handleToolRequest);

        return () => {
            agentCommunicationChannel.off(EVENT_TYPES.TOOL_REQUEST, handleToolRequest);
        };
    }, []);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        setIsInputEmpty(event.target.value.trim() === ""); // Check if input box is empty
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !event.shiftKey && !isInputEmpty) {
            event.preventDefault();
            handleQuerySubmit(query);
        }
    };

    const getLength = (length: number) => {
        setLength(length);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const ITEMS_PER_PAGE = 6;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, length);

    const renderConfirmationButtons = () => {
        if (confirmationDetails) {
            return (
                <div className="flex mt-4">
                    <button
                        onClick={confirmAction}
                        disabled={isConfirmed} // Disable the button if confirmed
                        className={`px-4 py-2 mr-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md ${isConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Approve
                    </button>
                    <button
                        onClick={rejectAction}
                        disabled={isConfirmed} // Disable the button if confirmed
                        className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md ${isConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Reject
                    </button>
                </div>
            );
        }
        return null;
    };

    return (
        <main>
            <PageContainer
                main={
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                        <ChatDisplay chatHistory={chatHistory} />
                        {renderConfirmationButtons()}
                        <div className="flex items-end mt-4 w-full max-w-3xl">
                            <textarea
                                value={query}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter your prompt for the AI agent..."
                                className="p-4 h-32 w-full resize-none border border-gray-300 rounded-md bg-white mr-4"
                            ></textarea>
                            <button
                                type="button"
                                onClick={() => handleQuerySubmit('')}
                                disabled={isInputEmpty} // Disable button if input is empty
                                className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md ${isInputEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Run
                            </button>
                        </div>
                    </div>
                }
                secondary={
                    <Secondary
                        totalBalance={totalBalance}
                        totalCash={totalCash}
                        tokens={tokens}
                        formatCurrency={formatCurrency}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        getLength={getLength}
                        handlePageChange={handlePageChange}
                        setTokenFrom={setTokenFrom}
                        forceTableReload={forceTableReload}
                        currentPage={currentPage}
                        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                        length={length}
                    />
                }
                page="AI Agent Tester"
            />
        </main>
    );
};

export default AgentChat;
