// ChatDisplay.jsx or ChatDisplay.tsx

import React from 'react';
import styles from './ChatDisplay.module.css';

const ChatDisplay = ({ chatHistory }) => {
    // Ensure chatHistory is an array before mapping over it
    // const safeChatHistory = Array.isArray(chatHistory) ? chatHistory : [];

    const containerClass = chatHistory.length > 0 ? `${styles.chatContainer} ${styles.scrolling}` : styles.chatContainer;

    const renderMessage = (msg, index) => {
        let msgClass = '';
        let prefix = '';
        let messageStyle = '';

        // Adjusted to safely access properties
        const messageType = msg?.lc_id[2];
        const content = msg?.content || "Unknown message format";

        switch (messageType) {
            case 'SystemMessage':
                messageStyle = styles.systemMessage;
                prefix = 'System: ';
                break;
            case 'HumanMessage':
                messageStyle = styles.humanMessage;
                prefix = 'You: ';
                break;
            case 'AIMessage':
                messageStyle = styles.aiMessage;
                prefix = 'AI: ';
                break;
            default:
                msgClass = 'text-gray-800';
        }

        return (
            <div key={index} className={`${styles.message} ${messageStyle}`}>
                {prefix}{content}
            </div>
        );
    };

    const renderPlaceholder = () => {
        return <div className="text-gray-500 text-center">No messages yet...</div>;
    };

    return (
        <div className={containerClass}>
            {chatHistory.length === 0
                ? renderPlaceholder()
                : chatHistory.map(renderMessage)}
        </div>
    );
};

export default ChatDisplay;
