import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { dynamicTools } from "../Tools/DynamicTool";

const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
  openAIApiKey: "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",
});

export const tools = dynamicTools;

const prompt = await pull<ChatPromptTemplate>(
  "hwchase17/openai-functions-agent"
);

export const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt,
});