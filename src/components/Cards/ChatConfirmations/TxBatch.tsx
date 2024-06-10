import React from "react";
import Image from "next/image";

const TxBatchHeader = ({ tokens, percentages }) => {
    return (
        <div className="bg-white rounded-[20px] shadow-sm p-4 w-[454px]">
            <div className="p-[24px]">
                <h1
                    className="pb-[24px] text-center"
                    style={{ fontSize: "20px", fontFamily: "DM Sans" }}
                >
                    Selected Tokens
                </h1>
                {tokens.map((token, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center mb-2"
                    >
                        <div className="flex items-center">
                            <div className="mr-2">
                                <Image
                                    src={token.logo}
                                    width={24}
                                    height={24}
                                    alt={token.name}
                                />
                            </div>
                            <div className="flex flex-col">
                                <span>{token.name}</span>
                                <span className="text-gray-400">
                                    {token.symbol}
                                </span>
                            </div>
                        </div>
                        <span
                            className="text-gray-400 w-[44px] h-[24px] border-1 border-gray-300 pl-2 pt-1"
                            style={{ fontSize: "12px", fontFamily: "DM Sans" }}
                        >
                            {percentages[index]}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TxSummaryDetails = ({ priceImpact, networkCost, maxSlippage }) => {
    return (
        <div className="bg-white rounded-[20px] shadow-sm p-4 w-[454px] mt-4">
            <div className="flex justify-between">
                <span>Price Impact</span>
                <span>~{priceImpact}%</span>
            </div>
            <div className="flex justify-between mt-3">
                <span>Network Cost</span>
                <span>${networkCost}</span>
            </div>
            <div className="flex justify-between mt-3">
                <span>Max Slippage</span>
                <span>{maxSlippage}%</span>
            </div>
        </div>
    );
};

const TxBatch = ({
    tokens,
    percentages,
    priceImpact,
    networkCost,
    maxSlippage,
}) => {
    return (
        <div>
            <TxBatchHeader tokens={tokens} percentages={percentages} />
            <TxSummaryDetails
                priceImpact={priceImpact}
                networkCost={networkCost}
                maxSlippage={maxSlippage}
            />
        </div>
    );
};

export default TxBatch;
