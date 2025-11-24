"use client";

import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/lib/theme";
import createEmotionCache from "@/lib/mui/createEmotionCache";
import { ReactNode } from "react";

interface MuiProviderProps {
  children: ReactNode;
  emotionCache?: EmotionCache; // <- здесь TypeScript поймёт
}

const clientSideEmotionCache = createEmotionCache();

export default function MuiProvider({ children, emotionCache }: MuiProviderProps) {
  const cache = emotionCache || clientSideEmotionCache;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}