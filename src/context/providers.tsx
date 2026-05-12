import { DirectionProvider } from "@/components/ui/direction";
import React from "react";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DirectionProvider dir="rtl" direction="rtl">
      {children}
    </DirectionProvider>
  );
}
