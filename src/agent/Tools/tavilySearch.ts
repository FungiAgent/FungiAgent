import { stringify } from "querystring";
import dotenv from "dotenv";

dotenv.config();

// Assuming `addMessage` is passed in as a callback function to handle adding messages to chat history
export const tavilySearch = async ({
    query,
    searchDepth = "basic",
    includeImages = false,
    includeAnswer = false,
    includeRawContent = false,
    maxResults = 5,
    includeDomains = [],
    excludeDomains = [],
}) => {
    try {
        const apiKey = process.env.TAVILY_API_KEY;
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                api_key: apiKey,
                query,
                search_depth: searchDepth,
                include_images: includeImages,
                include_answer: includeAnswer,
                include_raw_content: includeRawContent,
                max_results: maxResults,
                include_domains: includeDomains,
                exclude_domains: excludeDomains,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Tavily search results:", result);

        return result;
    } catch (error) {
        console.error("Error performing Tavily search:", error);
        // Add a message indicating an error during the fetch process
        throw error; // Rethrow to allow caller to handle
    } finally {
        // Handle any cleanup here
        console.log("Tavily search completed");
    }
};
