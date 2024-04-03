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
import { executeAgent } from '@/AI_Agent/AgentCreation';
import { Mind } from '@/AI_Agent/Mind';
import { ChatBotCreation } from '@/AI_Agent/ChatBotCreation';


const AgentChat = () => {
    const mind = new Mind("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");
    // const chatBot = new ChatBotCreation();
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
          const response = await mind.processChatMessage(query, date, portfolio, scaAddress);
          // Directly set the response as the agent's response
          setAgentResponse(response);
          console.log("CHat history: ", await mind.getChatHistory());
      } catch (error) {
          console.error("Error processing chat message:", error);
          // Handle error appropriately
      }

      setQuery(""); // Clear the text input box after processing
      setIsInputEmpty(true); // Reset input validation state
      }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    useEffect(() => {
        setTokenAddress(tokenAddress);
        setAmount(amount);
        setRecipient(recipient);
    }, [tokenAddress, amount, recipient]);

    useEffect(() => {
        const handleToolRequest = (data: { tool: string; params: any; result: string }) => {
          const { tool, params, result } = data;
          switch (tool) {
            case 'Simulate-Transfer':
                console.log('Simulate-Transfer tool invoked with params:', params);
                simulateTransfer(params);
              break;
            case 'Perform-Transfer':
                handleSend(params);
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

    return (
        <main>
          <PageContainer
              main={
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="mt-4 p-4 bg-gray-50 w-full max-w-3xl h-[60vh] rounded-md border border-gray-200">
                            <p className="text-gray-800">{agentResponse}</p>
                        </div>
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
