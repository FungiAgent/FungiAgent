import React from "react";
import useWallet from "@/hooks/useWallet";

export default function LoginButton() {
    const { login, isConnected, isLoading } = useWallet();

    return (
        <>
            <button
                onClick={() => login()}
                className="bg-main py-[9px]  font-bold text-white flex w-[160px] items-center justify-center text-[16px] rounded-[20px] shadow-lg"
            >
                {isLoading
                    ? "Loading..."
                    : isConnected
                      ? "Connecting..."
                      : "Log In"}
            </button>
        </>
    );
}
