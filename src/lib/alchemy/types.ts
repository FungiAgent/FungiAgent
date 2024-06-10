export interface Transaction {
    date: string;
    id: string;
    amount: number | null;
    from: string;
    to: string | null;
    status: string;
    tokenSymbol: string;
    receivedAmount?: number | null; // Add this line
    receivedTokenSymbol?: string; // Add this line
    operationType: string;
}

export interface TransactionDetails {
    hash: string;
    blockNumber: number;
    timestamp: number;
    from: string;
    to: string;
    value: string;
    gasUsed: string;
    gasPrice: string;
    input: string;
    receivedTokenSymbol: string;
    receivedAmount: string;
}
