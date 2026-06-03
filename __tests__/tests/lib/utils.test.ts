import { describe, it, expect } from "vitest";

import { cn } from "@/lib/utils";

describe("cn (className utility)", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes with objects", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("handles array inputs", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", false, null, undefined, 0, "", "bar")).toBe("foo bar");
  });

  it("merges Tailwind classes correctly (conflict resolution via twMerge)", () => {
    // twMerge should resolve the padding conflict: last one wins
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("merges conflicting Tailwind classes from conditional objects", () => {
    expect(cn("p-4", { "p-8": true })).toBe("p-8");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("handles single class", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("merges multiple conditional objects", () => {
    expect(cn({ foo: true, bar: false }, { baz: true, qux: false })).toBe("foo baz");
  });

  it("properly resolves bg-color conflicts", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("handles mixed inputs: string, object, array", () => {
    expect(cn("p-4", { "m-2": true }, ["rounded-lg", "shadow"])).toBe(
      "p-4 m-2 rounded-lg shadow",
    );
  });
});
