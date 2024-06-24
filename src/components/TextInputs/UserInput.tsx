import React, { useState } from "react";
import SubmitButton from "public/SubmitButton.svg";
import Image from "next/image";

interface UserInputProps {
    onSubmit: (query: string) => void;
    showConfirmationBox: boolean;
}

export const UserInput: React.FC<UserInputProps> = ({
    onSubmit,
    showConfirmationBox,
}) => {
    const [input, setInput] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (input.trim() !== "") {
            onSubmit(input);
            setInput(""); // Clear the input after submission
        }
    };

    return (
        <div className="pb-0 flex items-center  w-full relative">
            <input
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="What can I do for you?"
                className={`p-4 h-16 w-full rounded-chat bg-chat shadow-input ${showConfirmationBox ? "bg-gray-200" : "bg-white"} pr-16 focus:outline-none focus:ring-2 focus:ring-main`}
                disabled={showConfirmationBox}
            />
            <button
                type="button"
                onClick={handleSubmit}
                disabled={!input.trim()}
                className={`absolute right-4 bottom-4 w-8 h-8 rounded-full text-white ${!input.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <Image src={SubmitButton} alt="Submit" width={36} height={36} />
            </button>
        </div>
    );
};
