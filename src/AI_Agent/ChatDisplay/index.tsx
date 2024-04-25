import React, { useRef, useEffect } from 'react';
import styles from './ChatDisplay.module.css';
import Image from "next/image";
import { marked } from 'marked'; // Import the marked library
import Logo from "../../../public/profile/Logo.svg";

const renderer = new marked.Renderer();
renderer.image = (href, title, text) => {
    return `<img src="${href}" alt="${text}" title="${title}" style="max-width: 100%; height: auto;">`;
};

marked.setOptions({ renderer });

const AvatarAndName: React.FC<{ type: 'human' | 'ai' }> = ({ type }) => {
  const avatarSrc = type === 'human' ? '/profile/User.svg' : '/profile/Logo.svg';
  const name = type === 'human' ? 'You' : 'Fungi';
  return (
    <div className={styles.avatarNameRow}>
      <Image src={avatarSrc} alt={`${name} avatar`} width={40} height={40} />
      <span className={styles.name}>{name}</span>
    </div>
  );
};

const ChatDisplay: React.FC<{ chatHistory: any[] }> = ({ chatHistory }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const containerClass = chatHistory.length > 0 ? `${styles.chatContainer} ${styles.scrolling}` : styles.chatContainer;
  const nonSystemMessages = chatHistory.filter((msg) => msg?.lc_id?.[2] !== 'SystemMessage');

  const renderMessage = (msg, index) => {
    const messageType = msg?.lc_id?.[2];
    const content = msg?.content || 'Unknown message format';

    // Define messageStyle based on messageType
    const messageStyle = messageType === 'HumanMessage' ? styles.humanMessage : styles.aiMessage;

    // Parse Markdown content for AI messages
    const htmlContent = messageType === 'AIMessage' ? marked(content) : content;

    return (
      <div key={index} className={`${styles.message} ${messageStyle}`}>
        <div className={styles.avatarAndNameContainer}>
          <AvatarAndName type={messageType === 'HumanMessage' ? 'human' : 'ai'} />
        </div>
        <div className={styles.messageContentContainer}>
          {messageType === 'AIMessage' ? (
            <span className={styles.messageContent} dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <span className={styles.messageContent}>{htmlContent}</span>
          )}
        </div>
        {index === nonSystemMessages.length - 1 && <div ref={endOfMessagesRef} />}
      </div>
    );
};


  const renderPlaceholder = () => {
    return (
      <div className="col-span-3 flex items-center justify-center flex-col">
        <Image width={150} height={150} alt="Logo" src={Logo.src} aria-hidden="true" />
        <h1 className="text-3xl">Hi, I'm Fungi! your DeFi Friend</h1>
      </div>
    );
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
