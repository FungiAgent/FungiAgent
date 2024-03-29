import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/Container/PageContainer';
import { agentExecutor } from '@/AI_Agent/AgentExecutor';
import { useTokensInfo } from '@/hooks/useTokensInfo';
import { generateQueryFromPortfolio } from '../../../AI_Agent/Utils/generateQueryFromPortfolio';
// import { useGlobalContext } from "@/context/FungiContextProvider";

import { PromptTemplate } from "langchain/prompts";
import { agentCommunicationChannel, EVENT_TYPES } from '@/AI_Agent/AgentCommunicationChannel';
import { useSimulateTransfer } from '@/AI_Agent/hooks/useSimulateTransfer';
import { useHandleSend } from '@/AI_Agent/hooks/useSendTransfer';
import { useSimLiFiTx } from '@/AI_Agent/hooks/useSimLiFiTx';
import useWallet from "@/hooks/useWallet";
import { useLiFiTx } from '@/AI_Agent/hooks/useLiFiTx';
import { useLiFiBatch } from '@/AI_Agent/hooks/useLiFiBatch';

const AgentChat = () => {
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
    
    const { scAccount } = useWallet();

    const getCurrentDate = () => {
        return new Date().toISOString();
    };

    const promptTemplate = new PromptTemplate({
        template: "Portfolio composition:\n\n{date}\n\n{portfolio}\n\nSource address: {scAccount} \n\nUSDC: 0xaf88d065e77c8cc2239327c5edb3a432268e5831, DAI: 0xda10009cbd5d07dd0cecc66161fc93d7c9000da1, WETH: 0x82af49447d8a07e3bd95bd0d56f35241523fbab1 ARB: 0x912ce59144191c1204e64559fe8253a0e49e6548\n\nQuery: ",
        inputVariables: ["date", "portfolio", "scAccount"],
    });

    const handleQuerySubmit = async () => {
        if (tokens.length > 0) {
            const portfolioQuery = generateQueryFromPortfolio(tokens);
            const formattedPrompt = await promptTemplate.format({
                date: getCurrentDate(),
                portfolio: portfolioQuery,
                scAccount: scAccount,
            });

            let response = await agentExecutor.invoke({ input: formattedPrompt + query });
            setAgentResponse(response.output);
            console.log(response);
        }
    };

    useEffect(() => {
        setTokenAddress(tokenAddress);
        setAmount(amount);
        setRecipient(recipient);
    }, [tokenAddress, amount, recipient]);

    useEffect(() => {
        const handleToolRequest = (data: { tool: string; params: any; result: string }) => {
          const { tool, params, result } = data;
    
          // Handle the tool invocation based on the tool name
          switch (tool) {
            case 'Simulate-Transfer':
                console.log('Simulate-Transfer tool invoked with params:', params);
                simulateTransfer(params);
              break;
            // Add more cases for other tools and hooks
            case 'Perform-Transfer':
                handleSend(params);
                break;
            case 'LiFi-Simulator':
                console.log('LiFi-Simulation tool invoked with params:', params);
                // handleLiFiTx(params);
                simLiFiTx(params);
                break;
            case 'LiFi-Transaction':
                console.log('LiFi-Transaction tool invoked with params:', params);
                // handleLiFiTx(params);
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
    
          // Update the agent response with the tool result
          setAgentResponse((prevResponse) => prevResponse + '\n' + result);
        };
    
        agentCommunicationChannel.on(EVENT_TYPES.TOOL_REQUEST, handleToolRequest);
    
        return () => {
          agentCommunicationChannel.off(EVENT_TYPES.TOOL_REQUEST, handleToolRequest);
        };
      }, []);

    return (
        <PageContainer
            main={
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                <h1 className="text-3xl font-semibold text-gray-900">AI Agent Console</h1>
                <p className="text-gray-500 my-4">
                    AI responses will appear here after your query is submitted.
                </p>
                <div className="mt-4 p-4 bg-gray-50 w-full max-w-3xl rounded-md border border-gray-200">
                    <p className="text-gray-800">{agentResponse}</p>
                </div>
                </div>
            }
            secondary={
                <div className="flex flex-col items-center justify-center">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your prompt for the AI agent..."
                    className="w-full h-64 p-4 mt-4 border border-gray-300 rounded-md bg-white"
                ></textarea>
                <button
                    type="button"
                    onClick={handleQuerySubmit}
                    className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
                >
                    Execute Agent
                </button>
                </div>
            }
            page="AI Agent Tester"
        />
    );
};

export default AgentChat;
