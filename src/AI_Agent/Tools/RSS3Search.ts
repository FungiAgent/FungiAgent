import { dataClient } from '@rss3/js-sdk';
import { SystemMessage } from '@langchain/core/messages';

type RSS3SearchParams = {
    account: string;
    network?: string[];
    direction?: "in" | "out";
    tag?: string[];
    type?: string[];
    limit?: number;
    since_timestamp?: number;
    until_timestamp?: number;
    status?: ("failed" | "successful")[];
};

type RSS3SearchCallbacks = {
    onLoading: (loading: boolean) => void;
    onResult: (data: string) => void;
    onError: (error: Error) => void;
    // addMessage: (message: SystemMessage) => Promise<void>;
};

export async function RSS3Search(params: RSS3SearchParams, callbacks: RSS3SearchCallbacks): Promise<string> {
    const { onLoading, onResult, onError } = callbacks;

    onLoading(true);
    try {
        const activities = await dataClient().activities(params.account, {
            network: params.network as ("arbitrum_nova" | "arbitrum_one" | "arweave" | "avalanche" | "base" | "binance_smart_chain" | "crossbell" | "erc1577" | "ethereum" | "farcaster" | "gnosis" | "optimism" | "polygon" | "zksync_lite")[] | undefined,
            direction: params.direction,
            tag: params.tag as (any),
            type: params.type as (any),
            limit: params.limit || 2,
            since_timestamp: params.since_timestamp,
            until_timestamp: params.until_timestamp,
            status: params.status as ("failed" | "successful" | undefined),
        });
        
        const activitiesStr = JSON.stringify(activities.data);
        onResult(activitiesStr);
        console.log('RSS3 data string:', activitiesStr);

        // await addMessage(new SystemMessage(`Fetching data: ${activitiesStr}`));
        return activitiesStr;
    } catch (error) {
        console.error('Error fetching RSS3 data:', error);
        onError(error as Error);
        // await addMessage(new SystemMessage(`Error fetching RSS3 data. ${error}`));
        throw error;
    } finally {
        onLoading(false);
    }
}

