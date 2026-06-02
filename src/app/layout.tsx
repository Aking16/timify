import { iranSansX } from "@/constants/fonts";
import Providers from "@/context/providers";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "Timify",
  description: "Made with <3 by Aking",
  appleWebApp: {
    title: "Timify",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      dir="rtl"
      lang="fa-IR"
      className={cn("h-full", "antialiased", iranSansX.variable, "font-iransanx")}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <main className="pb-20 md:pb-0">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
