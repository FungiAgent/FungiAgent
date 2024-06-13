// BatchContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useUserOperations } from "@/hooks/useUserOperations";
import { AlchemyModularAccountClientConfig } from "@alchemy/aa-alchemy";

interface BatchContextType {
    batchedOperations: any[];
    addOperationToBatch: (operation: any) => void;
    executeBatchedOperations: (
        provider: AlchemyModularAccountClientConfig,
    ) => Promise<string | undefined>;
}

const BatchContext = createContext<BatchContextType>(null!);

export const useBatchContext = () => useContext(BatchContext);

// BatchProvider.tsx
export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [batchedOperations, setBatchedOperations] = useState<any[]>([]);
    const { sendUserOperations } = useUserOperations();

    const addOperationToBatch = (operation: any) => {
        setBatchedOperations((prev) => [...prev, operation]);
    };

    const executeBatchedOperations = async (): Promise<string | undefined> => {
        if (batchedOperations.length > 0) {
            const txHash = await sendUserOperations(batchedOperations); // Sending the list of operations
            setBatchedOperations([]);
            // @ts-expect-error
            return txHash;
        }
        return undefined;
    };

    return (
        <BatchContext.Provider
            value={{
                batchedOperations,
                addOperationToBatch,
                executeBatchedOperations,
            }}
        >
            {children}
        </BatchContext.Provider>
    );
};
