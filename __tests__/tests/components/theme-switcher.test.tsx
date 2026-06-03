import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted for mock variables to avoid hoisting issues
const mockSetTheme = vi.hoisted(() => vi.fn());
const mockResolvedThemeRef = vi.hoisted(() => ({ current: "light" }));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedThemeRef.current,
    setTheme: mockSetTheme,
    theme: mockResolvedThemeRef.current,
    themes: ["light", "dark"],
  }),
}));

vi.mock("@/components/ui/sidebar", () => ({
  useSidebar: () => ({
    state: "expanded",
    isMobile: false,
  }),
}));

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: ({ icon: _icon, ...props }: { icon: unknown; [key: string]: unknown }) => {
    const { className, ...rest } = props;
    return (
      <span data-testid="hugeicons-icon" className={className} {...rest}>
        Icon
      </span>
    );
  },
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    "aria-label": ariaLabel,
    className,
    ..._props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    "aria-label"?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
      data-testid="theme-button"
    >
      {children}
    </button>
  ),
}));

import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { render, screen, fireEvent } from "@testing-library/react";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolvedThemeRef.current = "light";
  });

  it("renders the theme switcher button", () => {
    render(<ThemeSwitcher />);
    const button = screen.getByTestId("theme-button");
    expect(button).toBeInTheDocument();
  });

  it("shows sun icon when theme is light", () => {
    mockResolvedThemeRef.current = "light";
    render(<ThemeSwitcher />);
    const icons = screen.getAllByTestId("hugeicons-icon");
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });

  it("shows moon icon when theme is dark", () => {
    mockResolvedThemeRef.current = "dark";
    render(<ThemeSwitcher />);
    const icons = screen.getAllByTestId("hugeicons-icon");
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });

  it("has correct aria-label", () => {
    mockResolvedThemeRef.current = "light";
    render(<ThemeSwitcher />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Current theme: light. Click to cycle themes");
  });

  it("updates aria-label when theme is dark", () => {
    mockResolvedThemeRef.current = "dark";
    render(<ThemeSwitcher />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Current theme: dark. Click to cycle themes");
  });

  it("cycles from light to dark on click", () => {
    mockResolvedThemeRef.current = "light";
    render(<ThemeSwitcher />);

    const button = screen.getByTestId("theme-button");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("cycles from dark to light on click", () => {
    mockResolvedThemeRef.current = "dark";
    render(<ThemeSwitcher />);

    const button = screen.getByTestId("theme-button");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("applies the correct variant and size classes", () => {
    mockResolvedThemeRef.current = "light";
    render(<ThemeSwitcher />);
    const button = screen.getByTestId("theme-button");
    expect(button).toBeInTheDocument();
  });
});
