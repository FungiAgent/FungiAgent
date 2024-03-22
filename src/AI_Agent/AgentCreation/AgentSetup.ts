import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";

// Get the prompt to use - you can modify this!
// If you want to see the prompt in full, you can at:
// https://smith.langchain.com/hub/hwchase17/openai-functions-agent
// const prompt = await pull<ChatPromptTemplate>(
//   "hwchase17/openai-functions-agent"
// );

// const llm = new ChatOpenAI({
//   modelName: "gpt-3.5-turbo-1106",
//   temperature: 0,
// });
// const tools = [];

// const agent = await createOpenAIFunctionsAgent({
//   llm,
//   tools,
//   prompt,
// });

// const agentExecutor = new AgentExecutor({
//     agent,
//     tools,
//   });
  
//   const result = await agentExecutor.invoke({
//     input: "what is LangChain?",
//   });
  
//   console.log(result);