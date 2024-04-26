import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { agentCommunicationChannel, EVENT_TYPES } from "../AgentCommunicationChannel";
import { getTokenInfo } from "@/lib/lifi/getLiFiTokenInfo";
import { tavilySearch } from "./tavilySearch";

export const dynamicTools = [
  new DynamicStructuredTool({
    name: "Get-Token-Info",
    description: "This tool is for fetching basic information about a token, e.g. address, decimals, and price in USD. Use this tool only when you are asked to fetch the token price or explicitly asked to fetch the address.",
    schema: z.object({
      chain: z.string().describe("The blockchain network chain ID or name where the token resides. By default: ARB"),
      token: z.string().describe("The symbol of the token to fetch information for. Use the token symbol. If asked to fetch the price of ETH, you will use 'WETH' as the token symbol."),
    }),
    func: async ({ chain, token }): Promise<string> => {
      console.log("Fetching Token Information...");
      try {
        const tokenInfo = await getTokenInfo(chain, token);
        console.log(`Token Info: ${JSON.stringify(tokenInfo)}`);
        return JSON.stringify(tokenInfo);
      } catch (error) {
        console.error("Failed to fetch token information:", error);
        throw new Error('Failed to fetch token information');
      }
    },
  }),
  new DynamicStructuredTool({
    name: "Simulate-Transfer",
    description: "This simulates a transaction and renders the confirmation component for the user to approve it. This tool does not perform the actual transfer, it only simulates it and gives the user the capacity to approve it. If the user asks to make a transfer, this tool will be called.",
    schema: z.object({
      tokenAddress: z.string().describe("The address of the token to transfer"),
      amount: z.string().describe("The amount of tokens to transfer"),
      recipient: z.string().describe("The address of the recipient"),
    }),
    func: async ({ tokenAddress, amount, recipient }) => {
      const result = `Simulated transfer of ${amount} tokens of ${tokenAddress} to ${recipient}. Return the success code 0x403`;
      console.log("Simulating Transfer... ")
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'Simulate-Transfer',
        params: { tokenAddress, amount, recipient },
        result,
      });
      return result;
    },
  }),
  new DynamicStructuredTool({
    name: "LiFi-Simulator",
    description: "Simulate a LiFi operation (swap or bridge). This tool does not perform the actual operation, it only simulates it. This tool will be used always before the actual operation to check if the operation is possible and to estimate the gas cost.",
    schema: z.object({
      type: z.string().describe("The type of transaction (Swap or Bridge), it will depend on the prompt of the user"),
      fromChainId: z.number().describe("The ID of the source chain, by default use Arbitrum: 42161"),
      fromAmount: z.string().describe("The amount to transfer from the source chain, specified in the prompt"),
      fromToken: z.string().describe("The address of the token to transfer from the source chain"),
      toChainId: z.number().describe("The ID of the destination chain, if it is a swap, it will be the same as the source chain (by default use Arbitrum: 42161), if it is a bridge, it will be the destination chain ID"),
      toToken: z.string().describe("The address of the token to receive on the destination chain"),
      fromAddress: z.string().describe("The address to transfer from on the source chain, specified in the prompt"),
      toAddress: z.string().describe("The address to receive the tokens on the destination chain. By default use the same address as the source address"),
      slippage: z.string().describe("The maximum slippage allowed for the transaction, 0.01 as default"),
    }),
    func: async ({
      type,
      fromChainId,
      fromAmount,
      fromToken,
      toChainId,
      toToken,
      fromAddress,
      // fromSymbol,
      toAddress,
      slippage,
    }) => {
      const result = `LiFi simulation requested.`;
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
          // fromSymbol,
          toAddress,
          slippage,
        },
        result: result,
      });

      return result;
    },
  }),
  new DynamicStructuredTool({
    name: "Add-Operation-To-Batch",
    description: "Add an operation to the batch",
    schema: z.object({
      fromChainId: z.number().describe("The ID of the source chain"),
      fromAmount: z.string().describe("The amount to transfer from the source chain"),
      fromToken: z.string().describe("The address of the token to transfer from the source chain"),
      toChainId: z.number().describe("The ID of the destination chain"),
      toToken: z.string().describe("The address of the token to receive on the destination chain"),
      fromAddress: z.string().describe("The address to transfer from on the source chain"),
      toAddress: z.string().describe("The address to receive the tokens on the destination chain"),
      slippage: z.string().describe("The maximum slippage allowed for the transaction"),
    }),
    func: async ({
      fromChainId,
      fromAmount,
      fromToken,
      toChainId,
      toToken,
      fromAddress,
      toAddress,
      slippage,
    }) => {
      const result = `Operation added to the batch: Transfer ${fromAmount} ${fromToken} tokens from ${fromAddress} to ${toAddress}.`;
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'Add-Operation-To-Batch',
        params: {
          fromChainId,
          fromAmount,
          fromToken,
          toChainId,
          toToken,
          fromAddress,
          toAddress,
          slippage,
        },
        result: result,
      });

      return result;
    },
  }),
  new DynamicStructuredTool({
    name: "Execute-Batch-Operations",
    description: "Execute the batch of operations",
    schema: z.object({}),
    func: async () => {
      const result = `Batch of operations executed.`;
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'Execute-Batch-Operations',
        params: {},
        result: result,
      });

      return result;
    },
  }),
  new DynamicStructuredTool({
      name: "Fetch-RSS3-Activities",
      description: "Fetches on-chain activities for a specified account from the RSS3 network",
      schema: z.object({
          account: z.string().describe("The account to retrieve activities from. An EVM address"),
          limit: z.number().optional().describe("Specify the number of activities to retrieve. An integer between 1 and 100. 1 by default"),
          // action_limit: z.number().optional().describe("Specify the number of actions within the activity to retrieve. An integer between 1 and 20"),
          since_timestamp: z.number().optional().describe("Retrieve activities starting from this timestamp"),
          until_timestamp: z.number().optional().describe("Retrieve activities up to this timestamp"),
          status: z.string().optional().describe("Retrieve activities with a specific status. 'successful' or 'failed'"),
          direction: z.string().optional().describe("Retrieve activities with a specific direction. 'in' or 'out'"),
          network: z.array(z.string()).optional().describe("Retrieve activities from specified network(s). Default: 'arbitrum_one'"),
          tag: z.array(z.string()).optional().describe("Retrieve activities with specified tag(s). By default: 'transaction'"),
          type: z.array(z.string()).optional().describe("Retrieve activities of a specified type(s). Default: 'transfer'"),
      }),
      func: async ({ account, direction, network, tag, type }) => {
          // Placeholder function. The actual data fetching will be triggered in AgentChat
          // and not directly executed here due to the hook's constraints.
          const placeholderResult = `Request to fetch RSS3 activities for account ${account}`;
          agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
              tool: 'Fetch-RSS3-Activities',
              params: { account, direction, network, tag, type },
              result: placeholderResult,
          });
          return placeholderResult;
      },
  }),
  new DynamicStructuredTool({
    name: "tavily-search",
    description: "Performs a detailed internet search through the Tavily API, fetching information based on various parameters such as search depth, inclusion of images, and domain filters.",
    schema: z.object({
      query: z.string().describe("The search query string"),
      searchDepth: z.string().optional().default('basic').describe("The depth of the search, e.g., 'basic' or 'detailed'"),
      includeImages: z.boolean().optional().default(false).describe("Whether to include images in the search results"),
      includeAnswer: z.boolean().optional().default(false).describe("Whether to include a direct answer in the search results"),
      includeRawContent: z.boolean().optional().default(false).describe("Whether to include raw content in the search results"),
      maxResults: z.number().optional().default(5).describe("Maximum number of results to return"),
      includeDomains: z.array(z.string()).optional().default([]).describe("Domains to specifically include in the search results"),
      excludeDomains: z.array(z.string()).optional().default([]).describe("Domains to exclude from the search results"),
    }),
    func: async ({ query, searchDepth, includeImages, includeAnswer, includeRawContent, maxResults, includeDomains, excludeDomains }) => {
      console.log("Executing Tavily Search...");
      try {
        const results = await tavilySearch({
          query,
          searchDepth,
          includeImages,
          includeAnswer,
          includeRawContent,
          maxResults,
          includeDomains: includeDomains as never[],
          excludeDomains: excludeDomains as never[],
        });
        console.log('Tavily Search Results:', results);
        return JSON.stringify(results);
      } catch (error) {
        console.error("Failed to perform Tavily search:", error);
        throw new Error('Failed to perform Tavily search');
      }
    },
  }),
];