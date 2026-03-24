"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { ReactNode, useState } from "react";
import theme from "@/lib/theme";
import { SocketProvider } from "@/contexts/SocketContext";
import { store } from "@/store";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <SocketProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </SocketProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}