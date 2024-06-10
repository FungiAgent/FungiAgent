import axios from "axios";
import { useEffect, useState } from "react";
import { TokenInfo } from "@/domain/tokens/types";

interface LiFiToken {
    address: string;
    decimals: number;
    symbol: string;
    chainId: number;
    coinKey: string;
    name: string;
    logoURI: string;
    priceUSD: string;
}

export const useLiFiTokenInfo = () => {
    const [tokens, setTokens] = useState<LiFiToken[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.get("https://li.quest/v1/tokens", {
                    params: {
                        chains: "42161", // Arbitrum chainId
                        chainTypes: "EVM",
                    },
                });
                console.log("Response data:", response.data); // Debug log to check response structure
                if (
                    response.data &&
                    response.data.tokens &&
                    Array.isArray(response.data.tokens["42161"])
                ) {
                    setTokens(response.data.tokens["42161"]);
                } else {
                    setError("Invalid response structure");
                }
            } catch (err) {
                console.error("Error fetching tokens:", err); // Debug log to check error
                setError("Failed to load tokens");
            } finally {
                setLoading(false);
            }
        };

        fetchTokens();
    }, []);

    return { tokens, loading, error };
};
