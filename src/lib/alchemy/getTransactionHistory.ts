import {
    Alchemy,
    Network,
    AssetTransfersParams,
    AssetTransfersResponse,
    AssetTransfersCategory,
    SortingOrder,
} from "alchemy-sdk";
import { Transaction } from "./types";

const alchemyConfig = {
    apiKey: process.env.BASE_API_KEY, // Ensure this is correctly set in your environment
    network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(alchemyConfig);

export const getTransactionHistory = async (
    address: string,
    pageKey?: string,
): Promise<{ transactions: Transaction[]; pageKey: string | undefined }> => {
    try {
        const params: AssetTransfersParams = {
            category: [AssetTransfersCategory.ERC20],
            order: "desc" as SortingOrder,
            maxCount: 20, // Fetch a larger number of transactions
            pageKey,
        };

        const outgoingParams = { ...params, fromAddress: address };
        const incomingParams = { ...params, toAddress: address };

        const [outgoingResponse, incomingResponse] = await Promise.all([
            alchemy.core.getAssetTransfers(outgoingParams),
            alchemy.core.getAssetTransfers(incomingParams),
        ]);

        const outgoingTransactions = outgoingResponse.transfers.map((tx) => ({
            date: new Date(
                parseInt(tx.blockNum, 16) * 1000,
            ).toLocaleDateString(),
            id: tx.hash,
            amount: tx.value ? parseFloat(tx.value.toString()) : 0,
            from: tx.from,
            to: tx.to || "",
            tokenSymbol: tx.asset ?? "",
            status: tx.uniqueId ? "Confirmed" : "Pending",
            operationType:
                tx.to &&
                tx.to.toLowerCase() ===
                    "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae"
                    ? "Swap"
                    : "Send",
        })) as Transaction[];

        const incomingTransactions = incomingResponse.transfers.map((tx) => ({
            date: new Date(
                parseInt(tx.blockNum, 16) * 1000,
            ).toLocaleDateString(),
            id: tx.hash,
            amount: tx.value ? parseFloat(tx.value.toString()) : 0,
            from: tx.from,
            to: tx.to || "",
            tokenSymbol: tx.asset ?? "",
            status: tx.uniqueId ? "Confirmed" : "Pending",
            operationType: "Received",
        })) as Transaction[];

        const transactions = [...outgoingTransactions, ...incomingTransactions];
        transactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        const pageKeyCombined =
            outgoingResponse.pageKey || incomingResponse.pageKey;

        return { transactions, pageKey: pageKeyCombined };
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return { transactions: [], pageKey: undefined };
    }
};
