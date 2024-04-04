import React from 'react';

const ChatDisplay = ({ chatHistory }) => {
    const renderMessage = (msg: { id: any[]; kwargs: { content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }; }, index: React.Key | null | undefined) => {
        let msgClass = '';
        let prefix = '';

        switch (msg.id[2]) { // msg.id[2] should indicate the type: SystemMessage, HumanMessage, AIMessage
            case 'SystemMessage':
                msgClass = 'text-gray-500';
                prefix = 'System: ';
                break;
            case 'HumanMessage':
                msgClass = 'text-blue-600';
                prefix = 'You: ';
                break;
            case 'AIMessage':
                msgClass = 'text-green-600';
                prefix = 'AI: ';
                break;
            default:
                msgClass = 'text-gray-800';
        }

        return (
            <div key={index} className={`${msgClass} mb-2`}>
                {prefix}{msg.kwargs.content}
            </div>
        );
    };

    return (
        <div className="chat-display overflow-auto p-4" style={{ maxHeight: '60vh' }}>
            {chatHistory.map(renderMessage)}
        </div>
    );
};

export default ChatDisplay;
