import React, { FC } from "react";
import LightSpotTable from "@/components/Tables/LightSpotTable";
import TransactionHistoryTable from "@/components/Tables/TransactionHistoryTable";
import Image from "next/image";
import { motion } from "framer-motion";

type SideModalProps = {
    isOpen: boolean;
    onClose: () => void;
    balance: string;
    cash: string;
    activeCategory: string;
};

const SideModal: FC<SideModalProps> = ({
    isOpen,
    onClose,
    balance,
    cash,
    activeCategory,
}) => {
    if (!isOpen) return null;

    const categoryContent = () => {
        switch (activeCategory) {
            case "Portfolio":
                return <LightSpotTable />;
            case "History":
                return <TransactionHistoryTable />;
            default:
                return (
                    <div className="text-center mt-10">
                        This feature is coming soon.
                    </div>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 w-full"
        >
            <div className=" flex justify-center items-center">
                <div className="flex flex-col px-10">
                    <p className="font-light text-center">My Balance</p>
                    <p className="text-xl font-semibold text-center">
                        {balance}
                    </p>
                </div>
                <div className="flex flex-col px-10">
                    <p className="font-light text-center">My Cash</p>
                    <p className="text-xl font-semibold text-center">{cash}</p>
                </div>
            </div>
            <div className="overflow-y-auto">{categoryContent()}</div>
        </motion.div>
    );
};

export default SideModal;
