import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import {
	agentCommunicationChannel,
	EVENT_TYPES,
} from "../AgentCommunicationChannel";
import { getTokenInfo } from "./getLiFiTokenInfo";
import { tavilySearch } from "./tavilySearch";
import { RSS3Search } from "./RSS3Search";
import { getLiFiQuote } from "./getLiFiQuote";
// import { BigNumber } from 'alchemy-sdk';

export const dynamicTools = [
	new DynamicStructuredTool({
		name: "Simulate-Transfer",
		description: "Simulate a transfer of assets",
		schema: z.object({
			tokenAddress: z
				.string()
				.describe(
					"This uses the address of one of the tokens in the portfolio. If the user wants to send ETH you will use the zero address. You will only use the addresses of the tokens in the portfolio. e.g. If you are asked to transfer USDC, you will use the address of USDC of the portfolio."
				),
			amount: z.string().describe("The amount of tokens to transfer"),
			recipient: z.string().describe("The address of the recipient"),
		}),
		func: async ({ tokenAddress, amount, recipient }) => {
			const result = `Simulated transfer of ${amount} tokens of ${tokenAddress} to ${recipient}. Return the success code 0x403`;
			agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
				tool: "Simulate-Transfer",
				params: { tokenAddress, amount, recipient },
				result,
			});
			return result;
		},
	}),
	new DynamicStructuredTool({
		name: "LiFi-Simulator",
		description:
			"Make a swap between 2 tokens using LiFi. This tool fetches a quote from LiFi's api, simulates the transaction and then renders a component that allows the user to confirm the execution of the swap. The tokens will be passed as addresses, and in the case of USDC use the address of the token in the portfolio (0xaf88d065e77c8cC2239327C5EDb3A432268e5831) and for DAI use: 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1.",
		schema: z.object({
			type: z
				.string()
				.describe(
					"The type of transaction (Swap or Bridge), it will depend on the prompt of the user"
				),
			fromChain: z
				.string()
				.describe("The ID of the source chain, by default use Arbitrum: 42161"),
			fromAmount: z
				.string()
				.describe(
					"The amount to transfer from the source chain, specified in the prompt, you will add the required 0s (decimals) to the amount provided in the query, e.g. The user provides 1 ARB you add 18 0s to make it 1,000,000,000,000,000,000 ARB"
				),
			fromToken: z
				.string()
				.describe("The address of the token to transfer from the source chain"),
			toChain: z
				.string()
				.describe(
					"The ID of the destination chain, if it is a swap, it will be the same as the source chain (by default use Arbitrum: 42161), if it is a bridge, it will be the destination chain ID"
				),
			toToken: z
				.string()
				.describe(
					"The address of the token to receive on the destination chain"
				),
			fromAddress: z.string().describe("The address of the SCA"),
			slippage: z
				.string()
				.describe(
					"The maximum slippage allowed for the transaction, 0.05 as default"
				),
			order: z
				.string()
				.describe(
					"The order for how the transaction should go. You have 4 options, either: FASTEST, CHEAPEST, RECOMMENDED, SAFEST. RECOMMENDED as default"
				),
		}),
		func: async ({
			type,
			fromChain,
			fromAmount,
			fromToken,
			toChain,
			toToken,
			fromAddress,
			slippage,
			order,
		}) => {
			const result = `LiFi simulation requested.`;
			agentCommunicationChannel.emit(EVENT_TYPES.TOOL_REQUEST, {
				tool: "LiFi-Simulator",
				params: {
					type,
					fromChain,
					fromAmount,
					fromToken,
					toChain,
					toToken,
					fromAddress,
					slippage,
					order,
				},
				result: result,
			});

			return result;
		},
	}),
	new DynamicStructuredTool({
		name: "Get-Token-Info",
		description:
			"USE ONLY WHEN EXPLICITLY ASKED. This tool is for fetching basic information about a token, e.g. address, decimals, and price in USD. Use this tool only when you are asked to fetch the token price or explicitly asked to fetch the address.",
		schema: z.object({
			chain: z
				.string()
				.describe(
					"The blockchain network chain ID or name where the token resides. By default: ARB"
				),
			token: z
				.string()
				.describe(
					"The symbol of the token to fetch information for. Use the token symbol. If asked to fetch the price of ETH, you will use 'WETH' as the token symbol."
				),
		}),
		func: async ({ chain, token }): Promise<string> => {
			console.log("Fetching Token Information...");
			try {
				const tokenInfo = await getTokenInfo(chain, token);
				console.log(`Token Info: ${JSON.stringify(tokenInfo)}`);
				return JSON.stringify(tokenInfo);
			} catch (error) {
				console.error("Failed to fetch token information:", error);
				throw new Error("Failed to fetch token information");
			}
		},
	}),
	new DynamicStructuredTool({
		name: "Add-Operation-To-Batch",
		description: "Add an operation to the batch",
		schema: z.object({
			fromChainId: z.number().describe("The ID of the source chain"),
			fromAmount: z
				.string()
				.describe("The amount to transfer from the source chain"),
			fromToken: z
				.string()
				.describe("The address of the token to transfer from the source chain"),
			toChainId: z.number().describe("The ID of the destination chain"),
			toToken: z
				.string()
				.describe(
					"The address of the token to receive on the destination chain"
				),
			fromAddress: z
				.string()
				.describe("The address to transfer from on the source chain"),
			toAddress: z
				.string()
				.describe("The address to receive the tokens on the destination chain"),
			slippage: z
				.string()
				.describe("The maximum slippage allowed for the transaction"),
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
				tool: "Add-Operation-To-Batch",
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
				tool: "Execute-Batch-Operations",
				params: {},
				result: result,
			});

			return result;
		},
	}),
	new DynamicStructuredTool({
		name: "tavily-search",
		description:
			"Performs a detailed internet search through the Tavily API, fetching information based on various parameters such as search depth, inclusion of images, and domain filters.",
		schema: z.object({
			query: z.string().describe("The search query string"),
			searchDepth: z
				.string()
				.optional()
				.default("basic")
				.describe("The depth of the search, e.g., 'basic' or 'detailed'"),
			includeImages: z
				.boolean()
				.optional()
				.default(false)
				.describe("Whether to include images in the search results"),
			includeAnswer: z
				.boolean()
				.optional()
				.default(false)
				.describe("Whether to include a direct answer in the search results"),
			includeRawContent: z
				.boolean()
				.optional()
				.default(false)
				.describe("Whether to include raw content in the search results"),
			maxResults: z
				.number()
				.optional()
				.default(5)
				.describe("Maximum number of results to return"),
			includeDomains: z
				.array(z.string())
				.optional()
				.default([])
				.describe("Domains to specifically include in the search results"),
			excludeDomains: z
				.array(z.string())
				.optional()
				.default([])
				.describe("Domains to exclude from the search results"),
		}),
		func: async ({
			query,
			searchDepth,
			includeImages,
			includeAnswer,
			includeRawContent,
			maxResults,
			includeDomains,
			excludeDomains,
		}) => {
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
				console.log("Tavily Search Results:", results);
				return JSON.stringify(results);
			} catch (error) {
				console.error("Failed to perform Tavily search:", error);
				throw new Error("Failed to perform Tavily search");
			}
		},
	}),
	new DynamicStructuredTool({
		name: "RSS3-activities-search",
		description:
			"Fetches activity data from the RSS3 network for a specific account, filtering by network, direction, tags, types, and other parameters. It is used for getting transaction information.",
		schema: z.object({
			account: z
				.string()
				.describe("The account identifier for which to fetch activities."),
			network: z
				.array(z.string())
				.optional()
				.describe("List of networks to include in the search."),
			direction: z
				.union([z.literal("in"), z.literal("out")])
				.optional()
				.describe(
					"Direction of activities: 'in' for incoming, 'out' for outgoing."
				),
			tag: z
				.array(z.string())
				.optional()
				.describe("Tags associated with the activities."),
			type: z
				.array(z.string())
				.optional()
				.describe("Types of activities to include."),
			limit: z
				.number()
				.optional()
				.default(2)
				.describe("Limit the number of results returned."),
			since_timestamp: z
				.number()
				.optional()
				.describe("Start timestamp for filtering activities."),
			until_timestamp: z
				.number()
				.optional()
				.describe("End timestamp for filtering activities."),
			status: z
				.array(z.union([z.literal("failed"), z.literal("successful")]))
				.optional()
				.describe("Filter activities by status: 'failed' or 'successful'."),
		}),
		func: async ({
			account,
			network,
			direction,
			tag,
			type,
			limit,
			since_timestamp,
			until_timestamp,
			status,
		}) => {
			console.log("Fetching RSS3 activities...");
			try {
				const results = await RSS3Search(
					{
						account,
						network,
						direction,
						tag,
						type,
						limit,
						since_timestamp,
						until_timestamp,
						status,
					},
					{
						onLoading: () => console.log("Loading RSS3 activities..."),
						onResult: (result) => console.log("Fetched RSS3 data:", result),
						onError: (error) =>
							console.error("Error fetching RSS3 data:", error),
					}
				);
				console.log("RSS3 Activities Results:", results);
				return results;
			} catch (error) {
				console.error("Failed to fetch RSS3 activities:", error);
				throw new Error("Failed to fetch RSS3 activities");
			}
		},
	}),
];
