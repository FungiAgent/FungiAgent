import { z } from "zod";
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";
import { agentCommunicationChannel, EVENT_TYPES } from "../AgentCommunicationChannel";
import { useSimLiFiTx } from "../hooks/useSimLiFiTx";

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
  new DynamicStructuredTool({
    name: "LiFi-Simulator",
    description: "Simulate a LiFi transaction (swap or bridge)",
    schema: z.object({
      type: z.string().describe("The type of transaction (Swap or Bridge), it will depend on the prompt of the user"),
      fromChainId: z.number().describe("The ID of the source chain, by default use Arbitrum: 42161"),
      fromAmount: z.string().describe("The amount to transfer from the source chain, specified in the prompt"),
      fromToken: z.string().describe("The address of the token to transfer from the source chain"),
      toChainId: z.number().describe("The ID of the destination chain, if it is a swap, it will be the same as the source chain (by default use Arbitrum: 42161), if it is a bridge, it will be the destination chain ID"),
      toToken: z.string().describe("The address of the token to receive on the destination chain"),
      fromAddress: z.string().describe("The address to transfer from on the source chain, specified in the prompt"),
      fromSymbol: z.string().describe("The symbol of the token to transfer from the source chain"),
      toAddress: z.string().describe("The address to receive the tokens on the destination chain. By default use the same address as the source address"),
      slippage: z.string().describe("The maximum slippage allowed for the transaction, 0.1 as default"),
    }),
    func: async ({
      type,
      fromChainId,
      fromAmount,
      fromToken,
      toChainId,
      toToken,
      fromAddress,
      fromSymbol,
      toAddress,
      slippage,
    }) => {
      const result = `LiFi simulation of ${fromAmount} ${fromSymbol} tokens requested.`;
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'LiFi-Simulator',
        params: {
          type,
          fromChainId,
          fromAmount,
          fromToken,
          toChainId,
          toToken,
          fromAddress,
          fromSymbol,
          toAddress,
          slippage,
        },
        result: result,
      });

      return result;
    },
  }),
  new DynamicStructuredTool({
    name: "LiFi-Transaction",
    description: "Perform a LiFi transaction (swap or bridge)",
    schema: z.object({
      type: z.string().describe("The type of transaction (Swap or Bridge), it will depend on the prompt of the user"),
      fromChainId: z.number().describe("The ID of the source chain, by default use Arbitrum: 42161"),
      fromAmount: z.string().describe("The amount to transfer from the source chain, specified in the prompt"),
      fromToken: z.string().describe("The address of the token to transfer from the source chain"),
      toChainId: z.number().describe("The ID of the destination chain, if it is a swap, it will be the same as the source chain (by default use Arbitrum: 42161), if it is a bridge, it will be the destination chain ID"),
      toToken: z.string().describe("The address of the token to receive on the destination chain"),
      fromAddress: z.string().describe("The address to transfer from on the source chain, specified in the prompt"),
      fromSymbol: z.string().describe("The symbol of the token to transfer from the source chain"),
      toAddress: z.string().describe("The address to receive the tokens on the destination chain. By default use the same address as the source address"),
      slippage: z.string().describe("The maximum slippage allowed for the transaction, 0.1 as default"),
    }),
    func: async ({
      type,
      fromChainId,
      fromAmount,
      fromToken,
      toChainId,
      toToken,
      fromAddress,
      fromSymbol,
      toAddress,
      slippage,
    }) => {
      const result = `LiFi transaction of ${fromAmount} ${fromSymbol} tokens requested.`;
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'LiFi-Transaction',
        params: {
          type,
          fromChainId,
          fromAmount,
          fromToken,
          toChainId,
          toToken,
          fromAddress,
          fromSymbol,
          toAddress,
          slippage,
        },
        result: result,
      });

      return result;
    },
  }),
];