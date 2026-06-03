import { describe, it, expect } from "vitest";

import { numberToPersianWords } from "@/lib/persian-number-to-words";

describe("numberToPersianWords", () => {
  it('returns "صفر" for 0', () => {
    expect(numberToPersianWords(0)).toBe("صفر");
  });

  it('returns "صفر" for string "0"', () => {
    expect(numberToPersianWords("0")).toBe("صفر");
  });

  describe("single digits", () => {
    it('converts 1 to "یک"', () => {
      expect(numberToPersianWords(1)).toBe("یک");
    });

    it('converts 2 to "دو"', () => {
      expect(numberToPersianWords(2)).toBe("دو");
    });

    it('converts 3 to "سه"', () => {
      expect(numberToPersianWords(3)).toBe("سه");
    });

    it('converts 4 to "چهار"', () => {
      expect(numberToPersianWords(4)).toBe("چهار");
    });

    it('converts 5 to "پنج"', () => {
      expect(numberToPersianWords(5)).toBe("پنج");
    });

    it('converts 6 to "شش"', () => {
      expect(numberToPersianWords(6)).toBe("شش");
    });

    it('converts 7 to "هفت"', () => {
      expect(numberToPersianWords(7)).toBe("هفت");
    });

    it('converts 8 to "هشت"', () => {
      expect(numberToPersianWords(8)).toBe("هشت");
    });

    it('converts 9 to "نه"', () => {
      expect(numberToPersianWords(9)).toBe("نه");
    });
  });

  describe("teens (10-19)", () => {
    it('converts 10 to "ده"', () => {
      expect(numberToPersianWords(10)).toBe("ده");
    });

    it('converts 11 to "یازده"', () => {
      expect(numberToPersianWords(11)).toBe("یازده");
    });

    it('converts 12 to "دوازده"', () => {
      expect(numberToPersianWords(12)).toBe("دوازده");
    });

    it('converts 13 to "سیزده"', () => {
      expect(numberToPersianWords(13)).toBe("سیزده");
    });

    it('converts 14 to "چهارده"', () => {
      expect(numberToPersianWords(14)).toBe("چهارده");
    });

    it('converts 15 to "پانزده"', () => {
      expect(numberToPersianWords(15)).toBe("پانزده");
    });

    it('converts 16 to "شانزده"', () => {
      expect(numberToPersianWords(16)).toBe("شانزده");
    });

    it('converts 17 to "هفده"', () => {
      expect(numberToPersianWords(17)).toBe("هفده");
    });

    it('converts 18 to "هجده"', () => {
      expect(numberToPersianWords(18)).toBe("هجده");
    });

    it('converts 19 to "نوزده"', () => {
      expect(numberToPersianWords(19)).toBe("نوزده");
    });
  });

  describe("tens (20-90)", () => {
    it('converts 20 to "بیست"', () => {
      expect(numberToPersianWords(20)).toBe("بیست");
    });

    it('converts 30 to "سی"', () => {
      expect(numberToPersianWords(30)).toBe("سی");
    });

    it('converts 40 to "چهل"', () => {
      expect(numberToPersianWords(40)).toBe("چهل");
    });

    it('converts 50 to "پنجاه"', () => {
      expect(numberToPersianWords(50)).toBe("پنجاه");
    });

    it('converts 60 to "شصت"', () => {
      expect(numberToPersianWords(60)).toBe("شصت");
    });

    it('converts 70 to "هفتاد"', () => {
      expect(numberToPersianWords(70)).toBe("هفتاد");
    });

    it('converts 80 to "هشتاد"', () => {
      expect(numberToPersianWords(80)).toBe("هشتاد");
    });

    it('converts 90 to "نود"', () => {
      expect(numberToPersianWords(90)).toBe("نود");
    });
  });

  describe("tens with units (21-99)", () => {
    it('converts 21 to "بیست و یک"', () => {
      expect(numberToPersianWords(21)).toBe("بیست و یک");
    });

    it('converts 32 to "سی و دو"', () => {
      expect(numberToPersianWords(32)).toBe("سی و دو");
    });

    it('converts 45 to "چهل و پنج"', () => {
      expect(numberToPersianWords(45)).toBe("چهل و پنج");
    });

    it('converts 99 to "نود و نه"', () => {
      expect(numberToPersianWords(99)).toBe("نود و نه");
    });
  });

  describe("hundreds", () => {
    it('converts 100 to "یکصد"', () => {
      expect(numberToPersianWords(100)).toBe("یکصد");
    });

    it('converts 200 to "دویست"', () => {
      expect(numberToPersianWords(200)).toBe("دویست");
    });

    it('converts 300 to "سیصد"', () => {
      expect(numberToPersianWords(300)).toBe("سیصد");
    });

    it('converts 500 to "پانصد"', () => {
      expect(numberToPersianWords(500)).toBe("پانصد");
    });

    it('converts 123 to "یکصد و بیست و سه"', () => {
      expect(numberToPersianWords(123)).toBe("یکصد و بیست و سه");
    });

    it('converts 345 to "سیصد و چهل و پنج"', () => {
      expect(numberToPersianWords(345)).toBe("سیصد و چهل و پنج");
    });

    it('converts 999 to "نهصد و نود و نه"', () => {
      expect(numberToPersianWords(999)).toBe("نهصد و نود و نه");
    });
  });

  describe("thousands", () => {
    it('converts 1000 to "یک هزار"', () => {
      expect(numberToPersianWords(1000)).toBe("یک هزار");
    });

    it('converts 1001 to "یک هزار و یک"', () => {
      expect(numberToPersianWords(1001)).toBe("یک هزار و یک");
    });

    it('converts 1100 to "یک هزار و یکصد"', () => {
      expect(numberToPersianWords(1100)).toBe("یک هزار و یکصد");
    });

    it('converts 1234 to "یک هزار و دویست و سی و چهار"', () => {
      expect(numberToPersianWords(1234)).toBe("یک هزار و دویست و سی و چهار");
    });

    it('converts 9999 to "نه هزار و نهصد و نود و نه"', () => {
      expect(numberToPersianWords(9999)).toBe("نه هزار و نهصد و نود و نه");
    });
  });

  describe("millions and billions", () => {
    it('converts 1000000 to "یک میلیون"', () => {
      expect(numberToPersianWords(1000000)).toBe("یک میلیون");
    });

    it('converts 1234567 to a valid Persian representation', () => {
      const result = numberToPersianWords(1234567);
      expect(result).toBeTruthy();
      expect(result).toContain("میلیون");
      expect(result).toContain("هزار");
    });

    it('converts 1000000000 to "یک میلیارد"', () => {
      expect(numberToPersianWords(1000000000)).toBe("یک میلیارد");
    });

    it("handles billions with smaller components", () => {
      const result = numberToPersianWords(1001000000);
      expect(result).toContain("میلیارد");
      expect(result).toContain("میلیون");
    });
  });

  describe("negative numbers", () => {
    it('converts -5 to "منفی پنج"', () => {
      expect(numberToPersianWords(-5)).toBe("منفی پنج");
    });

    it('converts -123 to "منفی یکصد و بیست و سه"', () => {
      expect(numberToPersianWords(-123)).toBe("منفی یکصد و بیست و سه");
    });

    it('converts -1000 to "منفی یک هزار"', () => {
      expect(numberToPersianWords(-1000)).toBe("منفی یک هزار");
    });
  });

  describe("decimal numbers", () => {
    it('converts 1.5 to "یک ممیز پنج"', () => {
      expect(numberToPersianWords(1.5)).toBe("یک ممیز پنج");
    });

    it('converts 3.14 to "سه ممیز چهارده"', () => {
      expect(numberToPersianWords(3.14)).toBe("سه ممیز چهارده");
    });

    it('converts 100.01 to "یکصد ممیز یک"', () => {
      expect(numberToPersianWords(100.01)).toBe("یکصد ممیز یک");
    });
  });

  describe("invalid input", () => {
    it("throws error for NaN", () => {
      expect(() => numberToPersianWords(NaN)).toThrow("Invalid number input");
    });

    it("throws error for non-numeric string", () => {
      expect(() => numberToPersianWords("abc")).toThrow("Invalid number input");
    });
  });

  describe("string input with commas", () => {
    it("handles string with comma separator", () => {
      expect(numberToPersianWords("1,234")).toBe("یک هزار و دویست و سی و چهار");
    });

    it("handles string with multiple commas", () => {
      expect(numberToPersianWords("1,234,567")).toBeTruthy();
    });
  });

  describe("edge cases", () => {
    it('converts 100000 to "یکصد هزار"', () => {
      expect(numberToPersianWords(100000)).toBe("یکصد هزار");
    });

    it("handles string input with leading zeros", () => {
      expect(numberToPersianWords("00123")).toBe("یکصد و بیست و سه");
    });
  });
});
