import React from "react";
import { ConnectButton, lightTheme } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";
import { useGlobalContext } from "@/context/NewGlobalContext";

const client = createThirdwebClient({
    clientId: process.env.THIRDWEB_CLIENT_ID as string,
});

const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    walletConnect(),
    inAppWallet({
        auth: {
            options: ["email", "google", "apple", "facebook", "phone"],
        },
    }),
];
export default function LoginButton() {
    const { setIsConnected, setAccountAddress } = useGlobalContext();

    return (
        <ConnectButton
            client={client}
            wallets={wallets}
            onConnect={(e) => {
                const account = e.getAccount();
                if (account) {
                    setIsConnected(true);
                    setAccountAddress(account.address);
                }
            }}
            onDisconnect={() => {
                setIsConnected(false);
                setAccountAddress("");
            }}
            theme={lightTheme({
                colors: {
                    accentText: "#514AF3",
                    accentButtonBg: "#514AF3",
                    primaryButtonBg: "#514AF3",
                },
            })}
            connectButton={{ label: "Log In" }}
            connectModal={{ size: "wide" }}
        />
    );
}
