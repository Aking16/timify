import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Use vi.hoisted for mock variables to avoid hoisting issues
const mockAuthClient = vi.hoisted(() => ({
  useSession: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: mockAuthClient,
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu-item">{children}</div>
  ),
  SidebarMenuButton: ({
    children,
    ..._props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <button data-testid="sidebar-menu-button">{children}</button>,
  useSidebar: () => ({
    isMobile: false,
    state: "expanded",
  }),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children, ..._props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarImage: ({ alt, ..._props }: { alt?: string; [key: string]: unknown }) => (
    <img data-testid="avatar-image" alt={alt || ""} />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="avatar-fallback">{children}</span>
  ),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({
    children,
    ..._props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-group">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    ..._props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-label">{children}</div>
  ),
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
}));

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: ({ icon: _icon, ...props }: { icon: unknown; [key: string]: unknown }) => (
    <span data-testid="hugeicons-icon" {...props}>
      Icon
    </span>
  ),
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className, ..._props }: { className?: string; [key: string]: unknown }) => (
    <div data-testid="skeleton" className={className}>
      Loading...
    </div>
  ),
}));

vi.mock("@/lib/auth-libs", () => ({
  handleLogout: vi.fn(),
}));

import SidebarProfile from "@/components/sidebar/sidebar-profile";

const mockSessionData = {
  data: {
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      image: null,
    },
    session: {
      id: "session-1",
      userId: "user-1",
      expiresAt: new Date(),
    },
  },
  isPending: false,
  error: null,
};

describe("SidebarProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthClient.useSession.mockReturnValue(mockSessionData);
  });

  it("renders user name from session", () => {
    render(<SidebarProfile />);
    // Name appears twice: in trigger button and in dropdown content
    const names = screen.getAllByText("John Doe");
    expect(names.length).toBe(2);
    expect(names[0]).toBeInTheDocument();
  });

  it("renders user email from session", () => {
    render(<SidebarProfile />);
    // Email appears twice: in trigger button and in dropdown content
    const emails = screen.getAllByText("john@example.com");
    expect(emails.length).toBe(2);
    expect(emails[0]).toBeInTheDocument();
  });

  it("shows skeleton when session is pending", () => {
    mockAuthClient.useSession.mockReturnValue({
      ...mockSessionData,
      isPending: true,
      data: undefined,
    });

    render(<SidebarProfile />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("shows error message when session has no data", () => {
    mockAuthClient.useSession.mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    });

    render(<SidebarProfile />);
    expect(screen.getByText("Error fetching user profile")).toBeInTheDocument();
  });

  it("renders avatar with user initials", () => {
    render(<SidebarProfile />);
    // Avatar fallback appears twice: in trigger button and in dropdown content
    const fallbacks = screen.getAllByTestId("avatar-fallback");
    expect(fallbacks.length).toBe(2);
    expect(fallbacks[0]).toHaveTextContent("Joh");
  });

  it("renders logout button", () => {
    render(<SidebarProfile />);
    expect(screen.getByText("خروج")).toBeInTheDocument();
  });

  it("renders profile menu item", () => {
    render(<SidebarProfile />);
    expect(screen.getByText("پروفایل")).toBeInTheDocument();
  });

  it("renders sidebar menu structure", () => {
    render(<SidebarProfile />);
    expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-menu-item")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-menu-button")).toBeInTheDocument();
  });
});
