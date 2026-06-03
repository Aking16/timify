import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

describe("useIsMobile", () => {
  let listeners: Array<() => void>;
  // Track created matchMedia instances to spy on removeEventListener
  let createdMqlInstances: Array<{ removeEventListener: (...args: unknown[]) => void }>;

  beforeEach(() => {
    listeners = [];
    createdMqlInstances = [];

    const matchMediaMock = (query: string) => {
      const mql = {
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addEventListener: (_event: string, listener: () => void) => {
          listeners.push(listener);
        },
        removeEventListener: (_event: string, listener: () => void) => {
          listeners = listeners.filter((l) => l !== listener);
        },
        dispatchEvent: () => false,
      };
      createdMqlInstances.push(mql);
      return mql;
    };

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    listeners = [];
    createdMqlInstances = [];
  });

  it("returns false for desktop viewport (width >= 768)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true for mobile viewport (width < 768)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 375,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false for tablet breakpoint (width = 768)", () => {
    // The breakpoint is max-width: 767px, so 768 should be desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 768,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("updates when viewport changes from desktop to mobile", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    const { result, rerender } = renderHook(() => useIsMobile());

    // Initially desktop
    expect(result.current).toBe(false);

    // Simulate resize to mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 375,
    });

    // Trigger the matchMedia change listener
    act(() => {
      listeners.forEach((l) => l());
    });

    // Rerender to pick up new state
    rerender();
    expect(result.current).toBe(true);
  });

  it("updates when viewport changes from mobile to desktop", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 375,
    });

    const { result, rerender } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);

    // Simulate resize to desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1440,
    });

    act(() => {
      listeners.forEach((l) => l());
    });

    rerender();
    expect(result.current).toBe(false);
  });

  it("cleans up event listener on unmount", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    const { unmount } = renderHook(() => useIsMobile());

    // Spy on the last created mql instance's removeEventListener
    const lastMql = createdMqlInstances[createdMqlInstances.length - 1];
    const removeEventListenerSpy = vi.spyOn(lastMql, "removeEventListener");

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
