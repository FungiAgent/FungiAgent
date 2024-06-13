// React
import React, { createContext, useContext, useEffect, useState } from "react";

// Types
import { PortfolioContextType, ProviderProps } from "./types";
import { useTokensInfo } from "@/hooks";
import { TokenInfo } from "@/domain/tokens/types";
import { useGlobalContext } from "./FungiContextProvider";
const PortfolioContext = createContext<PortfolioContextType | undefined>(
    // @ts-expect-error
    {},
);

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
};

export function PortfolioProvider({ children }: ProviderProps) {
    const [portfolioData, setPortfolioData] = useState<TokenInfo[]>([]);
    const { scaAddress } = useGlobalContext();
    const { portfolioTokens, fetchPortfolioTokens } = useTokensInfo();

    const fetchPortfolioData = async () => {
        await fetchPortfolioTokens();
        setPortfolioData(portfolioTokens);
        return [];
    };

    useEffect(() => {
        fetchPortfolioData();
        console.log({ portfolioData });
    }, [scaAddress]);

    return (
        <PortfolioContext.Provider
            // @ts-expect-error
            value={{ portfolioData, fetchPortfolioData }}
        >
            {children}
        </PortfolioContext.Provider>
    );
}
