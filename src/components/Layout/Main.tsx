import React, { useEffect, useState } from "react";

import useWallet from "@/hooks/useWallet";

import LeftColumn from "./LeftColumn";
import CenterColumn from "./CenterColumn";
import RightColumn from "./RightColumn";
import { motion } from "framer-motion";
import Header from "./Header";

export default function Main() {
    const { isConnected } = useWallet();

    const [isExpanded, setIsExpanded] = useState(false);

    const [tokenAddress, setTokenAddress] = useState<string>(
        "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    );
    const [amount, setAmount] = useState<string>("1000000");
    const [recipient, setRecipient] = useState<string>(
        "0x141571912eC34F9bE50a6b8DC805e71Df70fAdAD",
    );

    // const { fetchActivities, fetchedData } = useRSS3Activities();

    useEffect(() => {
        setTokenAddress(tokenAddress);
        setAmount(amount);
        setRecipient(recipient);
    }, [tokenAddress, amount, recipient]);

    const [activeCategory, setActiveCategory] = useState("Portfolio");

    const toggleExpand = (category: string) => {
        setActiveCategory(category);
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex h-screen overflow-y-hidden">
            <LeftColumn
                isConnected={isConnected}
                isExpanded={isExpanded}
                toggleExpand={toggleExpand}
                activeCategory={activeCategory}
            />
            <motion.div
                className="flex flex-col h-full"
                animate={{
                    width: isExpanded ? "60%" : "80%",
                    transformOrigin: "left",
                }}
                exit={{ opacity: 0, scaleX: 0, transformOrigin: "left" }}
            >
                <Header isConnected={isConnected} />
                <motion.div className="flex flex-row h-full w-full">
                    <CenterColumn
                        isConnected={isConnected}
                        isExpanded={isExpanded}
                    />
                    <RightColumn isExpanded={isExpanded} />
                </motion.div>
                <div className="h-[32px] w-full" />
            </motion.div>
        </div>
    );
}
