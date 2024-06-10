import React, { createContext, useContext, useState, ReactNode } from "react";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { BaseMessage } from "@langchain/core/messages";

// Define the context shape
interface ChatHistoryContextType {
    addMessage: (message: BaseMessage) => Promise<void>;
    clearHistory: () => Promise<void>;
    getHistory: () => Promise<BaseMessage[]>;
    chatHistory: ChatMessageHistory;
}

// Providing a default value for the context
const ChatHistoryContext = createContext<ChatHistoryContextType | null>(null);

export const useChatHistory = () => {
    const context = useContext(ChatHistoryContext);
    if (!context) {
        throw new Error(
            "useChatHistory must be used within a ChatHistoryProvider",
        );
    }
    return context;
};

interface ChatHistoryProviderProps {
    children: ReactNode;
}

export const ChatHistoryProvider: React.FC<ChatHistoryProviderProps> = ({
    children,
}) => {
    const [chatHistory, setChatHistory] = useState<ChatMessageHistory>(
        new ChatMessageHistory(),
    );

    const addMessage = async (message: BaseMessage) => {
        await chatHistory.addMessage(message);
        // Trigger re-render by setting a new instance of the chat history
        setChatHistory(
            new ChatMessageHistory([...(await chatHistory.getMessages())]),
        );
    };

    const clearHistory = async () => {
        await chatHistory.clear();
        setChatHistory(new ChatMessageHistory());
    };

    const getHistory = async (): Promise<BaseMessage[]> => {
        return await chatHistory.getMessages();
    };

    return (
        <ChatHistoryContext.Provider
            value={{ addMessage, clearHistory, getHistory, chatHistory }}
        >
            {children}
        </ChatHistoryContext.Provider>
    );
};
