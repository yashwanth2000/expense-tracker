"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

function RootProviders({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
export default RootProviders;
