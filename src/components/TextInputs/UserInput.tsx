import React, { useState } from "react";
import SubmitButton from "public/SubmitButton.svg";
import Image from "next/image";

interface UserInputProps {
    onSubmit: (query: string) => void;
}

export const UserInput: React.FC<UserInputProps> = ({ onSubmit }) => {
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
        <div className="pb-0 flex items-center mt-4 w-full md:w-[731px] relative">
            <input
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="What can I do for you?"
                className="p-4 h-16 w-full rounded-md border border-gray-300 bg-white pr-16"
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
