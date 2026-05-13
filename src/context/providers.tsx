import React from "react";

import NextTopLoader from "nextjs-toploader";

import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "./theme-provider";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DirectionProvider dir="rtl" direction="rtl">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NextTopLoader />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </DirectionProvider>
  );
}
