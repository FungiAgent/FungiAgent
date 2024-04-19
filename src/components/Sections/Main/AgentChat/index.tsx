import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/Container/PageContainer';
import { useTokensInfo } from '@/hooks/useTokensInfo';
import { generateQueryFromPortfolio } from '../../../../AI_Agent/Utils/generateQueryFromPortfolio';
import useScAccountPositions from "@/domain/position/useScAccountPositions";
import useScAccountSpotPosition from "@/domain/position/useScAccountSpotPosition";
import Secondary from "./sidebar";

import { agentCommunicationChannel, EVENT_TYPES } from '@/AI_Agent/AgentCommunicationChannel';
import useWallet from "@/hooks/useWallet";
import { useLiFiTx, useSimulateTransfer, useSimLiFiTx, useHandleSend, useLiFiBatch, useMind, useRSS3Activities, useTavilySearch } from '@/AI_Agent/hooks';
import { TokenInfo } from '@/domain/tokens/types';
import { useChatHistory } from '@/AI_Agent/Context/ChatHistoryContext';
import ChatDisplay from '@/AI_Agent/ChatDisplay';
import { BaseMessage } from '@langchain/core/messages';
import  { UserInput }   from '@/components/TextInputs/UserInput';
import ConfirmationBoxSwap from '@/components/Cards/ChatConfirmations/ConfirmationBoxSwap';
import ConfirmationBoxSimple from '@/components/Cards/ChatConfirmations/ConfirmationBoxSimple';
import ConfirmationBoxBatch from '@/components/Cards/ChatConfirmations/ConfirmationBoxBatch';
import { useConfirmation, ConfirmationType } from '@/AI_Agent/hooks/useConfirmation';

import dotenv from "dotenv";

dotenv.config();

