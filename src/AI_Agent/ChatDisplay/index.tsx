// ChatDisplay.tsx
import React from 'react';
import styles from './ChatDisplay.module.css';

const AvatarAndName: React.FC<{ type: 'human' | 'ai' }> = ({ type }) => {
  const avatarSrc = type === 'human' ? '/profile/User.svg' : '/profile/Logo.svg';
  const name = type === 'human' ? 'You' : 'Fungi';
  return (
    <div className={styles.avatarContainer}>
      <img src={avatarSrc} alt={`${name} avatar`} className={styles.avatar} />
      <span className={styles.name}>{name}</span>
      <br/>
    </div>
  );
};

const ChatDisplay: React.FC<{ chatHistory: any[] }> = ({ chatHistory }) => {
  const containerClass = chatHistory.length > 0 ? `${styles.chatContainer} ${styles.scrolling}` : styles.chatContainer;
  const nonSystemMessages = chatHistory.filter((msg) => msg?.lc_id?.[2] !== 'SystemMessage');

  const renderMessage = (msg, index) => {
    let messageStyle = '';
    const messageType = msg?.lc_id?.[2];
    const content = msg?.content || 'Unknown message format';

    switch (messageType) {
      case 'HumanMessage':
        messageStyle = styles.humanMessage;
        break;
      case 'AIMessage':
        messageStyle = styles.aiMessage;
        break;
      default:
        messageStyle = 'text-gray-800';
    }

    return (
      <div key={index} className={`${styles.message} ${messageStyle}`}>
        {messageType === 'HumanMessage' || messageType === 'AIMessage' ? (
          <AvatarAndName type={messageType === 'HumanMessage' ? 'human' : 'ai'} />
        ) : null}
        <div className={styles.messageContentContainer}>
          <span className={styles.messageContent}>{content}</span>
        </div>
      </div>
    );
  };

  const renderPlaceholder = () => {
    return <div className="text-gray-500 text-center">No messages yet...</div>;
  };

  return (
    <div className={containerClass}>
      <div className={styles.messagesWrapper}>
        {nonSystemMessages.length === 0 ? renderPlaceholder() : nonSystemMessages.map(renderMessage)}
      </div>
    </div>
  );
};

export default ChatDisplay;