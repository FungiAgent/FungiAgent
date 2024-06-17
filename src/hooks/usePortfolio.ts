import { useEffect, useState, useCallback } from "react";
import { useGlobalContext } from "@/context/FungiContextProvider";
// import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { TokenData } from "@/domain/tokens/types";
import { getAllTokensWithBalances } from "@/domain/tokens/useInfoTokens";
import useWallet from "@/hooks/useWallet";
import { getTokenMarketData } from "@/domain/tokens/useMarketData";

/**
 * Custom React hook that retrieves information for all tokens supported by LifI and fills in the balance for tokens owned by the provided `scAccount`.
 *
 * This hook fetches token information including balance for the specified `scAccount` on the specified `chainId` using the provided `alchemyClient`.
 *
 * @returns {TokenInfo[]} tokens - An array of TokenInfo objects representing the supported tokens and their balances for the `scAccount`.
 */
export function usePortfolio() {
    const { chainId, scAccount } = useWallet();
    const { alchemyClient } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState<TokenData[] | []>([]);
    const fetchPortfolio = async () => {
        setIsLoading(true);
        console.log("fetching portfolio...");
        if (alchemyClient && chainId && scAccount) {
            const tokensInfo = await getAllTokensWithBalances(
                alchemyClient,
                chainId,
                scAccount,
                // "0x9c91AFF7d082C253F736854cBEC4c267C47bc098"
            );
            if (!tokensInfo) {
                return;
            }
            const tokensWithBalance = tokensInfo.filter((tokenData: any) => {
                return (
                    (Number(tokenData.balance) /
                        10 ** Number(tokenData.decimals)) *
                        Number(tokenData.priceUSD) >
                    1
                );
            });
            const tokensData = await getTokenMarketData(
                chainId,
                tokensWithBalance,
            );
            console.log({ tokensData });
            setPortfolioData(tokensData);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    return { portfolioData, fetchPortfolio, isLoading };
}
