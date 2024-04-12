import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate as ChatType } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { dynamicTools } from "../Tools/DynamicTool";
import dotenv from "dotenv";
import { AgentExecutor } from "langchain/agents";
import { AIMessage, SystemMessage, HumanMessage } from "@langchain/core/messages";

dotenv.config();

const llm = new ChatOpenAI({
  maxTokens: 200,
  modelName: "gpt-3.5-turbo",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const tools = dynamicTools;

const prompt = await pull<ChatType>(
  "hwchase17/openai-functions-agent"
);

const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt,
});

export const agentExecutor = new AgentExecutor({
  agent,
  tools,
  // verbose: true,
});

// A function for executing the agent
export const executeAgent = async (query: string, memory: (SystemMessage | AIMessage | HumanMessage)[], date?: string, portfolio?: string, scaAddress?: string | undefined) => {
  let response = await agentExecutor.invoke(
    {
      input: query,
      chat_history: [
        new SystemMessage(`Portfolio composition:\n\nDate: ${date}\n\nPortfolio: ${portfolio}\n\nSource address or Smart Contract Account (SCA): ${scaAddress} \n\nUSDC: 0xaf88d065e77c8cc2239327c5edb3a432268e5831, DAI: 0xda10009cbd5d07dd0cecc66161fc93d7c9000da1, WETH: 0x82af49447d8a07e3bd95bd0d56f35241523fbab1 ARB: 0x912ce59144191c1204e64559fe8253a0e49e6548\n\n`),
        new AIMessage("What is my purpose?"),
        new SystemMessage("You are a friendly AI agent that helps users with their queries concerning decentralized finance (DeFi). You are able to manage a Smart Contract Account (SCA) and perform operations such as swaps, transfers and search for transaction history of addresses. When performing an operation such as a swap, you always add the required 0s to the amount provided in the query, e.g. The user provides 1 USDC, you add 6 0s to make it 1,000,000 USDC."),
        ...memory,
      ],
    },
    {
      // This is needed because in most real world scenarios, a session id is needed per user.
      // It isn't really used here because we are using a simple in memory ChatMessageHistory.
      configurable: {
        sessionId: "foo",
      },
    }
  );
  console.log("Memory:", memory);
  return response;
};
