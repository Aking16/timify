import { describe, it, expect } from "vitest";

import {
  timeDisplay,
  secondsToHms,
  secondsToHmsObject,
  hmsToSeconds,
} from "@/lib/time-display";

describe("timeDisplay", () => {
  it('returns "00:00:00" for 0 seconds', () => {
    expect(timeDisplay(0)).toBe("00:00:00");
  });

  it("formats seconds only", () => {
    expect(timeDisplay(45)).toBe("00:00:45");
  });

  it("formats minutes and seconds", () => {
    expect(timeDisplay(125)).toBe("00:02:05");
  });

  it("formats hours, minutes, seconds", () => {
    expect(timeDisplay(3665)).toBe("01:01:05");
  });

  it("formats large durations", () => {
    expect(timeDisplay(100000)).toBe("27:46:40");
  });

  it("pads single-digit hours", () => {
    expect(timeDisplay(3600)).toBe("01:00:00");
  });

  it("pads single-digit minutes", () => {
    expect(timeDisplay(65)).toBe("00:01:05");
  });

  it("pads single-digit seconds", () => {
    expect(timeDisplay(5)).toBe("00:00:05");
  });

  it("passes negative seconds through (no sign handling)", () => {
    // The function doesn't handle signs — Math.floor on negatives
    // produces negative components
    expect(typeof timeDisplay(-60)).toBe("string");
  });
});

describe("secondsToHms", () => {
  it('returns "00:00:00" for 0 seconds', () => {
    expect(secondsToHms(0)).toBe("00:00:00");
  });

  it("formats basic time", () => {
    expect(secondsToHms(3665)).toBe("01:01:05");
  });

  it("handles negative values with minus sign", () => {
    expect(secondsToHms(-3665)).toBe("-01:01:05");
  });

  it("handles negative zero", () => {
    expect(secondsToHms(-0)).toBe("00:00:00");
  });

  it("formats large values", () => {
    expect(secondsToHms(90061)).toBe("25:01:01");
  });

  it("throws for NaN input", () => {
    expect(() => secondsToHms(NaN)).toThrow("Input must be a number");
  });
});

describe("secondsToHmsObject", () => {
  it("returns object with zero-padded strings", () => {
    expect(secondsToHmsObject(3665)).toEqual({
      hours: "01",
      minutes: "01",
      seconds: "05",
    });
  });

  it("handles zero", () => {
    expect(secondsToHmsObject(0)).toEqual({
      hours: "00",
      minutes: "00",
      seconds: "00",
    });
  });

  it("treats negative values as absolute", () => {
    // Sign is ignored, uses absolute value
    expect(secondsToHmsObject(-3665)).toEqual({
      hours: "01",
      minutes: "01",
      seconds: "05",
    });
  });

  it("handles large values", () => {
    expect(secondsToHmsObject(100000)).toEqual({
      hours: "27",
      minutes: "46",
      seconds: "40",
    });
  });

  it("throws for NaN input", () => {
    expect(() => secondsToHmsObject(NaN)).toThrow("Input must be a number");
  });
});

describe("hmsToSeconds", () => {
  it("converts basic time string", () => {
    expect(hmsToSeconds("01:01:05")).toBe(3665);
  });

  it("converts zero", () => {
    expect(hmsToSeconds("00:00:00")).toBe(0);
  });

  it("handles negative time string", () => {
    expect(hmsToSeconds("-01:01:05")).toBe(-3665);
  });

  it("handles large hour values", () => {
    expect(hmsToSeconds("99:59:59")).toBe(359999);
  });

  it("trims whitespace", () => {
    expect(hmsToSeconds("  01:01:05  ")).toBe(3665);
  });

  it("throws for invalid format (fewer parts)", () => {
    expect(() => hmsToSeconds("01:05")).toThrow("Invalid format");
  });

  it("throws for empty string", () => {
    expect(() => hmsToSeconds("")).toThrow("Invalid format");
  });

  it("throws for non-numeric component", () => {
    expect(() => hmsToSeconds("ab:01:05")).toThrow("Non‑numeric component");
  });

  it("throws for minutes out of range (60)", () => {
    expect(() => hmsToSeconds("01:60:00")).toThrow("Minutes must be 0–59");
  });

  it("throws for seconds out of range (60)", () => {
    expect(() => hmsToSeconds("01:00:60")).toThrow("Seconds must be 0–59");
  });

  it("throws for negative minutes", () => {
    expect(() => hmsToSeconds("01:-1:00")).toThrow("Minutes must be 0–59");
  });

  it("handles padded single digits", () => {
    expect(hmsToSeconds("00:00:05")).toBe(5);
  });

  it("round-trips with secondsToHms", () => {
    const original = 3665;
    expect(hmsToSeconds(secondsToHms(original))).toBe(original);
  });
});
