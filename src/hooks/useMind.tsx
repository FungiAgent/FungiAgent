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
        console.log("1. Getting chat history PCM...");
        const initialChatHistory = await getHistory();
        console.log("Initial chat history:", initialChatHistory);

        console.log("2. Adding human message PCM...");
        await addMessage(new HumanMessage(inputMessage));

        const chatHistoryAfterHumanMessage = await getHistory();
        console.log(
            "Chat history after adding human message:",
            chatHistoryAfterHumanMessage,
        );

        console.log("3. Executing agent PCM...");
        const response = await executeAgent(
            inputMessage,
            chatHistoryAfterHumanMessage,
            date,
            portfolio,
            scaAddress,
        );

        const content = response.output;
        console.log("4. Adding AI message PCM...");
        await addMessage(new AIMessage(content));

        const finalChatHistory = await getHistory();
        console.log(
            "Final chat history after adding AI message:",
            finalChatHistory,
        );

        return content;
    };

    const processInternalMessage = async (inputMessage: string) => {
        console.log("5. Getting history...");
        const chatHistory = await getHistory();
        console.log(
            "Chat history before adding internal message:",
            chatHistory,
        );

        console.log("6. Adding system message...");
        await addMessage(new SystemMessage(inputMessage));

        const chatHistoryAfterSystemMessage = await getHistory();
        console.log(
            "Chat history after adding system message:",
            chatHistoryAfterSystemMessage,
        );

        console.log("7. Executing internal agent...");
        const response = await executeInternalAgent(
            inputMessage,
            chatHistoryAfterSystemMessage,
        );

        const content = response.output;
        console.log("8. Adding AI message...");
        await addMessage(new AIMessage(content));

        const finalChatHistory = await getHistory();
        console.log(
            "Final chat history after adding AI message:",
            finalChatHistory,
        );

        return content;
    };

    return { processChatMessage, processInternalMessage };
};
