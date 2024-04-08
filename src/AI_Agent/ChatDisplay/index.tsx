// ChatDisplay.tsx

import React from 'react';
import styles from './ChatDisplay.module.css';

const ChatDisplay = ({ chatHistory }) => {
    const containerClass = chatHistory.length > 0 ? `${styles.chatContainer} ${styles.scrolling}` : styles.chatContainer;

    // Filter out system messages before mapping
    const nonSystemMessages = chatHistory.filter(msg => msg?.lc_id[2] !== 'SystemMessage');

    const renderMessage = (msg, index) => {
        let prefix = '';
        let messageStyle = '';

        // Adjusted to safely access properties
        const messageType = msg?.lc_id[2];
        const content = msg?.content || "Unknown message format";

        switch (messageType) {
            case 'HumanMessage':
                messageStyle = styles.humanMessage;
                prefix = 'You: ';
                break;
            case 'AIMessage':
                messageStyle = styles.aiMessage;
                prefix = 'AI: ';
                break;
            default:
                messageStyle = 'text-gray-800';
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
        <div className={styles.chatContainer}>
            <div className={styles.messagesWrapper}>
                {nonSystemMessages.length === 0
                    ? renderPlaceholder()
                    : nonSystemMessages.map(renderMessage)}
            </div>
        </div>
    );
};

export default ChatDisplay;
