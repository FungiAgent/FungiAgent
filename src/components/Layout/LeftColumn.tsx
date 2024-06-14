import { formatCurrency } from "@/helpers/formatCurrency";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Logo from "../../../public/profile/Logo.svg";
import SideModal from "../Modals/SideModal";
import LeftMenu from "./LeftMenu";
import useScAccountPositions from "@/domain/position/useScAccountPositions";
import useScAccountSpotPosition from "@/domain/position/useScAccountSpotPosition";

export default function LeftColumn({
    isConnected,
    isExpanded,
    toggleExpand,
    activeCategory,
}) {
    const { totalBalance } = useScAccountPositions();
    const { totalCash } = useScAccountSpotPosition();
    return (
        <motion.div
            className="flex  flex-col items-center justify-start h-full overflow-y-scroll "
            animate={{ width: isExpanded ? "40%" : "20%" }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-row w-full justify-between items-center">
                <div className="h-[100px] p-5">
                    <Image
                        width={60}
                        height={60}
                        alt="Logo"
                        src="/Logo.svg"
                        aria-hidden="true"
                    />
                </div>
                <div>
                    {isExpanded && (
                        <div className="flex flex-row justify-end mr-10">
                            <button onClick={toggleExpand}>
                                <Image
                                    src="/navbar/CloseSideBar.svg"
                                    alt="Close"
                                    width={12}
                                    height={12}
                                />
                            </button>
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
                                // @ts-expect-error
                                balance={formatCurrency(totalBalance)}
                                // @ts-expect-error
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
