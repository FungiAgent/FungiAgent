import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

type ProfileSelectionButtonProps = {
    image: string;
    status: boolean;
    title: string;
    onClick: () => Promise<void> | (() => void);
};

export default function ProfileSelectionButton({
    image,
    status,
    title,
    onClick,
}: ProfileSelectionButtonProps) {
    return (
        <button
            className={`${
                status ? "opacity-100" : "opacity-30 cursor-auto"
            } flex flex-col items-center justify-center  `}
            onClick={onClick}
        >
            <motion.div
                whileHover={{ y: -5 }} // Change this value to adjust the float effect
            >
                <div className="p-1.5 rounded-full ">
                    <Image src={image} alt="Copy Icon" width={40} height={40} />
                    {/* <img src={image} className="min-w-[48px] p-1 max-w-[100px]" /> */}
                </div>
            </motion.div>
            <p className="text-sm mt-[9px]">{title}</p>
        </button>
    );
}
