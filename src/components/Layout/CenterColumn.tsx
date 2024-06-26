import { motion } from "framer-motion";
import ChatDisplay from "../ChatDisplay";
import { UserInput } from "../TextInputs/UserInput";
import Tips from "./Tips";
import WelcomeMessage from "./WelcomeMessage";
import { useState } from "react";
import { BaseMessage } from "@langchain/core/messages";
import { useGlobalContext } from "@/context/NewGlobalContext";

export default function CenterColumn({ isExpanded }) {
    const [chatHistory, setChatHistory] = useState<BaseMessage[]>([]);
    const { isConnected } = useGlobalContext();

    return (
        <motion.div
            className="flex flex-col justify-center items-center px-5 h-full"
            animate={{
                width: isExpanded ? "100%" : "75%",
                transformOrigin: "left",
            }}
            exit={{ opacity: 0, scaleX: 0, transformOrigin: "left" }}
        >
            {isConnected ? (
                <div className="flex flex-col items-center w-full h-full justify-end rounded-lg">
                    <div className="flex flex-col w-full h-full items-center justify-end overflow-y-hidden">
                        <ChatDisplay chatHistory={chatHistory} />
                        {/* Confirmation Box */}
                    </div>
                    <Tips />
                    <UserInput
                        onSubmit={() => {}}
                        showConfirmationBox={false}
                    />
                    <div className="h-[32px]"> </div>
                </div>
            ) : (
                <WelcomeMessage />
            )}
        </motion.div>
    );
}
