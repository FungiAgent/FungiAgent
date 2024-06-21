import React, { useEffect, useState } from "react";
import { useLiFiTokenInfo } from "@/hooks/useLiFiTokenInfo"; // Custom hook to fetch supported tokens

interface TokenDropdownProps {
    onSelect: (tokenAddress: string) => void;
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({ onSelect }) => {
    const { tokens, loading, error } = useLiFiTokenInfo();
    const [selectedToken, setSelectedToken] = useState<string>("");

    useEffect(() => {
        if (tokens.length > 0) {
            setSelectedToken(tokens[0].address);
            onSelect(tokens[0].address); // Set initial selected token
        }
    }, [tokens, onSelect]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAddress = event.target.value;
        setSelectedToken(selectedAddress);
        onSelect(selectedAddress);
    };

    return (
        <div className=" w-[40%] ">
            {loading ? (
                <p>Loading tokens...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="shadow-lg rounded-full px-2 py-1">
                    <select
                        value={selectedToken}
                        onChange={handleChange}
                        className="px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-transparent bg-transparent  focus:ring-blue-500 border-0"
                    >
                        {tokens.map((token) => (
                            <option key={token.address} value={token.address}>
                                {token.symbol}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default TokenDropdown;
