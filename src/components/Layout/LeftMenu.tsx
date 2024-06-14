import { formatCurrency } from "@/helpers/formatCurrency";
import Image from "next/image";
import { motion } from "framer-motion";

const menuItems = [
    {
        title: "Portfolio",
        image: "/navbar/portfolio.svg",
        toggle: "Portfolio",
    },
    {
        title: "Hyphas",
        image: "/navbar/hyphas.svg",
        toggle: "Hyphas",
        disabled: true,
    },
    {
        title: "Discover",
        image: "/navbar/discover.svg",
        toggle: "Discover",
        disabled: true,
    },
    {
        title: "History",
        image: "/navbar/history.svg",
        toggle: "History",
    },
    {
        title: "Chats",
        image: "/navbar/chats.svg",
        toggle: "chats",
        disabled: true,
    },
];

export default function LeftMenu({ totalBalance, totalCash, toggleExpand }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start"
        >
            <div className="px-4">
                <p className="font-light mb-1">My Balance</p>
                <p className="mb-4 text-xl">{formatCurrency(totalBalance)}</p>
                <p className="font-light mb-1">My Cash</p>
                <p className="mb-4 text-xl">{formatCurrency(totalCash)}</p>
            </div>
            <div className="mt-10">
                {menuItems.map((item, index) => {
                    return (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                toggleExpand(item.toggle);
                            }}
                            disabled={item.disabled}
                            className="flex flex-row px-4 py-2 justify-center items-center my-2 hover:opacity-70"
                        >
                            <div className="p-[10px]">
                                <Image
                                    src={item.image}
                                    alt="portfolio"
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <p
                                className={` ${item.disabled ? "text-gray-400" : ""}`}
                            >
                                {item.title}
                            </p>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
