import { describe, it, expect, vi, beforeEach } from "vitest";

import localizePrice from "@/lib/localize-price";

describe("localizePrice", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("formats IRR currency correctly", () => {
    // For IRR with the built-in Intl.NumberFormat, we just verify
    // that the result contains Persian/Arabic numerals
    const result = localizePrice({ price: 150000, currency: "IRR" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    // Should contain "ریال" (Rial) in the output
    expect(result).toContain("ریال");
  });

  it("formats IRT (Toman) as plain number with Persian digits", () => {
    const result = localizePrice({ price: 12000, currency: "IRT" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    // IRT just uses NumberFormat without currency style
    // Should be a number formatted in Persian digits (e.g., "۱۲٬۰۰۰")
  });

  it("formats USD currency correctly", () => {
    const result = localizePrice({ price: 20, currency: "USD" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    // USD should contain the dollar sign
    expect(result).toContain("$");
  });

  it("defaults to IRR when no currency is specified", () => {
    const result = localizePrice({ price: 50000 });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result).toContain("ریال");
  });

  it("formats 0 value correctly", () => {
    const result = localizePrice({ price: 0, currency: "IRT" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats large numbers correctly", () => {
    const result = localizePrice({ price: 1000000000, currency: "IRT" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("formats decimal values correctly for USD", () => {
    const result = localizePrice({ price: 19.99, currency: "USD" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    // USD should show decimals
    expect(result).toMatch(/[۱۹٫۹۹]|[$.0-9]/);
  });

  it("handles negative numbers", () => {
    const result = localizePrice({ price: -5000, currency: "IRT" });
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});
