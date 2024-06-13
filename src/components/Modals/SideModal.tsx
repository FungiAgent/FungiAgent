import React, { FC } from "react";
import LightSpotTable from "@/components/Tables/LightSpotTable";
import TransactionHistoryTable from "@/components/Tables/TransactionHistoryTable";
import Image from "next/image";

type SideModalProps = {
    isOpen: boolean;
    onClose: () => void;
    balance: string;
    cash: string;
    tokens: any[];
    startIndex: number;
    endIndex: number;
    getLength: () => number;
    handlePageChange: (page: number) => void;
    forceTableReload: () => void;
    currentPage: number;
    ITEMS_PER_PAGE: number;
    length: number;
    setTokenFrom: (token: any) => void;
    onModalToggle: (isOpen: boolean) => void;
    activeCategory: string;
    children: React.ReactNode;
};

const SideModal: FC<SideModalProps> = ({
    isOpen,
    onClose,
    balance,
    cash,
    tokens,
    startIndex,
    endIndex,
    getLength,
    handlePageChange,
    forceTableReload,
    currentPage,
    ITEMS_PER_PAGE,
    length,
    setTokenFrom,
    onModalToggle,
    activeCategory,
    children,
}) => {
    if (!isOpen) return null;

    const categoryContent = () => {
        switch (activeCategory) {
            case "Portfolio":
                return (
                    <LightSpotTable
                        startIndex={startIndex}
                        endIndex={endIndex}
                        getLength={getLength}
                        handlePageChange={handlePageChange}
                        setTokenFrom={setTokenFrom}
                        forceReload={true} // Simplified for demonstration
                        handleReloadTable={forceTableReload}
                    />
                );
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

    const modalStyle = {
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        width: "585px",
        height: "100%",
        position: "fixed",
        top: "0",
        left: "0",
        backgroundColor: "white",
        zIndex: 50,
        transition: "transform 0.9s ease-in-out",
    };

    return (
        <div className="p-6 w-full">
            <div className="flex flex-row justify-end">
                <button onClick={onClose}>
                    <Image
                        src="/navbar/CloseSideBar.svg"
                        alt="Close"
                        width={12}
                        height={12}
                    />
                </button>
            </div>
            <div className="mb-6 flex justify-center items-center">
                <div className="flex flex-col px-10">
                    <p className="font-light">My Balance</p>
                    <p className="text-xl font-semibold">{balance}</p>
                </div>
                <div className="flex flex-col px-10">
                    <p className="font-light">My Cash</p>
                    <p className="text-xl font-semibold">{cash}</p>
                </div>
            </div>
            <div className="overflow-y-auto">{categoryContent()}</div>
        </div>
    );
};

export default SideModal;
