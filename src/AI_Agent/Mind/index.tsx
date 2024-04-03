// Import the necessary class
import { ChatBotCreation } from '../ChatBotCreation'; // Adjust the path as necessary

class Mind {
  private chatBot: ChatBotCreation;

  constructor() {
    // Initialize ChatBotCreation when a new instance of Mind is created
    this.chatBot = new ChatBotCreation();
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
    return await this.chatBot.getHistory();
  }

  public async clearChatHistory(): Promise<void> {
    await this.chatBot.clearHistory();
  }
}

export { Mind };
