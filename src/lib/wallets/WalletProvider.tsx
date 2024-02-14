import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, arbitrumGoerli, mainnet, polygon, polygonMumbai, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { UniversalWalletConnector } from "@magiclabs/wagmi-connector";
import { AlchemyAccountKitProvider } from "./AlchemyAccountKitProvider";
import { getRpcUrl } from "@/utils/gmx/config/chains";


export default function WalletProvider({ children }) {

    const { chains, publicClient, webSocketPublicClient } = configureChains(
        [mainnet, arbitrum, arbitrumGoerli, polygon, polygonMumbai, sepolia],
        [publicProvider()]
    );

    const config = createConfig({
        autoConnect: true,
        publicClient,
        webSocketPublicClient,
        connectors: [
            new UniversalWalletConnector(
                {
                    chains,
                    options: {
                        apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY!,
                        networks: [
                            {
                                chainId: sepolia.id,
                                rpcUrl: getRpcUrl(sepolia.id)!
                            },
                            {
                                chainId: arbitrum.id,
                                rpcUrl: getRpcUrl(arbitrum.id)!
                            },
                            {
                                chainId: mainnet.id,
                                rpcUrl: getRpcUrl(mainnet.id)!
                            },
                            {
                                chainId: arbitrumGoerli.id,
                                rpcUrl: getRpcUrl(arbitrumGoerli.id)!
                            },
                            {
                                chainId: polygon.id,
                                rpcUrl: getRpcUrl(polygon.id)!
                            },
                            {
                                chainId: polygonMumbai.id,
                                rpcUrl: getRpcUrl(polygonMumbai.id)!
                            }
                        ]
                    }
                }
            ),
        ],
    })

    return (
        <WagmiConfig config={config}>
            <AlchemyAccountKitProvider>
                {children}
            </AlchemyAccountKitProvider>
        </WagmiConfig>
    );
}