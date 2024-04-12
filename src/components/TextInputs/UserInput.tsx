import React, { useState } from 'react';

interface UserInputProps {
  onSubmit: (query: string) => void;
}

export const UserInput: React.FC<UserInputProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (input.trim() !== '') {
      onSubmit(input);
      setInput(''); // Clear the input after submission
    }
  };

  return (
    <div className="flex items-center mt-4 w-full max-w-3xl relative">
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
        className={`absolute right-4 bottom-4 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg> */}
        
      </button>
    </div>
  );
};