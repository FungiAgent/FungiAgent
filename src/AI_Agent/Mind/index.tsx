// Import the necessary class
import { ChatBotCreation } from '../ChatBotCreation'; // Adjust the path as necessary
import { ChatMessageHistory } from 'langchain/stores/message/in_memory'; // Adjust the path as necessary

class Mind {
  private chatBot: ChatBotCreation;
  private chatHistory: ChatMessageHistory;

  constructor(openAIApiKey: string) {
    this.chatHistory = new ChatMessageHistory();
    this.chatBot = new ChatBotCreation(this.chatHistory, openAIApiKey);
  }

  // Example method to process a message using ChatBotCreation
  public async processChatMessage(message: string, date: string, portfolio: string, scaAddress: `0x${string}` | undefined): Promise<string> {
    // Construct the dynamic template based on the current context
    const dynamicTemplate = [
        `Date: ${date}`,
        `Portfolio: ${portfolio}`,
        `SCA Address: ${scaAddress}`,
    ];

    const response = await this.chatBot.processMessage(message, dynamicTemplate);
    return response;
  }

  // You might also want to expose chat history and clearing history functionality
  public async getChatHistory(): Promise<any[]> {
    return await this.chatHistory.getMessages();
  }

  public async clearChatHistory(): Promise<void> {
    await this.chatHistory.clear();
  }
}

export { Mind };
