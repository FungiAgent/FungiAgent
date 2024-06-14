import React, { useEffect, useState } from "react";
import LightSpotTableCard from "../Cards/TableCards/LightSpotTableCard";
import Loader from "../Loader/SpinnerLoader";
import StartDepositBanner from "../Sections/Fallbacks/StartDepositBanner";
import SpotTableCardFallback from "../Cards/Fallbacks/SpotTableCardFallback";
import { useTokenMarketData } from "@/hooks/useTokenMarketData";
import { useTokensInfo } from "@/hooks/useTokensInfo";

export default function LightSpotTable({ forceReload }) {
    const { tokens, fetchTokens } = useTokensInfo();
    const [loading, setLoading] = useState(false);
    const { tokenMarketsData, fetchData, isLoading } = useTokenMarketData([]);
    const [portfolioEmpty, setPortfolioEmpty] = useState(false);
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [length, setLength] = useState(tokens.length);

    const getLength = (length: number) => {
        setLength(length);
    };
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, length);
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const checkTokens = () => {
        if (tokens) {
            setLoading(true);

            const tokensWithBalance = tokens.filter((tokenData: any) => {
                return (
                    (Number(tokenData.balance) /
                        10 ** Number(tokenData.decimals)) *
                        Number(tokenData.priceUSD) >
                    1
                );
            });

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
    }, []);

    useEffect(() => {
        checkTokens();
    }, [startIndex, endIndex]);

    useEffect(() => {
        if (forceReload) {
            fetchTokens(); // Assuming this method fetches fresh data
            setLoading(true);
        }
    }, [forceReload]);
    const [selectedOption, setSelectedOption] = useState("tokens");

    const portfolioOptions = [
        {
            title: "Tokens",
            id: "tokens",
        },
        {
            title: "Hyphas",
            id: "hyphas",
            disabled: true,
        },
        {
            title: "Trades",
            id: "trades",
            disabled: true,
        },
        {
            title: "Pools",
            id: "pools",
            disabled: true,
        },
        {
            title: "Credit",
            id: "credit",
            disabled: true,
        },
        {
            title: "NFTs",
            id: "nfts",
            disabled: true,
        },
    ];

    return (
        <div className="w-full  rounded-lg">
            {/* <button className="col-span-1 justify-self-center" onClick={handleReloadTable}>
          <img src="/Reload.svg" alt="Reload Icon" className="w-4 h-4" />
      </button> */}
            <div className="grid grid-cols-6 gap-1 py-[32px] items-center">
                {portfolioOptions.map((i, idx) => {
                    return (
                        <button
                            key={idx}
                            className={`col-span-1 text-center text-sm ${i.id === selectedOption ? "font-semibold" : "font-extralight"} `}
                            disabled={i.disabled}
                        >
                            {i.title}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-3 pb-[26px] text-xl font-medium   items-center">
                <div className="col-span-1 text-center font-light">Token</div>
                <div className="col-span-1 text-center font-light">Price</div>
                <div className="col-span-1 text-center font-light">Balance</div>
            </div>

            {loading ? (
                <div className="w-full flex items-center justify-center">
                    <Loader />
                </div>
            ) : (
                <div className="overflow-auto ">
                    {portfolioEmpty && !isLoading ? (
                        <StartDepositBanner />
                    ) : (
                        <>
                            {!isLoading ? (
                                tokenMarketsData.map((token, index) => (
                                    <LightSpotTableCard
                                        asset={token}
                                        key={token.token.coinKey}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div>
                                    {[1, 2, 3, 4].map((index) => (
                                        <SpotTableCardFallback key={index} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
