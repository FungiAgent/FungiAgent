import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useERC20Transfer } from "@/hooks/useERC20Transfer";
import { BigNumber } from "alchemy-sdk";
import { useNotification } from "@/context/NotificationContextProvider";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useSimUO } from "@/hooks/useSimUO";
import TokenDropdown from "@/components/Dropdown/TokenDropdown";
import { useLiFiTokenInfo } from "@/hooks/useLiFiTokenInfo";
import { ethers } from "ethers";
import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ModalContainer from "./ModalContainer";
import { useWallet } from "@/hooks";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: string;
}

const DepositModal: React.FC<SendModalProps> = ({
    isOpen,
    onClose,
    wallet,
}) => {
    const [choosing, setChoosing] = useState(true);
    const [tokenAddress, setTokenAddress] = useState<string>("USDC_ADDRESS"); // Set default to USDC
    const [amount, setAmount] = useState<string>("");
    const [recipient, setRecipient] = useState<string>("");
    const isValidAddress = (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };
    return (
        <ModalContainer
            showModal={isOpen}
            setShowModal={onClose}
            position={"center"}
            title="Make a Deposit"
        >
            <div className="min-w-[400px]">
                {choosing ? (
                    <div className="flex flex-col justify-around">
                        <div className="pt-5">
                            <p className="font-semibold mb-4">
                                Copy Smart Wallet Address
                            </p>
                            <button
                                className="w-full justify-center py-3 px-2 rounded-xl flex border-2 border-black  mb-8 hover:shadow-input"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        wallet as string,
                                    );
                                }}
                            >
                                {wallet?.substring(0, 10) + "..."}
                            </button>
                            <p className="font-semibold mb-4">
                                Deposit with an EOA
                            </p>
                            <button
                                className="w-full justify-center py-3 px-2 rounded-xl flex bg-main text-white hover:shadow-input"
                                onClick={() => {
                                    setChoosing(false);
                                }}
                            >
                                <p>Deposit</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <button
                            className="flex justify-start p-4"
                            onClick={() => {
                                setChoosing(true);
                            }}
                        >
                            <ChevronLeftIcon width={25} height={25} />
                        </button>
                        <div className="relative max-w-md w-full mx-auto transition-all">
                            <div className="flex flex-row justify-between w-full">
                                <div className="w-full flex flex-col items-start justify-start">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        className="text-xxl w-full rounded focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent text-black placeholder-gray-600"
                                    />
                                    <p className="text-xs w-full text-left rounded text-gray-400">
                                        $0.00
                                    </p>
                                    {/* isValidAddress(recipient)
                                        ? "focus:ring-blue-500"
                                        : "focus:ring-red-500" */}
                                </div>
                                <TokenDropdown onSelect={setTokenAddress} />
                            </div>
                            <div className="py-[40px]">
                                <input
                                    maxLength={42}
                                    type="text"
                                    placeholder="0x..."
                                    value={recipient}
                                    onChange={(e) =>
                                        setRecipient(e.target.value)
                                    }
                                    className="my-2 py-2 px-4 text-lg w-full rounded-xl shadow-input focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent text-black placeholder-gray-400"
                                />
                            </div>
                            <div className="flex justify-between mb-[14px]">
                                <p className="text-gray-500">Network Cost</p>
                                <div className="flex flex-row">
                                    <Image
                                        src="/GasStation.svg"
                                        width={20}
                                        height={20}
                                        alt="Gas Station"
                                    />
                                    <p className="text-gray-500 ml-1">$0.00</p>
                                </div>
                            </div>
                            {tokenAddress &&
                                amount &&
                                recipient &&
                                !isValidAddress(recipient) && (
                                    <p className="text-red-500 text-sm mb-2">
                                        Invalid Ethereum address.
                                    </p>
                                )}
                        </div>
                        <button
                            className={`bg-main text-white w-full py-2 px-4 rounded transition duration-300 ${"opacity-70 cursor-not-allowed"}`}
                        >
                            Deposit
                        </button>
                    </div>
                )}
            </div>
        </ModalContainer>
    );
};

export default DepositModal;
