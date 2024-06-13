import { useGlobalContext } from "@/context/FungiContextProvider";

export function useWallet() {
    const {
        login,
        scaAddress,
        switchNetwork,
        chain,
        logout,
        isLoading,
        isConnected,
    } = useGlobalContext();

    return {
        scAccount: scaAddress,
        login,
        logout,
        isConnected,
        isLoading,
        switchNetwork,
        chainId: chain,
    };
}

export default useWallet;
