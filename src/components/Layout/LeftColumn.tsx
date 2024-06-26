import { formatCurrency } from "@/helpers/formatCurrency";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import SideModal from "../Modals/SideModal";
import LeftMenu from "./LeftMenu";
import { useGlobalContext } from "@/context/NewGlobalContext";

export default function LeftColumn({
    isExpanded,
    toggleExpand,
    activeCategory,
}) {
    const totalCash = 0;
    const totalBalance = 0;
    const { isConnected } = useGlobalContext();
    return (
        <motion.div
            className="flex  flex-col items-center justify-start h-full overflow-y-scroll "
            animate={{ width: isExpanded ? "40%" : "20%" }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-row w-full justify-between items-center z-10">
                <div className="h-[100px] p-5">
                    <motion.div
                        whileHover={{ y: -5 }} // Change this value to adjust the float effect
                    >
                        <a target="_blank" href="https://fungi.ag">
                            <Image
                                width={60}
                                height={60}
                                alt="Logo"
                                src="/Logo.svg"
                                aria-hidden="true"
                            />
                        </a>
                    </motion.div>
                </div>
                <div>
                    {isExpanded && (
                        <div className="flex flex-row justify-end mr-10 ">
                            <motion.div whileHover={{ y: -5 }}>
                                <button onClick={toggleExpand} className="p-2">
                                    <Image
                                        src="/navbar/CloseSideBar.svg"
                                        alt="Close"
                                        width={12}
                                        height={12}
                                    />
                                </button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            {isConnected && (
                <div className="flex w-full justify-between items-center text-lg font-semibold mb-4 mt-[70px]">
                    <AnimatePresence mode="wait">
                        {isExpanded ? (
                            <SideModal
                                isOpen={true}
                                onClose={() => toggleExpand(activeCategory)}
                                balance={formatCurrency(totalBalance)}
                                cash={formatCurrency(totalCash)}
                                activeCategory={activeCategory}
                            />
                        ) : (
                            <LeftMenu
                                toggleExpand={toggleExpand}
                                totalBalance={totalBalance}
                                totalCash={totalCash}
                            />
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}
