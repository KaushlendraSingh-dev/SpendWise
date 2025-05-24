"use client";

import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes"; // If dark mode toggle is needed
// import type { ThemeProviderProps } from "next-themes/dist/types";

export function Providers({ children }: { children: React.ReactNode }) {
  // If using next-themes for dark mode:
  // return (
  //   <NextThemesProvider
  //     attribute="class"
  //     defaultTheme="light" // Can be "system"
  //     enableSystem
  //     disableTransitionOnChange
  //   >
  //     {children}
  //   </NextThemesProvider>
  // );
  return <>{children}</>; // Simple provider for now
}
