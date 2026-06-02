import MobileBottomNavigation from "@/components/navigation/mobile-bottom-navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <MobileBottomNavigation />
    </div>
  );
}
