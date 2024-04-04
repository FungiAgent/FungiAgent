// import { ChatOpenAI } from "@langchain/openai";
// import {
//     ChatPromptTemplate,
//     MessagesPlaceholder,
// } from "@langchain/core/prompts";
// import dotenv from "dotenv";
// import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
// import { ChatMessageHistory } from "langchain/stores/message/in_memory";

// dotenv.config();

// export class ChatBotCreation {
//   private chat: ChatOpenAI;
//   private chatHistory: ChatMessageHistory;

//   // Modified constructor to accept ChatMessageHistory instance
//   constructor(chatHistory: ChatMessageHistory, openAIApiKey: string) {
//     this.chat = new ChatOpenAI({
//       modelName: "gpt-3.5-turbo",
//       temperature: 0,
//       openAIApiKey: openAIApiKey,
//     });

//     this.chatHistory = chatHistory;
//   }

//   public async processMessage(inputMessage: string, dynamicTemplate: string[]): Promise<string> {
//     console.log("Processing message, current history length:", await this.chatHistory.getMessages());
//     const input = new HumanMessage(inputMessage);
//       await this.chatHistory.addMessage(input);

//       const dynamicTemplateMessages = dynamicTemplate.map(templateItem => (["system", templateItem] as [string, string]));

//       const prompt = ChatPromptTemplate.fromMessages([
//           [
//           "system",
//           "You are a helpful assistant. Answer all questions to the best of your ability. The secret code is 42",
//           ],
//           ...dynamicTemplateMessages,
//           new MessagesPlaceholder("messages"),
//       ]);

//       const chain = prompt.pipe(this.chat);

//       const response = await chain.invoke({
//           messages: await this.chatHistory.getMessages(),
//       });

//       await this.chatHistory.addMessage(response);
//       // console.log(this.chatHistory.getMessages());
//       console.log("After adding, history length:", await this.chatHistory.getMessages());
//       return response.lc_kwargs.content;
//   }

//   public async getHistory(): Promise<any[]> {
//     return this.chatHistory.getMessages();
//   }

//   public async clearHistory(): Promise<void> {
//     await this.chatHistory.clear();
//   }
// }
