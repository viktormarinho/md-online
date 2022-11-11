import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import { AppRoutes } from "./Routes";
import { trpc } from "./utils/trpc";

const getSession = () => {
    return "Bearer " + sessionStorage.getItem('sessionId')
}


export function AppRoot() {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            loggerLink(),
            httpBatchLink({ url: 'http://localhost:3000/trpc', headers: () => ({ authorization: getSession() }) })
        ]
    }));

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <AppRoutes />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </trpc.Provider>
    )
}