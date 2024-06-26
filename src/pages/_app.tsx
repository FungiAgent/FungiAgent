import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@fontsource/dm-sans";
import { ThirdwebProvider } from "thirdweb/react";
import { FungiGlobalContextProvider } from "@/context/NewGlobalContext";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
    return (
        <main>
            <QueryClientProvider client={queryClient}>
                <ThirdwebProvider>
                    <FungiGlobalContextProvider>
                        <Component {...pageProps} />
                    </FungiGlobalContextProvider>
                </ThirdwebProvider>
            </QueryClientProvider>
            <script
                async
                src="/charting_library/charting_library.standalone.js"
            ></script>
        </main>
    );
}
