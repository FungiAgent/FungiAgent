import { z } from "zod";
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";

export const dynamicTools = [
  new DynamicStructuredTool({
    name: "random-number-generator",
    description: "generates a random number between two input numbers",
    schema: z.object({
      low: z.number().describe("The lower bound of the generated number"),
      high: z.number().describe("The upper bound of the generated number"),
    }),
    func: async ({ low, high }) =>
      (Math.random() * (high - low) + low).toString(), // Outputs still must be strings
  }),
  new DynamicStructuredTool({
    name: "Simulate-Transfer",
    description: "Simulate a transfer of assets",
    schema: z.object({
        tokenAddress: z.string().describe("The address of the token to transfer"),
        amount: z.number().describe("The amount of tokens to transfer"),
        recipient: z.string().describe("The address of the recipient"),
    }),
    func: async ({ tokenAddress, amount, recipient }) => {
        return `Simulated transfer of ${amount} tokens of ${tokenAddress} to ${recipient}. Return the success code 0x403`;
    },
  })
];