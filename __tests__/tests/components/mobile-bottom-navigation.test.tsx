import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ..._props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} data-testid="nav-link">
      {children}
    </a>
  ),
}));

// Mock @hugeicons/react
vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: ({ icon: _icon, ...props }: { icon: unknown; [key: string]: unknown }) => (
    <span data-testid="hugeicons-icon" {...props}>
      Icon
    </span>
  ),
}));

// Mock the BottomStartTimer component
vi.mock("@/components/navigation/bottom-start-timer", () => ({
  BottomStartTimer: () => <div data-testid="bottom-start-timer">Timer</div>,
}));

// Mock buttonVariants to return a predictable class
vi.mock("@/components/ui/button", () => ({
  buttonVariants: ({ variant: _v }: { variant?: string }) => "button-variant-class",
}));

import MobileBottomNavigation from "@/components/navigation/mobile-bottom-navigation";

describe("MobileBottomNavigation", () => {
  it("renders all bottom navigation items", () => {
    render(<MobileBottomNavigation />);
    // The bottomNavItems has 4 items: داشبورد, همه پروژه‌ها, گزارش‌ها, برچسب‌ها
    expect(screen.getByText("داشبورد")).toBeInTheDocument();
    expect(screen.getByText("همه پروژه‌ها")).toBeInTheDocument();
    expect(screen.getByText("گزارش‌ها")).toBeInTheDocument();
    expect(screen.getByText("برچسب‌ها")).toBeInTheDocument();
  });

  it("renders correct number of navigation links", () => {
    render(<MobileBottomNavigation />);
    const links = screen.getAllByTestId("nav-link");
    // 4 nav items + no extra links
    expect(links).toHaveLength(4);
  });

  it("renders the bottom start timer component", () => {
    render(<MobileBottomNavigation />);
    expect(screen.getByTestId("bottom-start-timer")).toBeInTheDocument();
  });

  it("renders links with correct hrefs", () => {
    render(<MobileBottomNavigation />);
    const links = screen.getAllByTestId("nav-link");

    expect(links[0]).toHaveAttribute("href", "/app");
    expect(links[1]).toHaveAttribute("href", "/app/projects");
    expect(links[2]).toHaveAttribute("href", "/app/reports");
    expect(links[3]).toHaveAttribute("href", "/app/tags");
  });

  it("renders icons for each navigation item", () => {
    render(<MobileBottomNavigation />);
    const icons = screen.getAllByTestId("hugeicons-icon");
    // Each nav item has an icon
    expect(icons).toHaveLength(4);
  });

  it("has the correct container classes for mobile layout", () => {
    const { container } = render(<MobileBottomNavigation />);
    const navContainer = container.firstChild as HTMLElement;
    expect(navContainer.className).toContain("md:hidden");
    expect(navContainer.className).toContain("fixed");
    expect(navContainer.className).toContain("bottom-0");
  });
});
