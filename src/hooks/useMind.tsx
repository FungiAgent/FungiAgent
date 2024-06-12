import { useChatHistory } from "../context/ChatHistoryContext";
import { useCallback } from "react";
import {
    HumanMessage,
    AIMessage,
    SystemMessage,
} from "@langchain/core/messages";
import { executeAgent, executeInternalAgent } from "../agent/AgentCreation";

export const useMind = () => {
    const { addMessage, getHistory } = useChatHistory();

    const processChatMessage = async (
        inputMessage: string,
        date?: string,
        portfolio?: string,
        scaAddress?: string | undefined,
    ) => {
        await addMessage(new HumanMessage(inputMessage));
        const chatHistory = await getHistory();
        const response = await executeAgent(
            inputMessage,
            chatHistory,
            date,
            portfolio,
            scaAddress,
        );
        const content = response.output;
        await addMessage(new AIMessage(content));
        return content;
    };

    const processInternalMessage = async (inputMessage: string) => {
        await addMessage(new SystemMessage(inputMessage));

        const chatHistory = await getHistory();

        const response = await executeInternalAgent(inputMessage, chatHistory);

        const content = response.output;
        await addMessage(new AIMessage(content));

        return content;
    };

    return { processChatMessage, processInternalMessage };
};
