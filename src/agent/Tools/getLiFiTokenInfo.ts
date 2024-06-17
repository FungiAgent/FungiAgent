import axios from "axios";
import { TokenInfo } from "@/domain/tokens/types";
// import { getChainIdLifi } from "./getChainIdLifi";

/**
 * Retrieves the list of tokens supported by LifI on the specified chain.
 *
 * @param {number} chainId - The identifier of the blockchain chain.
 * @returns {Promise<TokenInfo>} A Promise that resolves to an array of TokenInfo objects representing the supported tokens.
 */
export const getTokenInfo = async (
    chain: string,
    token: string,
): Promise<TokenInfo> => {
    const result = await axios.get("https://li.quest/v1/token", {
        params: {
            chain,
            token,
        },
    });
    console.log({ data: result.data });
    return result.data;
};
