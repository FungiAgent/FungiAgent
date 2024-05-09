import { useChatHistory } from '../context/ChatHistoryContext';
import { useCallback } from 'react';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { executeAgent } from '../agent/AgentCreation';

export const useMind = () => {
    const { addMessage, getHistory } = useChatHistory();

    const processChatMessage = useCallback(async (inputMessage: string, date?: string, portfolio?: string, scaAddress?: string | undefined) => {

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

    // A modified processChatMessage function that only receives the inputMessage, and passes it as a systemMessage to the agent
    // This is a context feeding function
    const processInternalMessage = useCallback(async (inputMessage: string) => {
        // The chat history
        const chatHistory = await getHistory();

        await addMessage(new SystemMessage(inputMessage));

        // Call the agent's executeAgent function passing the chat history as query
        const response = await executeAgent(inputMessage, chatHistory);

        const content = response.output;

        // Add AI's response to the chat history
        await addMessage(new AIMessage(content));

        // console.log("Chat History:", chatHistory);
        return content;
    }, [addMessage, getHistory]);

    return { processChatMessage, processInternalMessage };
};
