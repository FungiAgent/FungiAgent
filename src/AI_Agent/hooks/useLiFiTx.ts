import { useState, useMemo } from "react";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { Hex } from "viem";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { UserOperation } from "@/lib/userOperations/types";
import { getChainIdLifi } from "@/lib/lifi/getChainIdLifi";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useNotification } from '@/context/NotificationContextProvider';
import { useChatHistory } from '@/AI_Agent/Context/ChatHistoryContext';
import { SystemMessage } from '@langchain/core/messages';

// This hook receives the parameters for a LiFi transaction, gets a quote for the transaction, and performs the transaction
export const useLiFiTx = () => {
    const { showNotification } = useNotification();
    const { addMessage } = useChatHistory();
    const { sendUserOperations } = useUserOperations();
    const [status, setStatus] = useState<{
        disabled: boolean;
        text: string | null;
    }>({ disabled: true, text: "Enter an amount" });

    const getQuote = async (params: { fromChain: string | null; fromAmount: any; fromToken: any; toChain: string | null; toToken: any; fromAddress: any; toAddress: any; slippage: any; order: string; }) => {
        const response = await axios.get("https://li.quest/v1/quote", { params });
        return response.data;
    };

    const sendLiFiTx = useMemo(() => {
        const handleLiFiTx = async (params: any) => {
        const {
            type,
            fromChainId,
            fromAmount,
            fromToken,
            toChainId,
            toToken,
            fromAddress,
            toAddress,
            slippage,
        } = params;
        try {
            setStatus({
            disabled: true,
            text: `${type === "Swap" ? "Swapping" : "Bridging"}`,
            });

            const orders = ["FASTEST", "CHEAPEST", "SAFEST", "RECOMMENDED"];
            let quote: any;

            try {
            const fromChainLifi = getChainIdLifi(fromChainId);
            const toChainLifi = getChainIdLifi(toChainId || 0);
            const responses = await Promise.all(
                orders.map((order) => {
                return getQuote({
                    fromChain: fromChainLifi,
                    fromAmount,
                    fromToken,
                    toChain: toChainLifi,
                    toToken,
                    fromAddress,
                    toAddress,
                    slippage,
                    order,
                });
                })
            );

            const filteredResponses = responses.filter(
                (response) => response.estimate.executionDuration < 300
            );

            quote = filteredResponses.reduce(
                (maxResponse, response) => {
                return (
                    response.estimate.toAmountUSD -
                    response.estimate.gasCosts[0].toAmountUSD >
                    maxResponse.estimate.toAmountUSD -
                    maxResponse.estimate.gasCosts[0].toAmountUSD
                    ? response
                    : maxResponse
                );
                },
                filteredResponses[0]
            );
            } catch (error) {
                await addMessage(new SystemMessage(`Error: ${error}`)); 
                console.error("Error obtaining quotes:", error);
            }

            const spender: Hex = quote.transactionRequest.to;
            const tokenAddress: Hex = quote.action.fromToken.address;
            const amount: number = quote.estimate.fromAmount;
            console.log("quote", quote);

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
            await addMessage(new SystemMessage(`LiFi transaction details: ${JSON.stringify(quote)}`));
            const result = await sendUserOperations(userOps);
            showNotification({
                message: "Transfer simulated successfully",
                type: "success",
            });
            return result;
            
        } catch (error: any) {
            setStatus({ disabled: true, text: "Enter an amount" });
            showNotification({
                message: error.message,
                type: "error",
              });
            console.error(error);
            addMessage(new SystemMessage(`Error: ${error.message}`));
        }
        };

        return handleLiFiTx;
    }, []);

    return { status, sendLiFiTx };
};