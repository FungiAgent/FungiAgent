import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate as ChatType } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { dynamicTools } from "../Tools/DynamicTool";
import dotenv from "dotenv";
import { AgentExecutor } from "langchain/agents";
import {
    AIMessage,
    SystemMessage,
    HumanMessage,
} from "@langchain/core/messages";

dotenv.config();

const llm = new ChatOpenAI({
    maxTokens: 500,
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

const tools = dynamicTools;

// @ts-expect-error
const prompt = await pull<ChatType>("hwchase17/openai-functions-agent");

const agent = await createOpenAIFunctionsAgent({
    llm,
    // @ts-expect-error
    tools,
    // @ts-expect-error
    prompt,
});

const agentExecutor = new AgentExecutor({
    agent,
    // @ts-expect-error
    tools,
    // verbose: true,
});

const internalAgentExecutor = new AgentExecutor({
    agent,
    tools: [],
    // verbose: true,
});

// A function for executing the agent
export const executeAgent = async (
    query: string,
    memory: (SystemMessage | AIMessage | HumanMessage)[],
    date?: string,
    portfolio?: string,
    scaAddress?: string | undefined,
) => {
    let response = await agentExecutor.invoke(
        {
            input: query,
            chat_history: [
                portfolio
                    ? new SystemMessage(
                          `Portfolio composition:\n\nDate: ${date}\n\nPortfolio: ${portfolio}\n\nSource address or Smart Contract Account (SCA): ${scaAddress} \n\n`,
                      )
                    : new SystemMessage(
                          `Portfolio is empty. If user asks about the contents of their portfolio, tell them it is empty`,
                      ),
                new AIMessage("What is my purpose?"),
                new SystemMessage(
                    "You are a friendly AI agent that helps users with their queries concerning decentralized finance (DeFi). You are able to manage a Smart Contract Account (SCA) and perform operations such as swaps, transfers and search for transaction history of addresses. When performing an operation such as a swap, you always add the required 0s (decimals) to the amount provided in the query, e.g. The user provides 1 USDC, you add 6 0s to make it 1,000,000 USDC.",
                ),
                ...memory,
            ],
        },
        {
            // This is needed because in most real world scenarios, a session id is needed per user.
            // It isn't really used here because we are using a simple in memory ChatMessageHistory.
            configurable: {
                sessionId: "foo",
            },
        },
    );
    // console.log("Memory:", memory);
    // console.log("executeAgent.response:", response);

    return response;
};

export const executeInternalAgent = async (
    query: string,
    memory: (SystemMessage | AIMessage | HumanMessage)[],
) => {
    // console.log("executeAgent.query: ", query);
    let response = await internalAgentExecutor.invoke(
        {
            input: query,
            chat_history: [
                new AIMessage("What is my purpose?"),
                new SystemMessage(
                    "You are a friendly AI agent that helps users with their queries concerning decentralized finance (DeFi). You communicate with users based on system inputs.",
                ),
                ...memory,
            ],
        },
        {
            // This is needed because in most real world scenarios, a session id is needed per user.
            // It isn't really used here because we are using a simple in memory ChatMessageHistory.
            configurable: {
                sessionId: "foo",
            },
        },
    );
    // console.log("Memory:", memory);
    // console.log("executeInternalAgent.response:", response);

    return response;
};
