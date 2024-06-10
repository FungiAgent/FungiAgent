import { useState, useMemo } from "react";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { Hex } from "viem";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { UserOperation } from "@/lib/userOperations/types";
import { useSimUO } from "@/hooks/useSimUO";
import { useNotification } from "@/context/NotificationContextProvider";
import { ConfirmationType } from "@/hooks/useConfirmation";
import { useUserOperations } from "@/hooks/useUserOperations";

// This hook receives the parameters for a LiFi transaction, gets a quote for the transaction, and simulates the transaction
export const useSimLiFiTx = () => {
	const { simStatus, simTransfer } = useSimUO();
	const { showNotification } = useNotification();
	const { sendUserOperations } = useUserOperations();
	const [status, setStatus] = useState<{
		disabled: boolean;
		text: string | null;
	}>({ disabled: true, text: "Enter an amount" });
	const [quote, setQuote] = useState<any>(null);

	const getQuote = async (params: {
		fromChain: string;
		fromAmount: string;
		fromToken: string;
		toChain: string;
		toToken: string;
		fromAddress: string;
		toAddress: string;
		slippage: string;
		order: string;
	}): Promise<any> => {
		try {
			// console.log("QUOTE PARAMS: ", JSON.stringify(params, null, 2));
			const response = await axios.get("https://li.quest/v1/quote", { params });

			if (response.status === 200 && response.data) {
				return response.data;
			} else {
				throw new Error(`Failed to fetch quote: ${response.statusText}`);
			}
		} catch (error: any) {
			console.error("Error fetching LiFi quote:", error);

			if (error.response) {
				console.log("Response Data:", error.response.data); // Log response details
				console.log("Status:", error.response.status); // Log status code
				console.log("Headers:", error.response.headers); // Log response headers
			} else if (error.request) {
				console.log("No response received. Request:", error.request); // Log request if no response
			} else {
				console.log("Error Message:", error.message); // Log general error message
			}

			throw error; // Re-throw the error for further handling
		}
	};

	const extractConfirmationDetails = (quote) => {
		// console.log("QUOTE: ", JSON.stringify(quote, null, 2));
		if (!quote || !quote.action) {
			console.error("Quote or its action is undefined.");
			return null;
		}

		const { action, estimate, toolDetails } = quote;
		const fromToken = action.fromToken;
		const toToken = action.toToken;

		if (!fromToken || !toToken) {
			console.error("Tokens are missing from the quote.");
			return null;
		}

		const fromAmountRaw = action.fromAmount;
		const toAmountMinRaw = estimate.toAmountMin;
		const toAmountRaw = estimate.toAmount;

		const fromTokenDecimals = fromToken.decimals;
		const toTokenDecimals = toToken.decimals;

		const amountToSend = ethers.utils.formatUnits(
			fromAmountRaw,
			fromTokenDecimals
		);
		const amountToReceiveMin = ethers.utils.formatUnits(
			toAmountMinRaw,
			toTokenDecimals
		);
		const amountToReceive = ethers.utils.formatUnits(
			toAmountRaw,
			toTokenDecimals
		);

		const gasCostsUSD = estimate.gasCosts.reduce(
			(sum, cost) => sum + parseFloat(cost.amountUSD),
			0
		);
		const feeCostsUSD = estimate.feeCosts.reduce(
			(sum, cost) => sum + parseFloat(cost.amountUSD),
			0
		);
		const totalGasAndFeeCostsUSD = gasCostsUSD + feeCostsUSD;

		return {
			toolName: toolDetails.name,
			toolLogoURI: toolDetails.logoURI,
			fromTokenSymbol: fromToken.symbol,
			fromTokenLogoURI: fromToken.logoURI,
			toTokenSymbol: toToken.symbol,
			toTokenLogoURI: toToken.logoURI,
			amountToSend,
			amountToReceive,
			amountToReceiveMin,
			gasCost: totalGasAndFeeCostsUSD,
			slippage: action.slippage * 100, // Convert to percentage
			tokenInDecimals: fromTokenDecimals,
			tokenOutDecimals: toTokenDecimals,
			type: ConfirmationType.Swap,
		};
	};

	const createUserOpFromQuote = (quote) => {
		const { action, estimate } = quote;
		const tokenAddress: Hex = action.fromToken.address;
		const spender: Hex = quote.transactionRequest.to;
		const amount: number = quote.estimate.fromAmount;

		const userOps: UserOperation[] = [];

		if (tokenAddress !== ethers.constants.AddressZero) {
			userOps.push(
				createApproveTokensUserOp({
					tokenAddress,
					spender,
					amount: BigNumber.from(amount),
				})
			);

			userOps.push({
				target: quote.transactionRequest.to,
				data: quote.transactionRequest.data,
			});
		} else {
			userOps.push({
				target: quote.transactionRequest.to,
				data: quote.transactionRequest.data,
				value: BigInt(amount),
			});
		}

		return userOps;
	};

	const simulateLifiTx = async (userOps: UserOperation[]) => {
		try {
			const result = await simTransfer(userOps);

			console.log("Sim result: ", JSON.stringify(result, null, 2));
			if (!result) {
				showNotification({
					message: "LiFi transaction simulation error",
					type: "error",
				});
			} else {
				showNotification({
					message: "LiFi transaction simulated successfully",
					type: "success",
				});
			}

			return result;
		} catch (error: any) {
			showNotification({
				message: error.message,
				type: "error",
			});

			console.error(error);
		}
	};

	const executeLifiTx = async (userOps: UserOperation[]) => {
		try {
			const result = await sendUserOperations(userOps);

			showNotification({
				message: "LiFi transaction executed successfully",
				type: "success",
			});

			return result;
		} catch (error: any) {
			showNotification({
				message: error.message,
				type: "error",
			});

			console.error(error);
		}
	};

	const simLiFiTx = useMemo(() => {
		const handleLiFiTx = async (params: any) => {
			const {
				type,
				fromChain,
				fromAmount,
				fromToken,
				toChain,
				toToken,
				fromAddress,
				toAddress,
				slippage,
				order,
			} = params;
			try {
				setStatus({
					disabled: true,
					text: `${type === "Swap" ? "Swapping" : "Bridging"}`,
				});

				const orders = ["CHEAPEST", "RECOMMENDED"];
				let quote: any;

				try {
					// const fromChainLifi = getChainIdLifi(fromChainId);
					// const toChainLifi = getChainIdLifi(toChainId || 0);
					const responses = await Promise.all(
						orders.map(() => {
							return getQuote({
								fromChain,
								fromAmount,
								fromToken,
								toChain,
								toToken,
								fromAddress,
								toAddress,
								slippage,
								order,
							});
						})
					);

					// const filteredResponses = responses.filter(
					//   (response) => response.estimate.executionDuration < 300
					// );

					quote = responses.reduce((maxResponse, response) => {
						return response.estimate.toAmountUSD -
							response.estimate.gasCosts[0].toAmountUSD >
							maxResponse.estimate.toAmountUSD -
								maxResponse.estimate.gasCosts[0].toAmountUSD
							? response
							: maxResponse;
					}, responses[0]);
				} catch (error) {
					console.error("Error obtaining quotes:", error);
					console.log("Error obtaining quotes:", error);
				}

				const spender: Hex = quote.transactionRequest.to;
				const tokenAddress: Hex = quote.action.fromToken.address;
				const amount: number = quote.estimate.fromAmount;
				console.log("quote", quote);

				setQuote(quote);

				const userOps: UserOperation[] = [];

				if (tokenAddress != ethers.constants.AddressZero) {
					userOps.push(
						createApproveTokensUserOp({
							tokenAddress,
							spender,
							amount: BigNumber.from(amount),
						})
					);
					userOps.push({
						target: quote.transactionRequest.to,
						data: quote.transactionRequest.data,
					});
				} else {
					userOps.push({
						target: quote.transactionRequest.to,
						data: quote.transactionRequest.data,
						value: BigInt(amount),
					});
				}

				setStatus({ disabled: true, text: "Enter an amount" });
				console.log("userOps", userOps);
				// await addMessage(new SystemMessage(`LiFi transaction details: ${JSON.stringify(quote)}`));
				const result = await simTransfer(userOps);

				showNotification({
					message: "LiFi transaction simulated successfully",
					type: "success",
				});

				return result;
			} catch (error: any) {
				setQuote(null);
				setStatus({ disabled: true, text: "Enter an amount" });
				showNotification({
					message: error.message,
					type: "error",
				});
				console.error(error);
				console.log("error", error);
				// await addMessage(new SystemMessage(`Error simulating LiFi transaction: ${error.message}`));
			}
		};

		return handleLiFiTx;
	}, [showNotification, simTransfer]);

	return {
		status,
		simulateLifiTx,
		simStatus,
		simLiFiTx,
		quote,
		extractConfirmationDetails,
		getQuote,
		createUserOpFromQuote,
		executeLifiTx,
	};
};
