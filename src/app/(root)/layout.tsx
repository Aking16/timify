import { SidebarDemo } from "@/components/sidebar-example";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarDemo>{children}</SidebarDemo>;
}
