import { useChatHistory } from '../Context/ChatHistoryContext';
import { useCallback } from 'react';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { executeAgent } from '../AgentCreation';

export const useMind = () => {
    const { addMessage, getHistory } = useChatHistory();

    const processChatMessage = useCallback(async (inputMessage: string, date: string, portfolio: string, scaAddress: string | undefined) => {
        const dynamicTemplate = [
            `Date: ${date}`,
            `Portfolio: ${portfolio}`,
            `SCA Address (Smart Contract Account): ${scaAddress}`,
        ];

        const dynamicTemplateMessages = dynamicTemplate.map(templateItem => (["system", templateItem] as [string, string]));

        new SystemMessage(`Portfolio composition:\n\nDate: ${date}\n\nPortfolio: ${portfolio}\n\nSource address: ${scaAddress} \n\nUSDC: 0xaf88d065e77c8cc2239327c5edb3a432268e5831, DAI: 0xda10009cbd5d07dd0cecc66161fc93d7c9000da1, WETH: 0x82af49447d8a07e3bd95bd0d56f35241523fbab1 ARB: 0x912ce59144191c1204e64559fe8253a0e49e6548\n\n`);
        new AIMessage("What is my purpose?");
        new SystemMessage("You are a friendly AI agent that helps users with their queries.");

        // The chat history
        const chatHistory = await getHistory();

        // Call the agent's executeAgent function passing the chat history as query, date, portfolio, and scaAddress
        const response = await executeAgent(inputMessage, chatHistory, date, portfolio, scaAddress);
        
        await addMessage(new HumanMessage(inputMessage));
        // Assuming response.lc_kwargs.content is the way to access the message content
        const content = response.output;

        // Add AI's response to the chat history
        await addMessage(new AIMessage(content));

        console.log("Chat History:", chatHistory);
        return content;
    }, [addMessage, getHistory]);

    return {
        processChatMessage,
    };
};
