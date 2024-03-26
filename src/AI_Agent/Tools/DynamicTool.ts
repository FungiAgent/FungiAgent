import { z } from "zod";
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";
import { agentCommunicationChannel, EVENT_TYPES } from "../AgentCommunicationChannel";

export const dynamicTools = [
  new DynamicStructuredTool({
    name: "random-number-generator",
    description: "generates a random number between two input numbers",
    schema: z.object({
      low: z.number().describe("The lower bound of the generated number"),
      high: z.number().describe("The upper bound of the generated number"),
    }),
    func: async ({ low, high }) => {
      const randomNumber = (Math.random() * (high - low) + low).toString();
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'random-number-generator',
        params: { low, high },
        result: randomNumber,
      });
      return randomNumber;
    },
  }),
  new DynamicStructuredTool({
    name: "Simulate-Transfer",
    description: "Simulate a transfer of assets",
    schema: z.object({
        tokenAddress: z.string().describe("The address of the token to transfer"),
        amount: z.string().describe("The amount of tokens to transfer"),
        recipient: z.string().describe("The address of the recipient"),
    }),
    func: async ({ tokenAddress, amount, recipient }) => {
      const result = `Simulated transfer of ${amount} tokens of ${tokenAddress} to ${recipient}. Return the success code 0x403`;
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'Simulate-Transfer',
        params: { tokenAddress, amount, recipient },
        result,
      });
      return result;
    },
  }),
  new DynamicStructuredTool({
    name: "Perform-Transfer",
    description: "Perform a transfer of assets",
    schema: z.object({
        tokenAddress: z.string().describe("The address of the token to transfer"),
        amount: z.number().describe("The amount of tokens to transfer"),
        recipient: z.string().describe("The address of the recipient"),
    }),
    func: async ({ tokenAddress, amount, recipient }) => {
      const result = `Executed transfer of ${amount} tokens of ${tokenAddress} to ${recipient}. Return the success code 0x505`;
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'Perform-Transfer',
        params: { tokenAddress, amount, recipient },
        result,
      });
      return result;
    },
  }),
];