import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/Container/PageContainer';
import { agentExecutor } from '@/AI_Agent/AgentExecutor';
import { useTokensInfo } from '@/hooks/useTokensInfo';
import dotenv from "dotenv";
import { useSimUO } from "@/hooks/useSimUO";
import { useERC20Transfer } from "@/hooks/useERC20Transfer";

import { PromptTemplate } from "langchain/prompts";
import { format } from 'path';

dotenv.config();

const AI_AgentTester = () => {
    const { tokens } = useTokensInfo();
    const [query, setQuery] = useState<string>("");
    const [agentResponse, setAgentResponse] = useState<string>("");
    const { simStatus, simTransfer } = useSimUO();

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
        template: "Portfolio composition:\n\n{date}\n\n{portfolio}",
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

    const simulateTransfer = () => {
        console.log("Simulate Transfer triggered!");
        // Add the actual simulation logic or function call here
    };

    useEffect(() => {
        if (agentResponse.includes("0x403")) {
            simulateTransfer();
        }
    }, [agentResponse]);

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

export default AI_AgentTester;

// PERFORM A SIMULATION:

// recipient: 0x141571912eC34F9bE50a6b8DC805e71Df70fAdAD
// tokenAddress: 0xaf88d065e77c8cc2239327c5edb3a432268e5831
// amount: $5