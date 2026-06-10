import { SidebarLayout } from "@/components/sidebar/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarLayout>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span>تقویم</span>
        </div>
      </header>
      <main className="p-4">{children}</main>
    </SidebarLayout>
  );
}
