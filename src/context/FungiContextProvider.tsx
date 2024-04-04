import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MagicSigner } from "@alchemy/aa-signers/magic";
import { AlchemyMultichainClient } from "@/lib/alchemy/AlchemyMultichainClient";
import {
  getProviderMultichainSetting,
  getProviderDefaultSettings,
} from "@/config/alchemyConfig";
import { Alchemy } from "alchemy-sdk";
import { ARBITRUM } from "@/config/chains";
import { getApiKeyChain } from "@/config/alchemyConfig";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { getViemChain } from "@/config/chains";
import { MagicMultichainClient } from "@/lib/magic/MagicMultichainClient";
import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
// import { useUserOperations } from '@/hooks/useUserOperations';
// import { ChatHistoryProvider } from "@/AI_Agent/Context/ChatHistoryContext";

import { type Address, type SmartAccountSigner } from "@alchemy/aa-core";
// Types
import { FungiContextType } from "./types";

export const FungiContext = createContext({} as FungiContextType);

export function useGlobalContext() {
  return useContext(FungiContext) as FungiContextType;
}

// Provider
export function FungiContextProvider({ children }: { children: ReactNode }) {
  const [alchemyMultichainClient, setAlchemyMultichainClient] =
    useState<AlchemyMultichainClient>();
  const [magicMultichainClient, setMagicMultichainClient] =
    useState<MagicMultichainClient>();

  const [alchemyClient, setAlchemyClient] = useState<Alchemy>();
  const [alchemyScaProvider, setAlchemyScaProvider] =
    useState<AlchemySmartAccountClient>();
  const [magicClient, setMagicClient] =
    useState<Promise<MagicSigner | undefined>>();

  const [scaAddress, setScaAddress] = useState<Address>();
  const [chain, setChain] = useState(ARBITRUM);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Batch operations
  // BatchContext
  // const [batchedOperations, setBatchedOperations] = useState<any[]>([]);
  // const { sendUserOperations } = useUserOperations();

  // const addOperationToBatch = useCallback((operation: any) => {
  //   setBatchedOperations(prev => [...prev, operation]);
  //   // console.log("Batched operations", batchedOperations);
  // }, []);

  // const executeBatchedOperations = useCallback(async (): Promise<string | undefined> => {
  //   if (batchedOperations.length > 0) {
  //     const txHash = await sendUserOperations(batchedOperations); // Sending the list of operations
  //     setBatchedOperations([]);
  //     return txHash;
  //   }
  //   return undefined;
  // }, [batchedOperations, sendUserOperations]);


  useEffect(() => {
    const defaultAlchemySettings = getProviderDefaultSettings(ARBITRUM);
    const overridesAlchemySettings = getProviderMultichainSetting();
    const multichainProv = new AlchemyMultichainClient(
      defaultAlchemySettings,
      overridesAlchemySettings
    );
    setAlchemyMultichainClient(multichainProv);

    setAlchemyClient(
      multichainProv?.forNetwork(chain) || multichainProv?.forNetwork(ARBITRUM)
    );

    const magicMultichain = new MagicMultichainClient();
    setMagicMultichainClient(magicMultichain);
    setMagicClient(magicMultichain.forNetwork(ARBITRUM));
  }, []);

  useEffect(() => {
    if (chain) {
      if (alchemyMultichainClient) {
        setAlchemyClient(
          alchemyMultichainClient?.forNetwork(chain) ||
            alchemyMultichainClient?.forNetwork(ARBITRUM)
        );
        /*setAlchemyScaProvider(
          alchemyMultichainClient?.forNetworkScProvider(chain)
        );*/
      }

      if (magicMultichainClient) {
        const magicForNetwork = magicMultichainClient.forNetwork(chain);
        if (magicForNetwork) {
          setMagicClient(magicForNetwork);
          (async () => {
            await login();
          })();
        }
      }
    }
  }, [chain]);


  const connectProviderToAccount = useCallback(
    async (signer: SmartAccountSigner) => {
      const connectedProvider = await createModularAccountAlchemyClient({
        apiKey: getApiKeyChain(chain),
        chain: getViemChain(chain),
        signer,
      });

      setAlchemyScaProvider(connectedProvider);

      return connectedProvider;
    },
    [alchemyScaProvider, chain]
  );

  //TODO ya no sirve?
  const disconnectProviderFromAccount = useCallback(() => {
    if (!alchemyScaProvider) {
      return;
    }
    const disconnectedProvider = alchemyScaProvider;

    setAlchemyScaProvider(disconnectedProvider);
    return disconnectedProvider;
  }, [alchemyScaProvider]);

  const login = useCallback(async () => {
    const signer = await magicClient;

    if (signer == null) {
      throw new Error("Magic not initialized");
    }

    await signer.authenticate({
      authenticate: async () => {
        await signer.inner.wallet.connectWithUI();
      },
    });

    const connectedProvider = await connectProviderToAccount(signer as SmartAccountSigner);

    let signerAddress;
    (async () => {
      signerAddress = await signer.getAddress();
    })();

    setScaAddress(connectedProvider?.getAddress());
    setIsConnected(true);
  }, [magicClient, connectProviderToAccount, alchemyScaProvider]);

  const logout = useCallback(async () => {
    const signer = await magicClient;

    if (!signer) {
      return;
    }

    if (!(await signer.inner.user.logout())) {
      throw new Error("Magic logout failed");
    }

    setIsConnected(false);
    disconnectProviderFromAccount();
    setScaAddress(undefined);
  }, [magicClient, disconnectProviderFromAccount]);

  const switchNetwork = useCallback((chainId: number) => {
    setChain(chainId);
  }, []);

  const state: FungiContextType = useMemo(() => {
    return {
      alchemyClient,
      alchemyScaProvider,
      scaAddress,
      chain,
      switchNetwork,
      isLoading,
      isConnected,
      login,
      logout
    };
  }, [
    alchemyClient,
    scaAddress,
    switchNetwork,
    login,
    alchemyScaProvider,
    chain,
    isLoading,
    isConnected,
    logout
  ]);

  return (
    <FungiContext.Provider value={state}>{children}</FungiContext.Provider>
  );
}
