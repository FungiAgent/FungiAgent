import { ChatOpenAI, OpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
// import { retrieverTool } from "../Tools/Retriever";
import { dynamicTools } from "../Tools/DynamicTool";

// const llm = new ChatAnthropic({
//     modelName: "claude-3-sonnet-20240229",
//     temperature: 0,
//     anthropicApiKey: "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",
//   });

const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    openAIApiKey: "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",
    // azureOpenAIApiKey: "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",
    // azureOpenAIApiInstanceName: "gpt-3.5-turbo",
    // azureOpenAIApiDeploymentName: "gpt-3.5-turbo",
    // azureOpenAIApiVersion: "2021-07-15",

  });

// const llm = new ChatGoogleGenerativeAI({
//   modelName: "gemini-1.0-pro",
//   apiKey: "AIzaSyCXyb1XtiZEICx71LMoTuAsIAybnw1vFnA",
//   temperature: 0,
// });

export const tools = dynamicTools;

export const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/openai-functions-agent"
  );

export const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
});