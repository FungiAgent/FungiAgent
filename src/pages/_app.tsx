// Next
import type { AppProps } from "next/app";
// Styles
import "@/styles/globals.css";
// Swr
import { SWRConfig } from "swr";
// Lib
import { swrGCMiddleware } from "@/lib/swrMiddlewares";
// Context
import { FungiContextProvider } from "@/context/FungiContextProvider";
import { NotificationContextProvider } from "@/context/NotificationContextProvider";
import { ModalContextProvider } from "@/context/ModalContextProvider";
import { ChatHistoryProvider } from "@/context/ChatHistoryContext";
import { UserOpProvider } from "@/context/UserOpContext";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <main>
      {" "}
      <ChatHistoryProvider>
        <FungiContextProvider>
          <UserOpProvider>
            <SWRConfig
              value={{
                refreshInterval: 50000,
                refreshWhenHidden: false,
                refreshWhenOffline: false,
                use: [swrGCMiddleware as any],
              }}
            >
                  <NotificationContextProvider>
                    <ModalContextProvider>
                          <Component {...pageProps} />
                    </ModalContextProvider>
                  </NotificationContextProvider>
            </SWRConfig>
          </UserOpProvider>
        </FungiContextProvider>
      </ChatHistoryProvider>
      <script
        async
        src="/charting_library/charting_library.standalone.js"
      ></script>
    </main>
  );
}
