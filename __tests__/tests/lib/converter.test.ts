import { describe, it, expect } from "vitest";

import { convertStringToBoolean } from "@/lib/converter";

describe("convertStringToBoolean", () => {
  it('returns true for lowercase "true"', () => {
    expect(convertStringToBoolean("true")).toBe(true);
  });

  it('returns true for uppercase "TRUE"', () => {
    expect(convertStringToBoolean("TRUE")).toBe(true);
  });

  it('returns true for mixed case "True"', () => {
    expect(convertStringToBoolean("True")).toBe(true);
  });

  it('returns true for mixed case "tRuE"', () => {
    expect(convertStringToBoolean("tRuE")).toBe(true);
  });

  it('returns false for lowercase "false"', () => {
    expect(convertStringToBoolean("false")).toBe(false);
  });

  it('returns false for uppercase "FALSE"', () => {
    expect(convertStringToBoolean("FALSE")).toBe(false);
  });

  it('returns false for mixed case "False"', () => {
    expect(convertStringToBoolean("False")).toBe(false);
  });

  it('returns false for any other string', () => {
    expect(convertStringToBoolean("yes")).toBe(false);
    expect(convertStringToBoolean("1")).toBe(false);
    expect(convertStringToBoolean("on")).toBe(false);
    expect(convertStringToBoolean("anything")).toBe(false);
    expect(convertStringToBoolean("random")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(convertStringToBoolean("")).toBe(false);
  });

  it("returns false for string with only spaces", () => {
    expect(convertStringToBoolean("   ")).toBe(false);
  });

  it("handles 'true' with surrounding spaces", () => {
    // " true".toLowerCase() === " true" !== "true"
    expect(convertStringToBoolean(" true ")).toBe(false);
  });
});
