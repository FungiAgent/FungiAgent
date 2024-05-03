import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Hex } from "viem";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { BigNumber } from "ethers";
import { useNotification } from '@/context/NotificationContextProvider';
import axios from "axios";
import { getChainIdLifi } from "@/lib/lifi/getChainIdLifi";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useChatHistory } from '@/context/ChatHistoryContext';
import { SystemMessage } from '@langchain/core/messages';
import { add } from "lodash";

export const useLiFiBatch = () => {
    const { showNotification } = useNotification();
    const { addMessage } = useChatHistory();
    const { sendUserOperations } = useUserOperations();
    const [batchedOperations, setBatchedOperations] = useState<any[]>([]);
    // const { addOperationToBatch, batchedOperations } = useGlobalContext();

    const getQuote = async (params) => {
        const response = await axios.get("https://li.quest/v1/quote", { params });
        return response.data;
    };

    const batchedOperationsRef = useRef(batchedOperations);
    useEffect(() => {
        batchedOperationsRef.current = batchedOperations;
    }, [batchedOperations]);

    const executeBatchOperations = useCallback(async () => {
        try {
            const currentBatch = batchedOperationsRef.current;
            console.log("Executing batched operations", currentBatch);
            const result = await sendUserOperations(currentBatch);
            console.log("Batched operations executed", result);
            showNotification({
                message: "Batched operations executed successfully",
                type: "success",
            });
            setBatchedOperations([]);
        } catch (error: any) {
            showNotification({
                message: error.message,
                type: "error",
            });
        }
    }, [sendUserOperations, showNotification]);

    const addToBatch = useMemo(() => {
        const addOperationToBatch = (operation: any) => {
            setBatchedOperations(prev => [...prev, operation]);
        };

        const handleBatchUserOp = async (params: any) => {
            const {
                fromChainId,
                fromAmount,
                fromToken,
                toChainId,
                toToken,
                fromAddress,
                toAddress,
                slippage,
            } = params;

            if (!fromChainId || !fromAmount || !fromToken || !fromAddress || !toAddress || !slippage) {
                showNotification({
                    message: "Error sending tokens",
                    type: "error",
                });
                return;
            }
            try {
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
                    quote = responses.find((response) => response.estimate !== null);
                    showNotification({
                        message: "Quote received!",
                        type: "success",
                      });
                } catch (error: any) {
                    showNotification({
                        message: error.message,
                        type: "error",
                      });
                    return;
                }

                if (quote) {
                    const approvee: Hex = quote.transactionRequest.to;
                    const tokenAddress: Hex = quote.action.fromToken.address;
                    const amount: number = quote.estimate.fromAmount;

                    const callDataApprove = createApproveTokensUserOp({
                        tokenAddress,
                        spender: approvee,
                        amount: BigNumber.from(amount),
                    });
                    const callDataSwap = {
                        target: quote.transactionRequest.to,
                        data: quote.transactionRequest.data,
                    };

                    await addMessage(new SystemMessage(`Adding batched operations for ${amount} tokens of ${tokenAddress} to ${toAddress}`));

                    addOperationToBatch(callDataApprove);
                    addOperationToBatch(callDataSwap);
                    showNotification({
                        message: "Tx added to batch!",
                        type: "success",
                      });

                    console.log('Call data approve', callDataApprove);
                    console.log("Batched operations", batchedOperations);
                }
            } catch (error: any) {
                showNotification({
                    message: error.message,
                    type: "error",
                  });
                console.error("Error sending batch", error);
                await addMessage(new SystemMessage(`Error sending batch: ${error.message}`));
            }
        };

        return handleBatchUserOp;  
    }, [showNotification, batchedOperations, setBatchedOperations, sendUserOperations]);

    useEffect(() => {
        console.log("Batched operations:", batchedOperations);
    }, [batchedOperations]);

    return { addToBatch, batchedOperations, executeBatchOperations };
}
