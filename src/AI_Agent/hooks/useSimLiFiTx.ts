import { useState, useMemo } from "react";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { Hex } from "viem";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { UserOperation } from "@/lib/userOperations/types";
import { getChainIdLifi } from "@/lib/lifi/getChainIdLifi";
import { useSimUO } from "@/hooks/useSimUO";
import { useNotification } from '@/context/NotificationContextProvider';
import { useChatHistory } from '@/AI_Agent/Context/ChatHistoryContext';
import { SystemMessage } from '@langchain/core/messages';

// This hook receives the parameters for a LiFi transaction, gets a quote for the transaction, and simulates the transaction
export const useSimLiFiTx = () => {
  const { simStatus, simTransfer } = useSimUO();
  const { addMessage } = useChatHistory();
  const { showNotification } = useNotification();
  const [status, setStatus] = useState<{
    disabled: boolean;
    text: string | null;
  }>({ disabled: true, text: "Enter an amount" });
  const [quote, setQuote] = useState<any>(null);

  const getQuote = async (params: { fromChain: string | null; fromAmount: string; fromToken: string; toChain: string | null; toToken: string; fromAddress: string; toAddress: string; slippage: string;}): Promise<any> => {
    try {
      const response = await axios.get("https://li.quest/v1/quote", { params });
      
      // Check if the response indicates success
      if (response.status === 200 && response.data) {
        return response.data;
    } else {
        throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }
    } catch (error) {
      console.error("Error fetching LiFi quote:", error);
      throw error;
    }
  }

  const extractConfirmationDetails = (quote) => {
    const { action, estimate, toolDetails } = quote;
    const { inToken, outToken, fromAmount, slippage } = action;
    const { toAmountMin, gasCosts, tool, feeCosts } = estimate;

    const amountToSend = fromAmount; // Assume fromAmount is already in a user-friendly format
    const amountToReceiveMin = ethers.utils.formatUnits(toAmountMin, outToken.decimals); // Convert raw amount to decimal format
    const gasCost = gasCosts.amountUSD + feeCosts.amountUSD; // Sum gas costs and fee costs

    return {
        toolName: tool,
        toolLogoURI: toolDetails.logoURI,
        inTokenSymbol: inToken.symbol,
        inTokenLogoURI: inToken.logoURI,
        outTokenSymbol: outToken.symbol,
        outTokenLogoURI: outToken.logoURI,
        amountToSend,
        amountToReceiveMin,
        gasCost,
        slippage: slippage * 100, // Convert to percentage
    };
  };


  const simLiFiTx = useMemo(() => {
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

        const orders = ["CHEAPEST", "RECOMMENDED"];
        let quote: any;

        try {
          // const fromChainLifi = getChainIdLifi(fromChainId);
          // const toChainLifi = getChainIdLifi(toChainId || 0);
          const responses = await Promise.all(
            orders.map(() => {
              return getQuote({
                fromChain: fromChainId,
                fromAmount,
                fromToken,
                toChain: toChainId,
                toToken,
                fromAddress,
                toAddress,
                slippage,
              });
            })
          );

          // const filteredResponses = responses.filter(
          //   (response) => response.estimate.executionDuration < 300
          // );

          quote = responses.reduce(
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
            responses[0]
          );
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

  return { status, simStatus, simLiFiTx, quote, extractConfirmationDetails, getQuote };
};
