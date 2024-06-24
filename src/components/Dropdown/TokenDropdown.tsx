import React, { useEffect, useState } from "react";
import { useLiFiTokenInfo } from "@/hooks/useLiFiTokenInfo"; // Custom hook to fetch supported tokens
import SelectModal from "../Modals/SelectModal";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface TokenDropdownProps {
    onSelect: (tokenAddress: string) => void;
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({ onSelect }) => {
    const { tokens, loading, error } = useLiFiTokenInfo();
    const [selectedToken, setSelectedToken] = useState<{
        id: string;
        label: string;
        value: string;
    }>({ id: "", label: "", value: "" });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (tokens.length > 0) {
            setSelectedToken({
                value: tokens[0].address,
                id: tokens[0].address,
                label: tokens[0].symbol,
            });
            onSelect(tokens[0].address); // Set initial selected token
        }
    }, [tokens, onSelect]);

    const handleChange = ({ id, value, label }) => {
        const selectedAddress = value;
        setSelectedToken({ id, value, label });
        onSelect(selectedAddress);
    };

    return (
        <div>
            <SelectModal
                onSelect={handleChange}
                items={tokens.map((token) => {
                    return {
                        id: token.address,
                        label: token.symbol,
                        value: token.address,
                    };
                })}
                showModal={showModal}
                setShowModal={setShowModal}
                defaultVal={selectedToken}
                title="Select Token"
            />
            <button
                onClick={() => {
                    setShowModal(true);
                }}
                className="flex justify-between font-light px-2 py-1 focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent  focus:ring-blue-500 shadow-input rounded-xl min-w-[100px]"
            >
                {selectedToken.label}
                <ChevronDownIcon width={25} height={25} />
            </button>
        </div>
    );
};

export default TokenDropdown;
