import { AgentExecutor } from "langchain/agents";
import { agent, tools } from "../AgentCreation";

export const agentExecutor = new AgentExecutor({
  agent,
  tools,
});