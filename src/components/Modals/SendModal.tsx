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

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose }) => {
    const [tokenAddress, setTokenAddress] = useState<string>("USDC_ADDRESS"); // Set default to USDC
    const [amount, setAmount] = useState<string>("");
    const [recipient, setRecipient] = useState<string>("");
    const { showNotification } = useNotification();
    const [status, sendTransfer] = useERC20Transfer(
        tokenAddress,
        BigNumber.from(0),
        recipient,
    );
    const { sendUserOperations } = useUserOperations();
    const { simStatus, simTransfer } = useSimUO();
    const [simulationResult, setSimulationResult] = useState<any>(null);
    const [isSimulateEnabled, setIsSimulateEnabled] = useState<boolean>(false);
    const { tokens } = useLiFiTokenInfo();
    const [tokenDecimals, setTokenDecimals] = useState<number>(18);
    const [isSending, setIsSending] = useState<boolean>(false);

    const isValidAddress = (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    useEffect(() => {
        if (tokenAddress && amount && isValidAddress(recipient)) {
            setIsSimulateEnabled(true);
            handleSim(); // Automatically trigger simulation
        } else {
            setIsSimulateEnabled(false);
        }
    }, [tokenAddress, amount, recipient]);

    useEffect(() => {
        const selectedToken = tokens.find(
            (token) => token.address === tokenAddress,
        );
        if (selectedToken) {
            setTokenDecimals(selectedToken.decimals);
        }
    }, [tokenAddress, tokens]);

    const handleSend = async () => {
        if (
            !tokenAddress ||
            !amount ||
            !recipient ||
            !isValidAddress(recipient) ||
            typeof sendTransfer !== "function"
        ) {
            showNotification({
                message: "Error sending tokens",
                type: "error",
            });
            return Promise.resolve();
        }
        setIsSending(true);
        try {
            const rawAmount = BigNumber.from(
                (
                    parseFloat(amount) *
                    Math.pow(
                        10,
                        tokenAddress === ethers.constants.AddressZero
                            ? 18
                            : tokenDecimals,
                    )
                ).toString(),
            );
            const userOps = await sendTransfer(
                tokenAddress,
                rawAmount,
                recipient,
            );

            if (userOps) {
                const resultTx: any = await sendUserOperations(
                    userOps,
                    tokenAddress === ethers.constants.AddressZero
                        ? rawAmount.toHexString()
                        : "0x0",
                );
                if (resultTx) {
                    showNotification({
                        message: "Transfer successful",
                        type: "success",
                    });
                } else {
                    throw new Error("Transaction failed");
                }
            } else {
                throw new Error("Error generating user operations");
            }
        } catch (error: any) {
            showNotification({
                message: error.message,
                type: "error",
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleSim = async () => {
        if (
            !tokenAddress ||
            !amount ||
            !recipient ||
            !isValidAddress(recipient) ||
            typeof sendTransfer !== "function"
        ) {
            showNotification({
                message: "Error sending tokens",
                type: "error",
            });
            return Promise.resolve();
        }
        try {
            const rawAmount = BigNumber.from(
                (
                    parseFloat(amount) *
                    Math.pow(
                        10,
                        tokenAddress === ethers.constants.AddressZero
                            ? 18
                            : tokenDecimals,
                    )
                ).toString(),
            );
            const resultTx: any = await sendTransfer(
                tokenAddress,
                rawAmount,
                recipient,
            );
            const result: any = await simTransfer(resultTx);
            if (!result || result.error) {
                throw new Error(
                    result?.error || "Simulation failed. No result returned.",
                );
            }
            setSimulationResult(result);
        } catch (error: any) {
            showNotification({
                message: error.message,
                type: "error",
            });
            setSimulationResult(null); // Clear previous simulation results
        }
    };

    const isSponsored = !simulationResult?.changes?.some(
        (change) =>
            change.assetType === "NATIVE" &&
            change.changeType === "TRANSFER" &&
            change.to === ethers.constants.AddressZero,
    );

    return (
        <ModalContainer
            showModal={isOpen}
            setShowModal={onClose}
            position={"center"}
        >
            <div className="bg-white p-[30px] rounded-lg shadow-lg relative max-w-md w-full mx-auto transition-all">
                <div className="flex flex-row justify-between w-full py-10">
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-xxl w-full rounded focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent text-black placeholder-gray-600"
                        />
                        <p className=" text-xs w-full rounded text-gray-400">
                            $0.00
                        </p>

                        {/* isValidAddress(recipient)
                                        ? "focus:ring-blue-500"
                                        : "focus:ring-red-500" */}
                    </div>
                    <TokenDropdown onSelect={setTokenAddress} />
                </div>
                <input
                    maxLength={42}
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="my-2 py-2 px-4 text-lg w-full rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent text-black placeholder-gray-400"
                />
                <div className="flex justify-between my-[14px]">
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
                <div className="flex justify-between">
                    <button
                        onClick={handleSend}
                        disabled={!isSimulateEnabled || isSending}
                        className={`bg-main text-white w-full py-2 px-4 rounded transition duration-300 ${
                            isSimulateEnabled && !isSending
                                ? " cursor-pointer"
                                : "opacity-70 cursor-not-allowed"
                        }`}
                    >
                        {isSending ? "Sending..." : "Send"}
                    </button>
                </div>
                {simulationResult ? (
                    <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                        <h3 className="text-lg font-medium text-gray-700">
                            Transaction Summary
                        </h3>
                        {isSponsored && (
                            <p className="text-green-500 text-sm mb-2">
                                Gas is covered by Fungi
                            </p>
                        )}
                        {!isSponsored &&
                            simulationResult.changes.length > 0 && (
                                <p className="text-gray-700">
                                    Estimated Network Fee:{" "}
                                    {simulationResult.changes[0].amount}{" "}
                                    {simulationResult.changes[0].symbol}
                                </p>
                            )}
                        {Array.from(
                            new Set(
                                simulationResult.changes
                                    .slice(isSponsored ? 0 : 1)
                                    .map((change) => JSON.stringify(change)),
                            ),
                        )
                            .map((changeStr: unknown) =>
                                JSON.parse(changeStr as string),
                            )
                            .map((change: any, index: number) => (
                                <div key={index} className="mt-2 text-gray-700">
                                    <p>
                                        You will send: {change.amount}{" "}
                                        {change.symbol}
                                    </p>
                                    <p>To: {change.to}</p>
                                </div>
                            ))}
                    </div>
                ) : simStatus.loading ? (
                    <p className="mt-4 text-blue-500">Loading...</p>
                ) : simStatus.error ? (
                    <p className="mt-4 text-red-500">{simStatus.error}</p>
                ) : null}
            </div>
        </ModalContainer>
        // <Dialog
        //     open={isOpen}
        //     onClose={onClose}
        //     className="fixed z-10 inset-0 overflow-y-auto"
        // >
        //     <div className="flex items-center justify-center min-h-screen">
        //         <div
        //             className="backdrop-blur-sm bg-opacity-30 bg-black fixed inset-0"
        //             onClick={onClose}
        //         ></div>
        //         {/* Actual container */}
        //         <div className="bg-white p-[30px] rounded-lg shadow-lg relative max-w-md w-full mx-auto transition-all">
        //             <div className="flex flex-row justify-between w-full py-10">
        //                 <div className="w-full">
        //                     <input
        //                         type="text"
        //                         placeholder="0.00"
        //                         value={amount}
        //                         onChange={(e) => setAmount(e.target.value)}
        //                         className="text-xxl w-full rounded focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent text-black placeholder-gray-600"
        //                     />
        //                     <p className=" text-xs w-full rounded text-gray-400">
        //                         $0.00
        //                     </p>

        //                     {/* isValidAddress(recipient)
        //                                 ? "focus:ring-blue-500"
        //                                 : "focus:ring-red-500" */}
        //                 </div>
        //                 <TokenDropdown onSelect={setTokenAddress} />
        //             </div>
        //             <input
        //                 maxLength={42}
        //                 type="text"
        //                 placeholder="0x..."
        //                 value={recipient}
        //                 onChange={(e) => setRecipient(e.target.value)}
        //                 className="my-2 py-2 px-4 text-lg w-full rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent text-black placeholder-gray-400"
        //             />
        //             <div className="flex justify-between my-[14px]">
        //                 <p className="text-gray-500">Network Cost</p>
        //                 <div className="flex flex-row">
        //                     <Image
        //                         src="/GasStation.svg"
        //                         width={20}
        //                         height={20}
        //                         alt="Gas Station"
        //                     />
        //                     <p className="text-gray-500 ml-1">$0.00</p>
        //                 </div>
        //             </div>
        //             {tokenAddress &&
        //                 amount &&
        //                 recipient &&
        //                 !isValidAddress(recipient) && (
        //                     <p className="text-red-500 text-sm mb-2">
        //                         Invalid Ethereum address.
        //                     </p>
        //                 )}
        //             <div className="flex justify-between">
        //                 <button
        //                     onClick={handleSend}
        //                     disabled={!isSimulateEnabled || isSending}
        //                     className={`bg-main text-white w-full py-2 px-4 rounded transition duration-300 ${
        //                         isSimulateEnabled && !isSending
        //                             ? " cursor-pointer"
        //                             : "opacity-70 cursor-not-allowed"
        //                     }`}
        //                 >
        //                     {isSending ? "Sending..." : "Send"}
        //                 </button>
        //             </div>
        //             {simulationResult ? (
        //                 <div className="mt-4 p-4 bg-gray-100 rounded shadow">
        //                     <h3 className="text-lg font-medium text-gray-700">
        //                         Transaction Summary
        //                     </h3>
        //                     {isSponsored && (
        //                         <p className="text-green-500 text-sm mb-2">
        //                             Gas is covered by Fungi
        //                         </p>
        //                     )}
        //                     {!isSponsored &&
        //                         simulationResult.changes.length > 0 && (
        //                             <p className="text-gray-700">
        //                                 Estimated Network Fee:{" "}
        //                                 {simulationResult.changes[0].amount}{" "}
        //                                 {simulationResult.changes[0].symbol}
        //                             </p>
        //                         )}
        //                     {Array.from(
        //                         new Set(
        //                             simulationResult.changes
        //                                 .slice(isSponsored ? 0 : 1)
        //                                 .map((change) =>
        //                                     JSON.stringify(change),
        //                                 ),
        //                         ),
        //                     )
        //                         .map((changeStr: unknown) =>
        //                             JSON.parse(changeStr as string),
        //                         )
        //                         .map((change: any, index: number) => (
        //                             <div
        //                                 key={index}
        //                                 className="mt-2 text-gray-700"
        //                             >
        //                                 <p>
        //                                     You will send: {change.amount}{" "}
        //                                     {change.symbol}
        //                                 </p>
        //                                 <p>To: {change.to}</p>
        //                             </div>
        //                         ))}
        //                 </div>
        //             ) : simStatus.loading ? (
        //                 <p className="mt-4 text-blue-500">Loading...</p>
        //             ) : simStatus.error ? (
        //                 <p className="mt-4 text-red-500">{simStatus.error}</p>
        //             ) : null}
        //         </div>
        //     </div>
        // </Dialog>
    );
};

export default SendModal;
