import { formatCurrency } from "@/helpers/formatCurrency";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LeftSideBar({ totalBalance, totalCash, toggleExpand }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start"
        >
            <div className="px-4">
                <p className="font-light mb-1">My Balance</p>
                <p className="mb-2 text-xl">{formatCurrency(totalBalance)}</p>
                <p className="font-light mb-2">My Cash</p>
                <p className="mb-1 text-xl">{formatCurrency(totalCash)}</p>
            </div>
            <div className="mt-10">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleExpand("Portfolio");
                    }}
                    className="flex flex-row px-4 py-2 justify-center items-center my-2 hover:opacity-70"
                >
                    <Image
                        src="/navbar/portfolio.svg"
                        alt="portfolio"
                        width={20}
                        height={20}
                    />
                    <p className="ml-2">Portfolio</p>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleExpand("History");
                    }}
                    className="flex flex-row px-4 py-2 justify-center items-center my-2 hover:opacity-70"
                >
                    <Image
                        src="/navbar/history.svg"
                        alt="history"
                        width={20}
                        height={20}
                    />
                    <p className="ml-2">History</p>
                </button>
            </div>
        </motion.div>
    );
}
