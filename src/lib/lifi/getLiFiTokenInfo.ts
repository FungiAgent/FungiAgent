import axios from "axios";
import { TokenInfo } from "@/domain/tokens/types";

/**
 * Retrieves the list of tokens supported by LifI on the specified chain.
 *
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
    return result.data;
};
