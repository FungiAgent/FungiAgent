// ChatDisplay.tsx
import React from 'react';
import styles from './ChatDisplay.module.css';
import Image from "next/image";
import Logo from "../../../public/profile/Logo.svg";

const AvatarAndName: React.FC<{ type: 'human' | 'ai' }> = ({ type }) => {
  const avatarSrc = type === 'human' ? '/profile/User.svg' : '/profile/Logo.svg';
  const name = type === 'human' ? 'You' : 'Fungi';
  return (
    <div className={styles.avatarContainer}>
      <Image src={avatarSrc} alt={`${name} avatar`} width={40} height={40} />
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
    return (
      <div className="col-span-3 flex items-center justify-center flex-col">
        <Image
          width={150}
          height={150}
          alt="Logo"
          src={Logo.src}
          aria-hidden="true"
        />
        <h1 className="text-3xl">
          Hi, I'm Fungi! your DeFi Friend
        </h1>
      </div>
    )
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