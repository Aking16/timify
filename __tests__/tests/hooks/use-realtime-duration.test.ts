import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mock ahooks useInterval - we control timer cleanup manually
vi.mock("ahooks", () => ({
  useInterval: (callback: () => void, delay: number | undefined) => {
    if (delay !== undefined && delay !== null) {
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }
    return undefined;
  },
}));

import { useRealtimeDuration } from "@/hooks/use-realtime-duration";

describe("useRealtimeDuration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns formatted duration string when isRunning is true", () => {
    const startTime = new Date(Date.now() - 3600000); // 1 hour ago
    const { result } = renderHook(() => useRealtimeDuration(startTime, true));

    expect(result.current).toBeTruthy();
    expect(typeof result.current).toBe("string");
  });

  it("returns formatted '0:00' when isRunning is false and no staticDuration", () => {
    const { result } = renderHook(() => useRealtimeDuration(null, false));

    // formatDuration(0) = "0:00"
    expect(result.current).toBe("0:00");
  });

  it("uses staticDuration when isRunning is false and staticDuration is provided", () => {
    const { result } = renderHook(() => useRealtimeDuration(null, false, 3661));

    // 3661 seconds = 1:01:01
    expect(result.current).toBe("1:01:01");
  });

  it("updates when staticDuration prop changes", () => {
    const { result, rerender } = renderHook(
      ({ staticDuration }) => useRealtimeDuration(null, false, staticDuration),
      { initialProps: { staticDuration: 60 } },
    );

    expect(result.current).toBe("1:00");

    rerender({ staticDuration: 3600 });
    expect(result.current).toBe("1:00:00");
  });

  it("updates duration over time when running", () => {
    const fixedNow = new Date("2025-01-15T10:00:00Z");
    vi.setSystemTime(fixedNow);

    const startTime = new Date(fixedNow.getTime() - 300000); // 5 minutes ago
    const { result } = renderHook(() => useRealtimeDuration(startTime, true));

    // Initial: 5 minutes = "5:00"
    expect(result.current).toBe("5:00");

    // Advance time by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Should now be 5:10
    expect(result.current).toBe("5:10");
  });

  it("handles null staticDuration gracefully", () => {
    const { result } = renderHook(() => useRealtimeDuration(null, false, null));

    expect(result.current).toBe("0:00");
  });

  it("handles undefined staticDuration gracefully", () => {
    const { result } = renderHook(() => useRealtimeDuration(null, false));

    expect(result.current).toBe("0:00");
  });

  it("switches from running to stopped state", () => {
    const fixedNow = new Date("2025-01-15T10:00:00Z");
    vi.setSystemTime(fixedNow);

    const startTime = new Date(fixedNow.getTime() - 300000); // 5 minutes ago
    const { result, rerender } = renderHook(
      ({ isRunning, staticDuration }) => useRealtimeDuration(startTime, isRunning, staticDuration),
      { initialProps: { isRunning: true, staticDuration: undefined } },
    );

    expect(result.current).toBe("5:00");

    // Stop the timer with a static duration
    rerender({ isRunning: false, staticDuration: 600 }); // 10 minutes
    expect(result.current).toBe("10:00");
  });

  it("starts as stopped with staticDuration and keeps it running", () => {
    const fixedNow = new Date("2025-01-15T10:00:00Z");
    vi.setSystemTime(fixedNow);

    const startTime = new Date(fixedNow.getTime() - 120000); // 2 minutes ago
    const { result } = renderHook(() => useRealtimeDuration(startTime, false, 120));

    // When isRunning is false and staticDuration is provided, should use staticDuration
    expect(result.current).toBe("2:00");
  });
});
