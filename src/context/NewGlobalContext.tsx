import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Account } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
export type FungiGlobalContextType = {
    isConnected: boolean;
    accountAddress: string;
    setIsConnected: (isConnected: boolean) => void;
    setAccountAddress: (accountAddress: string) => void;
};

export const FungiGlobalContext = createContext({} as FungiGlobalContextType);

export function useGlobalContext() {
    return useContext(FungiGlobalContext) as FungiGlobalContextType;
}

// FungiGlobalContextProvider.tsx
export function FungiGlobalContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const activeAccount = useActiveAccount();

    useEffect(() => {
        if (activeAccount) {
            setIsConnected(true);
            setAccountAddress(activeAccount.address);
        }
    }, [activeAccount]);
    const [accountAddress, setAccountAddress] = useState<string>("");
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const state: FungiGlobalContextType = useMemo(() => {
        return {
            isConnected,
            accountAddress,
            setAccountAddress,
            setIsConnected,
        };
    }, [isConnected, accountAddress, setAccountAddress, setIsConnected]);

    return (
        <FungiGlobalContext.Provider value={state}>
            {children}
        </FungiGlobalContext.Provider>
    );
}
