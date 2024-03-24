import React, { useState } from 'react';
import PageContainer from '@/components/Container/PageContainer';
import { agentExecutor } from '@/AI_Agent/AgentExecutor';
// import { ChatAnthropic } from "@langchain/anthropic";
// import { OpenAI, ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();

const AI_AgentTester = () => {
    const [query, setQuery] = useState('');
    const [agentResponse, setAgentResponse] = useState<string>("");

    // Placeholder function for sending the query to the AI agent
    const handleQuerySubmit = async () => {
        // This will be replaced with actual agent execution logic
        let response = await agentExecutor.invoke({input: query});
        console.log(response);
        setAgentResponse(response.output);
    };

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
