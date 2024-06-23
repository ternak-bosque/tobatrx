"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import AppProvider from "./context";

const client = new QueryClient();

export function Providers({ children }) {
    return (
        <QueryClientProvider client={client}>
            <AppProvider>
                {children}
            </AppProvider>
        </QueryClientProvider>
    );
}
