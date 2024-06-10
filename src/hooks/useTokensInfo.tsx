import { useEffect, useState, useCallback } from "react";
import { useGlobalContext } from "@/context/FungiContextProvider";
// import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { TokenInfo } from "@/domain/tokens/types";
import { getAllTokensWithBalances } from "@/domain/tokens/useInfoTokens";
import useWallet from "@/hooks/useWallet";

/**
 * Custom React hook that retrieves information for all tokens supported by LifI and fills in the balance for tokens owned by the provided `scAccount`.
 *
 * This hook fetches token information including balance for the specified `scAccount` on the specified `chainId` using the provided `alchemyClient`.
 *
 * @returns {TokenInfo[]} tokens - An array of TokenInfo objects representing the supported tokens and their balances for the `scAccount`.
 */
export function useTokensInfo() {
	const { chainId, scAccount } = useWallet();
	const { alchemyClient } = useGlobalContext();
	const [tokens, setTokens] = useState<TokenInfo[] | []>([]);

	const fetchTokens = useCallback(async () => {
		if (alchemyClient && chainId && scAccount) {
			const tokensInfo = await getAllTokensWithBalances(
				alchemyClient,
				chainId,
				scAccount
				// "0x9c91AFF7d082C253F736854cBEC4c267C47bc098"
			);
			if (!tokensInfo) {
				return;
			}
			setTokens(tokensInfo);
		}
	}, [alchemyClient, chainId, scAccount]);

	useEffect(() => {
		fetchTokens();
	}, [alchemyClient, fetchTokens]);

	return { tokens, fetchTokens };
}
