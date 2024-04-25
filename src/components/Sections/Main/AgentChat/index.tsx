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
    const { simulationResult, simulateTransfer } = useSimulateTransfer();
    const [simStatus, setSimStatus] = useState<{ success: boolean }>({ success: false });
    const { updatedSendTransfer, handleSend } = useHandleSend();
    const { status, simLiFiTx, quote, getQuote, extractConfirmationDetails } = useSimLiFiTx();
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
            confirmAction, rejectAction, setParams  
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
        try {
            if ((simulationResult && simulationResult.changes && simulationResult.changes.length > 1) || quote) {
                if (confirmationDetails?.type === ConfirmationType.Simple) {
                    const transfer = simulationResult.changes.find(change => change.changeType === "TRANSFER");
                    const tokenDetails = simulationResult.changes.find(change => change.changeType !== "TRANSFER");
                    if (!transfer || !tokenDetails) {
                        throw new Error("Missing transaction details for simple confirmation.");
                    }
                    setConfirmationDetails({
                        message: `Please confirm the transfer of ${tokenDetails.amount} ${tokenDetails.symbol} to ${transfer.to}`,
                        type: ConfirmationType.Simple,
                        tokenIn: simulationResult.changes[2].contractAddress,
                        tokenInSymbol: simulationResult.changes[2].symbol,
                        amountToSend: simulationResult.changes[2].rawAmount,
                        amountWithDecimals: parseFloat(simulationResult.changes[2].amount),
                        tokenInLogo: simulationResult.changes[2].logo,
                        recipient: simulationResult.changes[2].to,
                        gasCost: simulationResult.changes[0].rawAmount // Assuming the first change is always the gas cost
                    });
                    setSimStatus({ success: true });
                } else if (confirmationDetails?.type === ConfirmationType.Swap && quote) {
                    console.log("Quote details:", quote);
                    setConfirmationDetails({
                        message: "Please confirm the swap",
                        type: ConfirmationType.Swap,
                        tokenIn: quote.action.fromToken.address,
                        tokenInSymbol: quote.action.fromToken.symbol,
                        tokenOutSymbol: quote.action.toToken.symbol,
                        amountToSend: quote.estimate.fromAmount,
                        amountWithDecimals: quote.estimate.fromAmount,
                        amountToReceive: quote.estimate.toAmount,
                        amountToReceiveDecimals: quote.estimate.toAmount,
                        tokenInLogo: quote.action.fromToken.logoURI,
                        recipient: quote.action.toAddress,
                        gasCost: quote.estimate.gasCosts[0].amountUSD,
                        feeCost: quote.estimate.feeCosts[0].amountUSD,
                        maxSlippage: quote.action.slippage,
                        tool: quote.estimate.tool,
                        tokenInDecimals: quote.action.fromToken.decimals,
                        tokenOutDecimals: quote.action.toToken.decimals,
                        fromChainId: quote.action.fromChainId,
                        toChainId: quote.action.toChainId
                    });
                    setSimStatus({ success: true });
                } else {
                    console.log("No confirmation details set due to missing required data.");
                }
            }
            setIsConfirmed(false);
        } catch (error) {
            console.error("Failed to set confirmation details:", error);
            // Optionally reset confirmation state or handle error more explicitly here
        }
    }, [confirmationDetails?.type, quote, setConfirmationDetails, setIsConfirmed, simulationResult]);
     

    
    useEffect(() => {
        setTokenAddress(tokenAddress);
        setAmount(amount);
        setRecipient(recipient);
    }, [tokenAddress, amount, recipient]);

    useEffect(() => {
        const updateChatHistory = async () => {
            const history: BaseMessage[] = await getHistory();
            setChatHistory(history);
        };

        updateChatHistory();
    }, [getHistory]);

    useEffect(() => {
        const handleToolRequest = async (data: { tool: string; params: any; result: string }) => {
            const { tool, params, result } = data;

            switch (tool) {
                /* Simulate-Transfer */
                case 'Simulate-Transfer':
                    console.log('Received Simulate-Transfer', result);
                    simulateTransfer(params).then(simulationResult => {
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
                    simLiFiTx(params).then(quote => {
                        console.log('Simulation complete', quote);
                        setConfirmationDetails({
                            message: `Please confirm the transfer of ${params.fromAmount} ${params.fromToken.symbol} to ${params.toAddress}`,
                            type: ConfirmationType.Swap
                        });
                        setShowConfirmationBox(true);
                    });
                    setParams(params);
                    break;
                /* LiFi-Transaction */
                case 'LiFi-Transaction':
                    console.log('LiFi-Transaction initiated');
                    getQuote(params).then(quote => {
                        const confirmationData = extractConfirmationDetails(quote);
                        setConfirmationDetails({
                            message: `Please confirm the swap of ${confirmationData.amountToSend} ${confirmationData.inTokenSymbol} to at least ${confirmationData.amountToReceiveMin} ${confirmationData.outTokenSymbol}`,
                            type: ConfirmationType.Swap,
                            tokenIn: quote.action.fromToken.address,
                            tokenInSymbol: confirmationData.inTokenSymbol,
                            tokenOutSymbol: confirmationData.outTokenSymbol,
                            amountToSend: confirmationData.amountToSend,
                            amountWithDecimals: parseFloat(confirmationData.amountToSend),  // Assuming the amount is correctly formatted
                            tokenInLogo: confirmationData.inTokenLogoURI,
                            recipient: quote.action.toAddress,
                            gasCost: confirmationData.gasCost,
                            maxSlippage: confirmationData.slippage,
                            tool: confirmationData.toolName
                        });
                        setShowConfirmationBox(true);
                    }).catch(error => {
                        console.error('Error fetching quote for LiFi transaction:', error);
                        setAgentResponse('Failed to fetch transaction quote.');
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
    }, [handleSend, sendLiFiTx, executeBatchOperations, readyForTransfer, simulateTransfer, simLiFiTx, addToBatch, fetchActivities, processInternalMessage, search, setConfirmationDetails, setShowConfirmationBox, setParams, getQuote, extractConfirmationDetails]);

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
        // Check if the confirmationDetails are defined and if the confirmation box should be shown
        if (confirmationDetails && showConfirmationBox && simStatus.success) {
            // console.log("SimulationResult:", simulationResult);
            try {
                switch (confirmationDetails.type) {
                    case ConfirmationType.Simple:
                        return <ConfirmationBoxSimple
                            confirmAction={confirmAction}
                            rejectAction={rejectAction}
                            isConfirmed={isConfirmed}
                            amountWithDecimals={confirmationDetails.amountWithDecimals}
                            tokenInSymbol={confirmationDetails.tokenInSymbol}
                            recipient={confirmationDetails.recipient}
                            gasCost={confirmationDetails.gasCost}
                            tokenInLogo={confirmationDetails.tokenInLogo}
                        />;
                    case ConfirmationType.Batch:
                        return <ConfirmationBoxBatch
                            confirmAction={confirmAction}
                            rejectAction={rejectAction}
                            isConfirmed={isConfirmed}
                            tokens={tokens}
                            percentages={[0.5, 0.5]}
                            priceImpact={0.01}
                            networkCost={0.0001}
                            maxSlippage={0.01}
                        />;
                    case ConfirmationType.Swap:
                        return <ConfirmationBoxSwap
                            confirmAction={confirmAction}
                            rejectAction={rejectAction}
                            isConfirmed={isConfirmed}
                            amountToSwap={confirmationDetails.amountWithDecimals}
                            amountToReceive={confirmationDetails.amountToReceiveDecimals}
                            tokenInSymbol={confirmationDetails.tokenInSymbol}
                            tokenOutSymbol={confirmationDetails.tokenOutSymbol}
                            tokenInLogo={confirmationDetails.tokenInLogo}
                            tokenOutLogo={confirmationDetails.tokenOutLogo}
                            tool={confirmationDetails.tool}
                            gasCost={confirmationDetails.gasCost}
                            feeCost={confirmationDetails.feeCost}
                            maxSlippage={confirmationDetails.maxSlippage}
                            tokenInDecimals={confirmationDetails.tokenInDecimals}
                            tokenOutDecimals={confirmationDetails.tokenOutDecimals}
                        />;
                    default:
                        console.error("Unknown confirmation type:", confirmationDetails.type);
                        return <p>Error: Unknown confirmation type. Please contact support.</p>;
                }
            } catch (error) {
                console.error("Error rendering confirmation button:", error);
                return <p>Error displaying confirmation details. Please try again or contact support.</p>;
            }
        }
        simStatus.success = false;
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
