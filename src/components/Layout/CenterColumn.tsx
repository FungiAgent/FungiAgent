import {
    useConfirmation,
    useMind,
    useTokensInfo,
    useToolRequestListener,
    useWallet,
} from "@/hooks";
import { motion } from "framer-motion";
import { ConfirmationManager } from "../ConfirmationManager/ConfirmationManager";
import ChatDisplay from "../ChatDisplay";
import { UserInput } from "../TextInputs/UserInput";
import Tips from "./Tips";
import WelcomeMessage from "./WelcomeMessage";
import { generateQueryFromPortfolio } from "@/utils/generateQueryFromPortfolio";
import { useEffect, useState } from "react";
import { useChatHistory } from "@/context/ChatHistoryContext";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";

export default function CenterColumn({ isExpanded, isConnected }) {
    const {
        confirmationDetails,
        setConfirmationDetails,
        isConfirmed,
        setIsConfirmed,
        showConfirmationBox,
        setShowConfirmationBox,
        confirmAction,
        rejectAction,
    } = useConfirmation();
    useToolRequestListener({
        setConfirmationDetails,
        setParams: null,
        setShowConfirmationBox,
    });
    const getCurrentDate = () => {
        return new Date().toISOString();
    };
    const { processChatMessage } = useMind();
    const { scAccount } = useWallet();
    const { tokens } = useTokensInfo();
    const [chatHistory, setChatHistory] = useState<BaseMessage[]>([]);
    const { getHistory } = useChatHistory();
    const updateChatHistory = async () => {
        const history: BaseMessage[] = await getHistory();
        setChatHistory(history);
    };
    useEffect(() => {
        updateChatHistory();
    }, [getHistory]);
    const handleQuerySubmit = async (query: string) => {
        if (tokens.length > 0 && query.trim() !== "") {
            const msg = new HumanMessage(query);
            setChatHistory([...chatHistory, ...[msg]]);
            const portfolioQuery = generateQueryFromPortfolio(tokens);
            const date = getCurrentDate();
            const portfolio = portfolioQuery;
            const scaAddress = scAccount;

            try {
                // Call Mind's processChatMessage and await its response
                await processChatMessage(query, date, portfolio, scaAddress);

                // Directly set the response as the agent's response
                updateChatHistory();
            } catch (error) {
                console.error("Error processing chat message:", error);
            }
        }
    };
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
                        {showConfirmationBox && (
                            <div className="pb-[32px]">
                                <ConfirmationManager
                                    confirmationDetails={confirmationDetails}
                                    confirmAction={confirmAction}
                                    isConfirmed={isConfirmed}
                                    setIsConfirmed={setIsConfirmed}
                                    rejectAction={rejectAction}
                                    showConfirmationBox={showConfirmationBox}
                                />
                            </div>
                        )}
                    </div>
                    {chatHistory.length === 0 && <Tips />}
                    <UserInput
                        onSubmit={handleQuerySubmit}
                        showConfirmationBox={showConfirmationBox}
                    />
                    <div className="h-[32px]"> </div>
                </div>
            ) : (
                <WelcomeMessage />
            )}
        </motion.div>
    );
}
