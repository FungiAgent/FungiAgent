import React, { useState } from "react";
import Image from "next/image";
import { Transaction, TransactionDetails } from "@/lib/alchemy/types";
import ClipboardIcon from "/public/img/clipboard-svgrepo-com.svg";
import ClipboardCheckIcon from "/public/img/clipboard-check-svgrepo-com.svg";
import { shortenAddress, copyToClipboard } from "@/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekday from "dayjs/plugin/weekday";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);

type TransactionRowProps = {
    transaction: Transaction;
    details?: TransactionDetails;
    prevDetails?: TransactionDetails | null;

    formatCurrency: (value: number) => string;
    index: number;
};

function CardContainer({ children }) {
    return <div className="px-4 py-2">{children}</div>;
}

function DateSection({ date, title }: { date: string; title?: boolean }) {
    if (title) {
        return <p className="text-main font-bold mb-4">{date}</p>;
    } else {
        return <p className="text-gray-400 font-light text-sm mb-4">{date}</p>;
    }
}

function TitleSection({ title }: { title: string }) {
    return <p className="font-semibold text-lg mb-2">{title}</p>;
}

function BodySection({ children }) {
    return <p className="text-md">{children}</p>;
}

function EyeSection({ visible, setVisible }) {
    return (
        <button
            onClick={() => setVisible(!visible)}
            className=" flex w-full justify-end"
        >
            {!visible ? (
                <EyeIcon className="text-gray-500 w-50 h-5" />
            ) : (
                <EyeSlashIcon className="text-gray-500 w-50 h-5" />
            )}
        </button>
    );
}

function HashSection({ to, id, hashVisible, setHashVisible }) {
    const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

    const handleCopy = (text: string, key: string) => {
        copyToClipboard(text);
        setCopied((prevState) => ({ ...prevState, [key]: true }));
        setTimeout(() => {
            setCopied((prevState) => ({ ...prevState, [key]: false }));
        }, 2000);
    };

    if (hashVisible) {
        return (
            <>
                {/* <EyeSection visible={hashVisible} setVisible={setHashVisible} /> */}
                <p className="text-gray-600 mt-2">
                    To: {shortenAddress(to || "Unknown")}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            handleCopy(to || "Unknown", to || "Unknown");
                        }}
                        className="ml-2"
                    >
                        <Image
                            src={
                                copied[to || "Unknown"]
                                    ? ClipboardCheckIcon
                                    : ClipboardIcon
                            }
                            alt="Copy Icon"
                            width={16}
                            height={16}
                        />
                    </button>
                </p>
                <p className="text-gray-500">
                    Hash: {shortenAddress(id)}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(id, id);
                        }}
                        className="ml-2"
                    >
                        <Image
                            src={
                                copied[id] ? ClipboardCheckIcon : ClipboardIcon
                            }
                            alt="Copy Icon"
                            width={16}
                            height={16}
                        />
                    </button>
                </p>
            </>
        );
    }
    //  else {
    //     return <EyeSection visible={hashVisible} setVisible={setHashVisible} />;
    // }
}

const TransactionRow: React.FC<TransactionRowProps> = React.memo(
    ({ transaction, details, formatCurrency, index, prevDetails }) => {
        const dateTime = details
            ? dayjs(
                  new Date(details.timestamp * 1000).toLocaleString(),
              ).fromNow()
            : "Loading...";

        const [hashVisible, setHashVisible] = useState<boolean>(false);

        const toggleHashVisible = () => {
            setHashVisible(!hashVisible);
            setTimeout(() => {
                setHashVisible(false);
            }, 2000);
        };

        const renderSwapDetails = () => (
            <CardContainer>
                <DateSection date={dateTime} />
                <TitleSection title="Swapped" />
                <BodySection>
                    {formatCurrency(transaction.amount ?? 0)}{" "}
                    {transaction.tokenSymbol} for{" "}
                    {formatCurrency(transaction.receivedAmount ?? 0)}{" "}
                    {transaction.receivedTokenSymbol}
                </BodySection>
                <HashSection
                    to={transaction.to}
                    id={transaction.id}
                    hashVisible={hashVisible}
                    setHashVisible={toggleHashVisible}
                />
            </CardContainer>
        );

        const renderOtherDetails = () => (
            <CardContainer>
                <DateSection date={dateTime} />

                <TitleSection title={transaction.operationType} />
                <BodySection>
                    {formatCurrency(transaction.amount ?? 0)}{" "}
                    {transaction.tokenSymbol} to{" "}
                    {shortenAddress(transaction.to || "Unknown")}
                </BodySection>
                <HashSection
                    to={transaction.to}
                    id={transaction.id}
                    hashVisible={hashVisible}
                    setHashVisible={toggleHashVisible}
                />
            </CardContainer>
        );

        const checkSameDay = (
            lastTransactionTimeStamp: number,
            thisTransactionTimeStamp: number,
        ) => {
            const lastDate = new Date(
                lastTransactionTimeStamp * 1000,
            ).toLocaleString();
            const thisDate = new Date(
                thisTransactionTimeStamp * 1000,
            ).toLocaleString();

            const isSameDay =
                dayjs(lastDate).format("DD/MM/YYYY") ===
                dayjs(thisDate).format("DD/MM/YYYY");
            return isSameDay;
        };

        const formatDate = (date) => {
            const today = dayjs();
            const targetDate = dayjs(date);

            if (targetDate.isToday()) {
                return "Today";
            } else if (targetDate.isYesterday()) {
                return "Yesterday";
            } else if (today.diff(targetDate, "day") === 2) {
                return "Two days ago";
            } else {
                return targetDate.format("MMMM Do, YYYY");
            }
        };
        const dateTitle = details
            ? formatDate(new Date(details.timestamp * 1000))
            : "Loading...";
        return (
            <button
                className="flex flex-col align-top text-left p-4 bg-white border-l-white border-l-2  hover:border-l-main hover:border-l-2 cursor-pointer"
                onClick={toggleHashVisible}
            >
                {((prevDetails &&
                    !checkSameDay(
                        prevDetails.timestamp,
                        details?.timestamp as number,
                    )) ||
                    !prevDetails) && (
                    <DateSection date={dateTitle} title={true} />
                )}
                {transaction.operationType === "Swap"
                    ? renderSwapDetails()
                    : renderOtherDetails()}
            </button>
        );
    },
);

export default TransactionRow;
