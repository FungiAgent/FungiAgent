import { useState, useMemo } from 'react';
import { dataClient } from '@rss3/js-sdk';
import { useChatHistory } from '@/context/ChatHistoryContext';
import { SystemMessage } from '@langchain/core/messages';

export const useRSS3Activities = () => {
    const [fetchedData, setFetchedData] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const { addMessage } = useChatHistory();

    const fetchActivities = useMemo(() => {
        // This is the async function we will return from useMemo
        return async (params: { account: string; network?: string[]; direction?: string; tag?: string[]; type?: string[]; limit?: number; since_timestamp?: number; until_timestamp?: number; status?: string[] }) => {
            setLoading(true);
            try {
                const activities = await dataClient().activities(params.account, {
                    network: params.network as ("arbitrum_nova" | "arbitrum_one" | "arweave" | "avalanche" | "base" | "binance_smart_chain" | "crossbell" | "erc1577" | "ethereum" | "farcaster" | "gnosis" | "optimism" | "polygon" | "zksync_lite")[] | undefined,
                    direction: (params.direction === "in" || params.direction === "out") ? params.direction : undefined,
                    tag: params.tag as (any),
                    type: params.type as (any),
                    limit: 2,
                    since_timestamp: params.since_timestamp,
                    until_timestamp: params.until_timestamp,
                    status: params.status as ("failed" | "successful" | undefined),
                });
                // console.log('RSS3 data:', activities.data);
                const activitiesStr = JSON.stringify(activities.data);
                setFetchedData(activitiesStr);
                console.log('RSS3 data string:', activitiesStr);

                // Optionally add a message right after fetching
                await addMessage(new SystemMessage(`Fetching data: ${activitiesStr}`));

                return activitiesStr; // You can return the stringified data if needed
            } catch (error) {
                console.error('Error fetching RSS3 data:', error);
                setError(error as Error);

                // Optionally add an error message to chat history
                await addMessage(new SystemMessage(`Error fetching RSS3 data. ${error}`));
                
                throw error; // Rethrow to allow caller to handle
            } finally {
                setLoading(false);
            }
        };
    }, [addMessage]); // addMessage is stable and shouldn't change, but it's listed as a dependency to adhere to hooks rules

    return { fetchActivities, fetchedData, loading, error };
};
