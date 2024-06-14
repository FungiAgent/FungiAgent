import React, { useRef, useEffect } from "react";
import styles from "./ChatDisplay.module.css";
import Image from "next/image";
import { marked } from "marked"; // Import the marked library
import Logo from "../../../public/profile/Logo.svg";

const renderer = new marked.Renderer();

renderer.image = (href, title, text) => {
    return `<img src="${href}" alt="${text}" title="${title}" style="max-width: 100%; height: auto;">`;
};

renderer.link = (href, title, text) => {
    return `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${text}</a>`;
};

marked.setOptions({ renderer });

const AvatarAndName: React.FC<{ type: "human" | "ai" }> = ({ type }) => {
    const avatarSrc =
        type === "human" ? "/profile/User.svg" : "/profile/Logo.svg";
    const name = type === "human" ? "You" : "Fungi";
    return (
        <div className="flex flex-row items-center  mb-[10px]">
            <div className="w-20 flex justify-center ">
                <Image
                    src={avatarSrc}
                    alt={`${name} avatar`}
                    width={40}
                    height={40}
                />
            </div>
            <p className="font-light text-sm">{name}</p>
        </div>
    );
};

const ChatDisplay: React.FC<{ chatHistory: any[] }> = ({ chatHistory }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory]);

    const containerClass =
        chatHistory.length > 0
            ? `${styles.chatContainer} ${styles.scrolling}`
            : styles.chatContainer;
    const nonSystemMessages = chatHistory.filter(
        (msg) => msg?.lc_id?.[2] !== "SystemMessage",
    );

    const renderMessage = (msg, index) => {
        const messageType = msg?.lc_id?.[2];
        const content = msg?.content || "Unknown message format";

        // Define messageStyle based on messageType

        // Parse Markdown content for AI messages
        const htmlContent =
            messageType === "AIMessage" ? marked(content) : content;

        return (
            <div key={index} className=" mb-[32px]">
                <AvatarAndName
                    type={messageType === "HumanMessage" ? "human" : "ai"}
                />
                <div className="flex flex-row">
                    <div className="ml-20 pr-5">
                        <span
                            className={styles.messageContent}
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </div>
                {index === nonSystemMessages.length - 1 && (
                    <div ref={endOfMessagesRef} />
                )}
            </div>
        );
    };

    const renderPlaceholder = () => {
        return (
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col items-center mt-4">
                    <Image src={Logo.src} alt="Logo" width={100} height={100} />
                    <p className="text-xxl">Welcome.</p>
                </div>
            </div>
        );
    };

    return (
        <div className={containerClass}>
            <div className={styles.messagesWrapper}>
                {nonSystemMessages.length === 0
                    ? renderPlaceholder()
                    : nonSystemMessages.map(renderMessage)}
            </div>
            {/* <button onClick={() => console.log({ chatHistory })}>
                Log History
            </button> */}
        </div>
    );
};

export default ChatDisplay;
