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
