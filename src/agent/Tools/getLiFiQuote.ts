// getLiFiQuote.ts
import axios from "axios";

/**
 * Retrieves a quote from the LiFi API for a specific token transfer or swap.
 *
 */
export const getLiFiQuote = async (
    fromChain: string,
    toChain: string,
    fromToken: string,
    toToken: string,
    fromAmount: string,
    fromAddress: string,
    slippage: string,
): Promise<object> => {
    try {
        const response = await axios.get("https://li.quest/v1/quote", {
            params: {
                fromChain,
                toChain,
                fromToken,
                toToken,
                fromAmount,
                fromAddress,
                slippage,
            },
        });

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
};