const AgentChat = () => {
    const { processChatMessage, processInternalMessage } = useMind();
    const { addMessage, getHistory } = useChatHistory();
    const [chatHistory, setChatHistory] = useState<BaseMessage[]>([]);
    const [tokenAddress, setTokenAddress] = useState<string>("0xaf88d065e77c8cc2239327c5edb3a432268e5831");
    const [amount, setAmount] = useState<string>("1000000");
    const [recipient, setRecipient] = useState<string>("0x141571912eC34F9bE50a6b8DC805e71Df70fAdAD");
    const { tokens } = useTokensInfo();
    const [query, setQuery] = useState<string>("");
    const [agentResponse, setAgentResponse] = useState<string>("");
    const { simulationResult, simulateTransfer, simStatus } = useSimulateTransfer();
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
    const { fetchActivities, fetchedData } = useRSS3Activities();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { scAccount } = useWallet();
    const { search } = useTavilySearch(process.env.TAVILY_API_KEY);
    const [readyForTransfer, setReadyForTransfer] = useState(false);
    const { confirmationDetails, setConfirmationDetails, 
            isConfirmed, setIsConfirmed, 
            showConfirmationBox, setShowConfirmationBox, 
            confirmAction, rejectAction  
        } = useConfirmation();
    
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
            } catch (error) {
                console.error("Error processing chat message:", error);
            }

            setQuery(""); // Clear the text input box after processing
            setIsInputEmpty(true); // Reset input validation state
        }
    };

    const formatCurrency = (value: number | bigint) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    useEffect(() => {
        if (simulationResult && simulationResult.changes && simulationResult.changes.length > 1) {
            const transfer = simulationResult.changes.find(change => change.changeType === "TRANSFER");
            const tokenDetails = simulationResult.changes.find(change => change.changeType !== "TRANSFER");
            if (transfer && tokenDetails) {
                setConfirmationDetails({
                    message: `Please confirm the transfer of ${tokenDetails.amount} ${tokenDetails.symbol} to ${transfer.to}`,
                    type: ConfirmationType.Simple,
                    tokenIn: simulationResult.changes[2].contractAddress,
                    symbol: simulationResult.changes[2].symbol,
                    amountToSend: simulationResult.changes[2].rawAmount,
                    amountWithDecimals: parseFloat(simulationResult.changes[2].amount),
                    logo: simulationResult.changes[2].logo,
                    recipient: simulationResult.changes[2].to,
                    gasCost: simulationResult.changes[0].rawAmount // Assuming the first change is always the gas cost
                });
            }
        }
        setIsConfirmed(false);
    }, [setConfirmationDetails, setIsConfirmed, simulationResult]);
    
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
        const handleToolRequest = async (data: { tool: string; params: any; result: string }) => {
            const { tool, params, result } = data;

            // Define the actions for each tool request
            const actions = {
                'Perform-Transfer': async () => {
                    await handleSend(params);
                },
                // Define other actions if needed
                'LiFi-Transaction': async () => {
                    await sendLiFiTx(params);
                },
                'Execute-Batch-Operations': async () => {
                    await executeBatchOperations();
                }
            };

            switch (tool) {
                /* Simulate-Transfer */
                case 'Simulate-Transfer':
                    console.log('Received Simulate-Transfer', result);
                    simulateTransfer(params).then(simulationResult => {
                        // Assuming simulateTransfer returns a promise that resolves when the simulation is complete
                        console.log('Simulation complete', simulationResult);
                        setConfirmationDetails({
                            message: `Please confirm the transfer of ${params.amount} from ${params.tokenAddress} to ${params.recipient}`,
                            type: ConfirmationType.Simple
                        });
                        setShowConfirmationBox(true);
                    });
                    break;
                /* LiFi-Simulator */
                case 'LiFi-Simulator':
                    simLiFiTx(params);
                    break;
                /* LiFi-Transaction */
                case 'LiFi-Transaction':
                    console.log('LiFi-Transaction');
                    setConfirmationDetails({
                        action: async () => {
                            await sendLiFiTx(params);
                        },
                        message: 'Please confirm the LiFi transaction: ' + params.amount + ' to ' + params.recipient,
                        type: ConfirmationType.Swap
                    });
                    break;
                /* Add-Operation-To-Batch */
                case 'Add-Operation-To-Batch':
                    addToBatch(params);
                    break;
                /* Execute-Batch-Operations */
                case 'Execute-Batch-Operations':
                    setConfirmationDetails({
                        action: () => executeBatchOperations(),
                        message: 'Please confirm the batch operations',
                        type: ConfirmationType.Batch
                    });
                    break;
                /* Fetch-RSS3-Activities */
                case 'Fetch-RSS3-Activities':
                    await fetchActivities(params);
                    // Ensure that the agent answers after fetching the data
                    setAgentResponse(await processInternalMessage("Analyse the fetched data and give a brief summary (DO NOT USE ANOTHER TOOL FOR THE NEXT RESPONSE)"));
                    break;
                /* Tavily-Search */
                case 'tavily-search':
                    try {
                        await search(params);
                        setAgentResponse(await processInternalMessage("Return the search results."));
                    } catch (error) {
                        setAgentResponse(await processInternalMessage('Search failed. Please try again.'));
                    }
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
    }, [handleSend, sendLiFiTx, executeBatchOperations, readyForTransfer, simulateTransfer, simLiFiTx, addToBatch, fetchActivities, processInternalMessage, search, setConfirmationDetails, setShowConfirmationBox]);

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
        if (confirmationDetails && showConfirmationBox) {
            switch (confirmationDetails.type) {
                case ConfirmationType.Simple:
                return <ConfirmationBoxSimple
                    confirmAction={confirmAction}
                    rejectAction={rejectAction}
                    isConfirmed={isConfirmed}
                    amountWithDecimals={confirmationDetails.amountWithDecimals}
                    symbol={confirmationDetails.symbol}
                    recipient={confirmationDetails.recipient}
                    gasCost={confirmationDetails.gasCost}
                    logo={confirmationDetails.logo}
                />;
                case ConfirmationType.Batch:
                    return <ConfirmationBoxBatch confirmAction={confirmAction} rejectAction={rejectAction} isConfirmed={isConfirmed} tokens={tokens} percentages={[0.5, 0.5]} priceImpact={0.01} networkCost={0.0001} maxSlippage={0.01} />;
                case ConfirmationType.Swap:
                    return <ConfirmationBoxSwap confirmAction={confirmAction} rejectAction={rejectAction} isConfirmed={isConfirmed} exchangeRate={1000} priceImpact={0.01} networkCost={0.0001} maxSlippage={0.01} />;
                default:
                    return null; // Handle unknown type or provide a default fallback
            }
        }
        return null;
    };
      

    return (
        <main>
          <PageContainer
            main={
              <div className="flex flex-col items-center justify-center p-4 rounded-lg shadow-sm">
                <ChatDisplay chatHistory={chatHistory} />
                {renderConfirmationButtons()}
                <UserInput onSubmit={handleQuerySubmit} />
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
                onModalToggle={setIsModalOpen}
                isModalOpen={isModalOpen}
              />
            }
            page="AI Agent Tester"
            keepWorkingMessage={null}
            isModalOpen={isModalOpen}
          />
        </main>
      );
};

export default AgentChat;
