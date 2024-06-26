import portfolioApi from "@/api/feeds";
import { useGlobalContext } from "@/context/NewGlobalContext";
import { use, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import BlockLoader from "../Loader/BlockLoader";

export type PortfolioObj = {
    id: string;
    chain: string;
    name: string;
    symbol: string;
    display_symbol: null;
    optimized_symbol: string;
    decimals: number;
    logo_url: string;
    protocol_id: string;
    price: number;
    price_24h_change: number;
    is_verified: boolean;
    is_core: boolean;
    is_wallet: boolean;
    time_at: number;
    amount: number;
    raw_amount: number;
    raw_amount_hex_str: string;
    chainInfo: {
        id: string;
        community_id: number;
        name: string;
        native_token_id: string;
        logo_url: string;
        wrapped_token_id: string;
        is_support_pre_exec: boolean;
    };
};

export default function PortfolioFeed() {
    const { accountAddress } = useGlobalContext();
    function formatNumber(input: string) {
        return input.slice(0, 6);
    }
    const getPortfolio = async (): Promise<PortfolioObj[]> => {
        const { data, ok } = await portfolioApi.getPortfolio({
            account: accountAddress,
        });
        if (ok) {
            // @ts-expect-error
            return data;
        }
        return [];
    };

    const { data, error, isLoading } = useQuery("portfolio", getPortfolio);
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
    if (isLoading) return <BlockLoader />;
    if (error) return <div>Error</div>;
    if (data) {
        return (
            <div className="flex flex-col w-full  rounded-lg items-center">
                <div className="grid grid-cols-6 gap-1 py-[32px] items-center w-full">
                    {portfolioOptions.map((i, idx) => {
                        return (
                            <motion.div
                                whileHover={{ y: -4 }}
                                key={idx}
                                className="flex justify-center"
                            >
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

                <div className="grid grid-cols-3 pb-[26px] text-xl font-medium   items-center w-full">
                    <div className="col-span-1 text-center font-light">
                        Token
                    </div>
                    <div className="col-span-1 text-center font-light">
                        Price
                    </div>
                    <div className="col-span-1 text-center font-light">
                        Balance
                    </div>
                </div>
                <div className="flex flex-col gap-10 w-full p-4">
                    {data.map(function (item, index) {
                        return (
                            <motion.div
                                whileHover={{ x: 4 }}
                                key={index}
                                className="flex flex-row justify-between "
                            >
                                <div className="flex items-center justify-start">
                                    <div className="relative flex justify-center items-center mr-2">
                                        <Image
                                            src={item.logo_url}
                                            alt="token symbol"
                                            width={50}
                                            height={50}
                                            className="mr-3"
                                        />
                                        <div className=" ml-3 absolute bottom-0 right-0 border-white ">
                                            <Image
                                                src={item.chainInfo.logo_url}
                                                alt="token symbol"
                                                width={30}
                                                height={30}
                                            />
                                        </div>
                                    </div>
                                    <p>{item.symbol}</p>
                                </div>
                                {/* price */}
                                <div className="flex items-center justify-center">
                                    <p className="text-right">
                                        {formatNumber(item.price.toString())}
                                    </p>
                                </div>
                                {/* balance */}
                                <div className="flex items-center justify-center">
                                    <p className="text-right">
                                        {formatNumber(item.amount.toString())}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
