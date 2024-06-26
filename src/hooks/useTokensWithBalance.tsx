import { useGlobalContext } from "@/context/FungiContextProvider";
import { TokenInfo } from "@/domain/tokens/types";
import { getAllTokensWithBalances } from "@/domain/tokens/useInfoTokens";
import useWallet from "@/hooks/useWallet";
import { useEffect, useState } from "react";

export function useTokensWithBalance() {
    const { chainId, scAccount } = useWallet();
    const { alchemyClient } = useGlobalContext();
    const [tokensWithBalance, setTokensWithBalance] = useState<TokenInfo[]>([]);

    useEffect(() => {
        const fetchTokens = async () => {
            if (alchemyClient && chainId && scAccount) {
                const tokensInfo = await getAllTokensWithBalances(
                    alchemyClient,
                    chainId,
                    scAccount,
                );

                if (!tokensInfo) {
                    return;
                }

                const tokensWithBalance = tokensInfo.filter(
                    (tokenData: any) => {
                        return (
                            (Number(tokenData.balance) /
                                10 ** Number(tokenData.decimals)) *
                                Number(tokenData.priceUSD) >
                            1
                        );
                    },
                );

                setTokensWithBalance(tokensWithBalance);
            }
        };

        fetchTokens();
    }, [alchemyClient, chainId, scAccount]);

    return { tokensWithBalance };
}
