import React, { useEffect, useState } from "react";
import LightSpotTableCard from "../Cards/TableCards/LightSpotTableCard";
import Loader from "../Loader/SpinnerLoader";
import StartDepositBanner from "../Sections/Fallbacks/StartDepositBanner";
import SpotTableCardFallback from "../Cards/Fallbacks/SpotTableCardFallback";
import { TokenData, TokenInfo } from "@/domain/tokens/types";
import { useTokenMarketData } from "@/hooks/useTokenMarketData";
import { useTokensInfo } from "@/hooks/useTokensInfo";
import { CHAIN_ID } from "@/utils/gmx/config/chains";

type SpotTableProps = {
  startIndex: number;
  endIndex: number;
  getLength: (length: number) => void;
  handlePageChange: (page: number) => void;
  setTokenFrom: (token: TokenInfo) => void;
  forceReload: boolean;
  handleReloadTable: () => void; // Add handleReloadTable prop
};

export default function LightSpotTable({
  startIndex,
  endIndex,
  getLength,
  handlePageChange,
  setTokenFrom,
  forceReload,
  handleReloadTable, // Destructure handleReloadTable prop
}: SpotTableProps) {
  const { tokens, fetchTokens } = useTokensInfo();
  const [typeMember, setTypeMember] = useState<string>("Portfolio");
  const [loading, setLoading] = useState(false);
  const { tokenMarketsData, fetchData, isLoading } = useTokenMarketData([]);
  const [portfolioEmpty, setPortfolioEmpty] = useState(false);

  const checkTokens = () => {
    if (tokens && typeMember === "All") {
      fetchTokens();
      setLoading(true);
      setPortfolioEmpty(false);
      fetchData(tokens.slice(startIndex, endIndex));
      getLength(tokens.length);
    } else if (tokens && typeMember === "Portfolio") {
      setLoading(true);

      const tokensWithBalance = tokens.filter((tokenData: any) => {
        return (
          (Number(tokenData.balance) / 10 ** Number(tokenData.decimals)) *
            Number(tokenData.priceUSD) >
          1
        );
      });
      console.log("Tokens with balance: ", tokensWithBalance);

      if (tokensWithBalance.length !== 0) {
        setPortfolioEmpty(false);
        fetchData(tokensWithBalance.slice(startIndex, endIndex));
      } else {
        setPortfolioEmpty(true);
      }
      getLength(tokensWithBalance.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkTokens();
  }, [tokens, forceReload]); // Listen for changes in forceReload

  useEffect(() => {
    handlePageChange(1);
  }, [typeMember]);

  useEffect(() => {
    checkTokens();
  }, [startIndex, endIndex]);

  return (
    <div className="mt-[20px] w-full h-[574px] pt-[24px] bg-white rounded-lg">
      <div className="grid grid-cols-6 pb-[26px] text-xl font-medium border-b-1 border-gray-300 items-center">
        <div className="text-center col-span-2">Token</div>{" "}
        <div className="text-center">Price</div>{" "}
        <div className="text-center">Balance</div>{" "}
        <button className="ml-3" onClick={fetchTokens}>
          <img src="/Reload.svg" alt="Reload Icon" className="w-4 h-4 mr-2" />
        </button>
      </div>
      
      {loading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="overflow-auto h-[50vh]">
          {portfolioEmpty ? (
            <StartDepositBanner />
          ) : (
            <>
              {!isLoading ? (
                <>
                  {tokenMarketsData &&
                    tokenMarketsData.length > 0 &&
                    tokenMarketsData.map((token: TokenData, index: number) => (
                      <LightSpotTableCard
                        setTokenFrom={setTokenFrom}
                        asset={token}
                        key={token.token.coinKey}
                        index={index}
                      />
                    ))}
                </>
              ) : (
                <div>
                  {[1, 2, 3, 4, 5].map((index: number) => {
                    return <SpotTableCardFallback key={index} />;
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}