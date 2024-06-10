import { useState, useMemo } from "react";
import { useChatHistory } from "@/context/ChatHistoryContext";
import { SystemMessage } from "@langchain/core/messages";
import { stringify } from "querystring";

export const useTavilySearch = (apiKey) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const { addMessage } = useChatHistory();

    const search = useMemo(() => {
        return async ({
            query,
            searchDepth = "basic",
            includeImages = false,
            includeAnswer = false,
            includeRawContent = false,
            maxResults = 5,
            includeDomains = [],
            excludeDomains = [],
        }) => {
            setLoading(true);
            setError(null);
            try {
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
                setResults(result);
                console.log("Tavily search results:", result);

                // Add a message indicating successful data fetching
                await addMessage(
                    new SystemMessage(`Fetched results: ${stringify(result)}`),
                );

                return result;
            } catch (error) {
                console.error("Error performing Tavily search:", error);
                setError(error);
                // Add a message indicating an error during the fetch process
                await addMessage(
                    new SystemMessage(`Error performing search: ${error}`),
                );
                throw error; // Rethrow to allow caller to handle
            } finally {
                setLoading(false);
            }
        };
    }, [addMessage, apiKey]); // Include apiKey if it's dynamic and passed as a prop or context

    return { search, results, loading, error };
};
