import { useChatHistory } from '../Context/ChatHistoryContext';
import { useCallback } from 'react';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { executeAgent } from '../AgentCreation';

export const useMind = () => {
    const { addMessage, getHistory } = useChatHistory();

    const processChatMessage = useCallback(async (inputMessage: string, date: string, portfolio: string, scaAddress: string | undefined) => {

        // The chat history
        const chatHistory = await getHistory();

        await addMessage(new HumanMessage(inputMessage));

        // Call the agent's executeAgent function passing the chat history as query, date, portfolio, and scaAddress
        const response = await executeAgent(inputMessage, chatHistory, date, portfolio, scaAddress);
        
        const content = response.output;

        // Add AI's response to the chat history
        await addMessage(new AIMessage(content));

        // console.log("Chat History:", chatHistory);
        return content;
    }, [addMessage, getHistory]);

    return {
        processChatMessage,
    };
};
