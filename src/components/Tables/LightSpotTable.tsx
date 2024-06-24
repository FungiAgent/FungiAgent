import React, { useEffect, useState } from "react";
import LightSpotTableCard from "../Cards/TableCards/LightSpotTableCard";
import Loader from "../Loader/SpinnerLoader";
import StartDepositBanner from "../Sections/Fallbacks/StartDepositBanner";
import SpotTableCardFallback from "../Cards/Fallbacks/SpotTableCardFallback";
import { usePortfolio } from "@/hooks/usePortfolio";
import { motion } from "framer-motion";

export default function LightSpotTable() {
    const { isLoading, fetchPortfolio, portfolioData } = usePortfolio();

    const [selectedOption, setSelectedOption] = useState("tokens");
    useEffect(() => {
        fetchPortfolio();
    }, []);
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
            <div className="grid grid-cols-6 gap-1 py-[32px] items-center">
                {portfolioOptions.map((i, idx) => {
                    return (
                        <motion.div whileHover={{ y: -4 }} key={idx}>
                            <button
                                className={`col-span-1 text-center text-sm ${i.id === selectedOption ? "font-semibold" : "font-extralight"} ${i.disabled && "cursor-not-allowed"} `}
                                disabled={i.disabled}
                                onClick={() => setSelectedOption(i.id)}
                            >
                                {i.title}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-3 pb-[26px] text-xl font-medium   items-center">
                <div className="col-span-1 text-center font-light">Token</div>
                <div className="col-span-1 text-center font-light">Price</div>
                <div className="col-span-1 text-center font-light">Balance</div>
            </div>

            {isLoading ? (
                <div className="w-full flex items-center justify-center">
                    <Loader />
                </div>
            ) : (
                <div className="overflow-auto ">
                    {portfolioData.length === 0 ? (
                        <StartDepositBanner />
                    ) : (
                        <>
                            {!isLoading ? (
                                portfolioData.map((token, index) => (
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
