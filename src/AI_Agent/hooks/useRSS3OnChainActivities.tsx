import { useState, useEffect } from 'react';
import axios from 'axios';

interface Activity {
    // Define the structure based on the RSS3 API response
}

interface UseRSS3OnChainActivitiesParams {
    account: string;
    limit?: number;
    action_limit?: number;
    cursor?: string;
    since_timestamp?: number;
    until_timestamp?: number;
    status?: string; // Adjust the type according to your needs
    direction?: string; // Adjust the type according to your needs
    network?: string[];
    tag?: string[];
    type?: string[];
    platform?: string[];
}

interface UseRSS3OnChainActivitiesReturn {
    activities: Activity[] | null;
    isLoading: boolean;
    error: Error | null;
}

export const useRSS3OnChainActivities = ({
    account,
    limit,
    action_limit,
    cursor,
    since_timestamp,
    until_timestamp,
    status,
    direction,
    network,
    tag,
    type,
    platform,
}: UseRSS3OnChainActivitiesParams): UseRSS3OnChainActivitiesReturn => {
    const [activities, setActivities] = useState<Activity[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://testnet.rss3.io/data/accounts/${account}/activities`, {
                    params: {
                        limit,
                        action_limit,
                        cursor,
                        since_timestamp,
                        until_timestamp,
                        status,
                        direction,
                        network: network?.join(','),
                        tag: tag?.join(','),
                        type: type?.join(','),
                        platform: platform?.join(','),
                    },
                    headers: { accept: 'application/json' },
                });

                setActivities(response.data); // Adjust this based on the structure of the response
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [account, limit, action_limit, cursor, since_timestamp, until_timestamp, status, direction, network, tag, type, platform]);

    return { activities, isLoading, error };
};
