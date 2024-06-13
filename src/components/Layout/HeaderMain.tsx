import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../public/profile/Logo.svg";
import User from "../../../public/profile/User.svg";

import useWallet from "@/hooks/useWallet";
import ProfileModal from "../Modals/ProfileModal";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import LoginButton from "../Buttons/LoginButton";
import { networks } from "../../../constants/Constants";
import { motion } from "framer-motion";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { generateQueryFromPortfolio } from "@/utils/generateQueryFromPortfolio";
import {
    useConfirmation,
    useMind,
    useTokensInfo,
    useToolRequestListener,
} from "@/hooks";
import useScAccountPositions from "@/domain/position/useScAccountPositions";
import useScAccountSpotPosition from "@/domain/position/useScAccountSpotPosition";
import { TokenInfo } from "@/domain/tokens/types";
import { useChatHistory } from "@/context/ChatHistoryContext";
import ChatDisplay from "../ChatDisplay";
import { ConfirmationManager } from "../ConfirmationManager/ConfirmationManager";
import { UserInput } from "../TextInputs/UserInput";
import SideModal from "../Modals/SideModal";
import LeftSideBar from "./LeftSideBar";
import { formatCurrency } from "@/helpers/formatCurrency";
import WelcomeMessage from "./WelcomeMessage";
import Tips from "./Tips";

export default function HeaderMain() {
    const { isConnected } = useWallet();
    const [openMenu, setOpenMenu] = useState(false);

    const getOpenModal = (status: boolean) => {
        setOpenMenu(status);
    };

    const [isExpanded, setIsExpanded] = useState(false);

    const { processChatMessage } = useMind();
    const { getHistory } = useChatHistory();
    const [chatHistory, setChatHistory] = useState<BaseMessage[]>([]);
    const [tokenAddress, setTokenAddress] = useState<string>(
        "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    );
    const [amount, setAmount] = useState<string>("1000000");
    const [recipient, setRecipient] = useState<string>(
        "0x141571912eC34F9bE50a6b8DC805e71Df70fAdAD",
    );
    const { tokens } = useTokensInfo();
    const [query, setQuery] = useState<string>("");
    const [agentResponse, setAgentResponse] = useState<string>("");
    const { totalBalance } = useScAccountPositions();
    const { totalCash } = useScAccountSpotPosition();
    const [length, setLength] = useState(tokens.length);
    const [tokenFrom, setTokenFrom] = useState<TokenInfo | undefined>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [forceTableReload, setForceTableReload] = useState(false);
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    // const { fetchActivities, fetchedData } = useRSS3Activities();
    const { scAccount } = useWallet();
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
                const response = await processChatMessage(
                    query,
                    date,
                    portfolio,
                    scaAddress,
                );

                // Directly set the response as the agent's response
                setAgentResponse(response);
                updateChatHistory();
            } catch (error) {
                console.error("Error processing chat message:", error);
            }

            setQuery(""); // Clear the text input box after processing
            setIsInputEmpty(true); // Reset input validation state
        }
    };

    useEffect(() => {
        setTokenAddress(tokenAddress);
        setAmount(amount);
        setRecipient(recipient);
    }, [tokenAddress, amount, recipient]);

    const updateChatHistory = async () => {
        const history: BaseMessage[] = await getHistory();
        setChatHistory(history);
    };
    useEffect(() => {
        updateChatHistory();
    }, [getHistory]);

    const getLength = (length: number) => {
        setLength(length);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const ITEMS_PER_PAGE = 6;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, length);

    const [localIsModalOpen, setLocalIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Portfolio");

    const toggleModal = (category) => {
        setActiveCategory(category);
    };

    const toggleExpand = (category: string) => {
        setActiveCategory(category);
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex h-screen overflow-y-hidden">
            {/* Left */}
            <motion.div
                className="flex justify-start flex-col items-center overflow-y-scroll"
                animate={{ width: isExpanded ? "40%" : "20%" }}
                transition={{ duration: 0.5 }}
            >
                <Image
                    width={62}
                    height={68}
                    alt="Logo"
                    src={Logo.src}
                    aria-hidden="true"
                    className="pt-10 pb-10"
                />
                {isConnected && (
                    <div className="flex w-full justify-between items-center text-lg font-semibold mb-4">
                        {isExpanded ? (
                            <SideModal
                                isOpen={true}
                                onClose={() => toggleExpand(activeCategory)}
                                // @ts-expect-error
                                balance={formatCurrency(totalBalance)}
                                // @ts-expect-error
                                cash={formatCurrency(totalCash)}
                                tokens={tokens}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                // @ts-expect-error
                                getLength={getLength}
                                handlePageChange={handlePageChange}
                                // @ts-expect-error
                                forceTableReload={forceTableReload}
                                currentPage={currentPage}
                                ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                                length={length}
                                setTokenFrom={setTokenFrom}
                                onModalToggle={() => {}}
                                activeCategory={activeCategory}
                            />
                        ) : (
                            <LeftSideBar
                                toggleExpand={toggleExpand}
                                totalBalance={totalBalance}
                                totalCash={totalCash}
                            />
                        )}
                    </div>
                )}
            </motion.div>
            {/* Center */}
            <motion.div
                className="flex justify-center items-center"
                animate={{
                    width: isExpanded ? "60%" : "60%",
                    // marginLeft: isExpanded ? "0%" : "10%",
                }}
                transition={{ duration: 0.5 }}
            >
                {isConnected ? (
                    <div className="flex flex-col items-center justify-end pb-0 p-4 rounded-lg ">
                        <ChatDisplay chatHistory={chatHistory} />
                        <ConfirmationManager
                            confirmationDetails={confirmationDetails}
                            confirmAction={confirmAction}
                            isConfirmed={isConfirmed}
                            setIsConfirmed={setIsConfirmed}
                            rejectAction={rejectAction}
                            showConfirmationBox={showConfirmationBox}
                        />
                        {chatHistory.length === 0 && <Tips />}
                        <UserInput onSubmit={handleQuerySubmit} />
                    </div>
                ) : (
                    <WelcomeMessage />
                )}
            </motion.div>
            {/* Right */}
            {!isExpanded && (
                <div
                    className="flex flex-col justify-start items-center"
                    style={{ width: isExpanded ? "0%" : "20%" }}
                >
                    {isConnected ? (
                        <div className="flex flex-row items-center pt-10">
                            <ChangeNetworkDropdown networks={networks} />
                            <button onClick={() => setOpenMenu(true)}>
                                <Image
                                    width={48}
                                    height={48}
                                    alt="User"
                                    src={User.src}
                                />
                            </button>
                            {openMenu && (
                                <ProfileModal getOpenModal={getOpenModal} />
                            )}
                        </div>
                    ) : (
                        <div className="pt-10">
                            <LoginButton />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
