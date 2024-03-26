import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/Container/PageContainer';
import { agentExecutor } from '@/AI_Agent/AgentExecutor';
import { useTokensInfo } from '@/hooks/useTokensInfo';
import dotenv from "dotenv";
import { useSimUO } from "@/hooks/useSimUO";
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { useNotification } from '@/context/NotificationContextProvider';
import { BigNumber } from 'ethers';
import { useUserOperations } from "@/hooks/useUserOperations";

import { PromptTemplate } from "langchain/prompts";
import { agentCommunicationChannel, EVENT_TYPES } from '@/AI_Agent/AgentCommunicationChannel';

dotenv.config();

const AgentChat = () => {
    const [tokenAddress, setTokenAddress] = useState<string>("0xaf88d065e77c8cc2239327c5edb3a432268e5831");
    const [amount, setAmount] = useState<string>("1000000");
    const [recipient, setRecipient] = useState<string>("0x141571912eC34F9bE50a6b8DC805e71Df70fAdAD");
    const { showNotification } = useNotification();
    const { tokens } = useTokensInfo();
    const [query, setQuery] = useState<string>("");
    const [agentResponse, setAgentResponse] = useState<string>("");
    const { simStatus, simTransfer } = useSimUO();
    const [updatedSendTransfer, setUpdatedSendTransfer] = useState<any>(null);
    const [status, sendTransfer] = useERC20Transfer(tokenAddress, BigNumber.from(amount), recipient);
    const [simulationResult, setSimulationResult] = useState<any>(null);
    const { sendUserOperations } = useUserOperations();

    const generateQueryFromPortfolio = (tokens) => {
        // Filter out tokens with 0 balance and convert the rest to their USD equivalents
        const tokensWithNonZeroBalance = tokens
            .filter(token => token.balance > 0) // Assuming 'balance' is directly usable; adjust if it's in a different format
            .map(token => {
                const balanceUSD = (token.balance / Math.pow(10, token.decimals)) * token.priceUSD;
                return `${token.symbol} in USD: $${balanceUSD.toFixed(2)} USD | ${token.symbol} raw balance: ${token.balance}`;
            });
        
        return tokensWithNonZeroBalance.join('\n');
    };

    const getCurrentDate = () => {
        return new Date().toISOString();
      };

    const promptTemplate = new PromptTemplate({
        template: "Portfolio composition:\n\n{date}\n\n{portfolio}\n\nQuery: ",
        inputVariables: ["date", "portfolio"],
    });

    const handleQuerySubmit = async () => {
        if (tokens.length > 0) {
            const portfolioQuery = generateQueryFromPortfolio(tokens);
            const formattedPrompt = await promptTemplate.format({
                date: getCurrentDate(),
                portfolio: portfolioQuery,
            });

            let response = await agentExecutor.invoke({ input: formattedPrompt + query });
            setAgentResponse(response.output);
            console.log(response);
        }
    };

    const handleSend = async () => {
        if (
          tokenAddress === undefined ||
          amount === undefined ||
          recipient === undefined ||
          typeof sendTransfer !== "function"
        ) {
          showNotification({
            message: "Error sending tokens",
            type: "error",
          });
          return Promise.resolve();
        } else {
            setTokenAddress(tokenAddress);
            setAmount(amount);
            setRecipient(recipient);
        }
        const resultTx: any = await sendTransfer();
    
        await sendUserOperations(resultTx);
      };

    const simulateTransfer = async (params: any) => {
        
        const { tokenAddress, amount, recipient } = params;
        console.log(`Simulated transfer of ${amount} tokens of ${tokenAddress} to ${recipient}`);
        
        if (
            tokenAddress === undefined ||
            amount === undefined ||
            recipient === undefined ||
            typeof sendTransfer !== "function"
        ) {
            showNotification({
                message: "Error sending tokens",
                type: "error",
            });
            return Promise.resolve();
        }
        try {
            const resultTx: any = await sendTransfer(tokenAddress, BigNumber.from(amount), recipient);
            console.log("RESULT TX", resultTx);
            const result: any = await simTransfer(resultTx);
            if (!result || result.error) {
                throw new Error(result?.error || "Simulation failed. No result returned.");
            }
            setSimulationResult(result);
        } catch (error: any) {
            showNotification({
                message: error.message,
                type: "error",
            });
            setSimulationResult(null); // Clear previous simulation results
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
                handleSend();
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
