import { describe, it, expect, vi, afterEach } from "vitest";

import { calculateDuration, formatDuration } from "@/lib/calculate-duration";

describe("formatDuration", () => {
  it('returns "0:00" for 0 seconds', () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("formats seconds under 1 minute correctly", () => {
    expect(formatDuration(45)).toBe("0:45");
  });

  it("pads single-digit minutes and seconds", () => {
    expect(formatDuration(5)).toBe("0:05");
  });

  it("formats exactly 1 minute", () => {
    expect(formatDuration(60)).toBe("1:00");
  });

  it("formats minutes and seconds correctly", () => {
    expect(formatDuration(125)).toBe("2:05");
  });

  it("formats exactly 1 hour", () => {
    expect(formatDuration(3600)).toBe("1:00:00");
  });

  it("formats hours, minutes, and seconds correctly", () => {
    expect(formatDuration(3661)).toBe("1:01:01");
  });

  it("pads hours with single digits correctly", () => {
    expect(formatDuration(3720)).toBe("1:02:00");
  });

  it("formats large durations", () => {
    expect(formatDuration(100000)).toBe("27:46:40");
  });

  it("handles negative seconds", () => {
    // The function currently doesn't handle negatives specially, just formats
    expect(formatDuration(-60)).toBe("-1:00");
  });
});

describe("calculateDuration", () => {
  const mockNow = new Date("2025-01-15T10:00:00Z");

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 when startTime is null", () => {
    expect(calculateDuration({ startTime: null, showFormatted: false })).toBe(0);
  });

  it("returns 0 when startTime is null with formatted output", () => {
    // Even with showFormatted=true, null startTime returns 0 (number)
    expect(calculateDuration({ startTime: null, showFormatted: true })).toBe(0);
  });

  it("calculates raw seconds when endTime is provided", () => {
    const startTime = new Date("2025-01-15T09:00:00Z");
    const endTime = new Date("2025-01-15T10:30:00Z");
    // 1 hour 30 min = 5400 seconds
    expect(calculateDuration({ startTime, endTime, showFormatted: false })).toBe(5400);
  });

  it("calculates formatted duration when endTime is provided", () => {
    const startTime = new Date("2025-01-15T09:00:00Z");
    const endTime = new Date("2025-01-15T10:30:00Z");
    expect(calculateDuration({ startTime, endTime, showFormatted: true })).toBe("1:30:00");
  });

  it("uses current time when endTime is not provided", () => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);

    // 1 hour difference
    const startTime = new Date("2025-01-15T09:00:00Z");
    const result = calculateDuration({ startTime, showFormatted: false });
    expect(result).toBe(3600);
  });

  it("returns formatted duration using current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);

    const startTime = new Date("2025-01-15T09:00:00Z");
    const result = calculateDuration({ startTime, showFormatted: true });
    expect(result).toBe("1:00:00");
  });

  it("handles exact hour boundaries", () => {
    const startTime = new Date("2025-01-15T09:00:00Z");
    const endTime = new Date("2025-01-15T12:00:00Z");
    expect(calculateDuration({ startTime, endTime, showFormatted: false })).toBe(10800); // 3 hours
    expect(calculateDuration({ startTime, endTime, showFormatted: true })).toBe("3:00:00");
  });

  it("handles very short durations (less than a second)", () => {
    // If startTime equals endTime, duration is 0
    const time = new Date("2025-01-15T09:00:00Z");
    expect(calculateDuration({ startTime: time, endTime: time, showFormatted: false })).toBe(0);
  });

  it("handles large durations (multiple days)", () => {
    const startTime = new Date("2025-01-01T00:00:00Z");
    const endTime = new Date("2025-01-15T00:00:00Z");
    // 14 days = 14 * 86400 = 1209600 seconds
    expect(calculateDuration({ startTime, endTime, showFormatted: false })).toBe(1209600);
    expect(calculateDuration({ startTime, endTime, showFormatted: true })).toBe("336:00:00");
  });

  it("returns number type when showFormatted is false", () => {
    const startTime = new Date("2025-01-15T09:00:00Z");
    const endTime = new Date("2025-01-15T10:00:00Z");
    const result = calculateDuration({ startTime, endTime, showFormatted: false });
    expect(typeof result).toBe("number");
  });

  it("returns string type when showFormatted is true", () => {
    const startTime = new Date("2025-01-15T09:00:00Z");
    const endTime = new Date("2025-01-15T10:00:00Z");
    const result = calculateDuration({ startTime, endTime, showFormatted: true });
    expect(typeof result).toBe("string");
  });

  it("handles endTime before startTime (negative duration)", () => {
    const startTime = new Date("2025-01-15T10:00:00Z");
    const endTime = new Date("2025-01-15T09:00:00Z");
    const result = calculateDuration({ startTime, endTime, showFormatted: false });
    // Math.floor of a negative number
    expect(result).toBe(-3600);
  });
});
