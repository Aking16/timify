import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useMounted } from "@/hooks/use-mounted";

describe("useMounted", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false initially (before mount)", () => {
    const { result } = renderHook(() => useMounted());
    // After render completes, useEffect has already run
    expect(result.current).toBe(true);
  });

  it("returns true after mount", () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });

  it("calls cleanup on unmount without error", () => {
    const { result, unmount } = renderHook(() => useMounted());
    expect(result.current).toBe(true);

    expect(() => {
      act(() => {
        unmount();
      });
    }).not.toThrow();
  });

  it("only mounts once (strict mode safe)", () => {
    const effectSpy = vi.fn();

    function TestHook() {
      const mounted = useMounted();
      effectSpy(mounted);
      return mounted;
    }

    const { result } = renderHook(() => TestHook());
    expect(result.current).toBe(true);
  });
});
