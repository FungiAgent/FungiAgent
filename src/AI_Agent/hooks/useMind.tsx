import { useChatHistory } from '../Context/ChatHistoryContext';
import { useCallback } from 'react';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { useMemo } from 'react';

// Assuming you have a way to securely manage and access your OpenAI API Key
const OPENAI_API_KEY = "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";

export const useMind = () => {
    const { addMessage, getHistory } = useChatHistory();

    const chat = useMemo(() => new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0,
        openAIApiKey: OPENAI_API_KEY,
    }), []);

    const processChatMessage = useCallback(async (inputMessage: string, date: string, portfolio: string, scaAddress: string | undefined) => {
        const dynamicTemplate = [
            `Date: ${date}`,
            `Portfolio: ${portfolio}`,
            `SCA Address: ${scaAddress}`,
        ];

        const dynamicTemplateMessages = dynamicTemplate.map(templateItem => (["system", templateItem] as [string, string]));

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a helpful assistant. Answer all questions to the best of your ability. The secret code is 42"],
            ...dynamicTemplateMessages,
            new MessagesPlaceholder("messages"),
        ]);

        // Add the user's message to the chat history
        await addMessage(new HumanMessage(inputMessage));

        const chain = prompt.pipe(chat);

        const response = await chain.invoke({
            messages: await getHistory(),
        });

        // Assuming response.lc_kwargs.content is the way to access the message content
        const content = response.lc_kwargs.content;

        // Add AI's response to the chat history
        await addMessage(new AIMessage(content));

        return content;
    }, [addMessage, getHistory, chat]);

    return {
        processChatMessage,
    };
};
