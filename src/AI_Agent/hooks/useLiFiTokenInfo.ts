import axios from "axios";
import { TokenInfo } from "@/domain/tokens/types";
// import { getChainIdLifi } from "./getChainIdLifi";
import { useChatHistory } from "@/AI_Agent/Context/ChatHistoryContext";
import { SystemMessage } from '@langchain/core/messages';

/**
 * Retrieves the list of tokens supported by LifI on the specified chain.
 * 
 * @param {number} chainId - The identifier of the blockchain chain.
 * @returns {Promise<TokenInfo>} A Promise that resolves to an array of TokenInfo objects representing the supported tokens.
 */
export const useLiFiTokenInfo = async (chain: string, token: string): Promise<TokenInfo> => {
    const { addMessage } = useChatHistory();
    const result = await axios.get('https://li.quest/v1/token', {
        params: {
            chain,
            token,
        }
    });
    console.log(`Retrieved token info for ${chain} ${token}: ${JSON.stringify(result.data)}`);
    await addMessage(new SystemMessage(`Retrieved token info for ${chain} ${token}: ${JSON.stringify(result.data)}`));
    return result.data;
 
 };