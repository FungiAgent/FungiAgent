import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
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
    description: "Search for data using the Tavily Search API tailored for LLM Agents.",
    schema: z.object({
      query: z.string().describe("The search query string."),
      searchDepth: z.enum(['basic', 'advanced']).optional().describe("The depth of the search."),
      includeImages: z.boolean().optional().describe("Include images in the search results. False by default."),
      includeAnswer: z.boolean().optional().describe("Include an answer in the search results. False by default."),
      includeRawContent: z.boolean().optional().describe("Include raw content in the search results. False by default."),
      maxResults: z.number().optional().describe("The maximum number of search results. 5 by default."),
      includeDomains: z.array(z.string()).optional().describe("Domains specifically included in the search."),
      excludeDomains: z.array(z.string()).optional().describe("Domains specifically excluded from the search."),
    }),
    func: async ({ query, searchDepth, includeImages, includeAnswer, includeRawContent, maxResults, includeDomains, excludeDomains }) => {
      // Since actual search is performed in AgentChat using useTavilySearch hook,
      // here we just emit the tool request with provided parameters
      agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
        tool: 'tavily-search',
        params: {
          query,
          searchDepth,
          includeImages,
          includeAnswer,
          includeRawContent,
          maxResults,
          includeDomains,
          excludeDomains,
        },
        result: `Search request for: ${query}`,
      });
  
      return `Search request initiated for query: "${query}" with parameters.`;
    },
  }),
];