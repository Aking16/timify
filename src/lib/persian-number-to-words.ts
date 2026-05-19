/**
 * Converts digits to Persian words
 * @param num - Number to convert (supports up to quintillions)
 * @returns Persian word representation
 */
export function numberToPersianWords(num: number | string): string {
  // Convert to number and handle invalid input
  const n = typeof num === "string" ? parseFloat(num.replace(/,/g, "")) : num;

  if (isNaN(n)) {
    throw new Error("Invalid number input");
  }

  // Handle zero
  if (n === 0) return "صفر";

  // Handle negative numbers
  if (n < 0) return "منفی " + numberToPersianWords(Math.abs(n));

  // Handle decimals
  if (!Number.isInteger(n)) {
    const [intPart, decPart] = n.toString().split(".");
    return (
      numberToPersianWords(parseInt(intPart)) + " ممیز " + numberToPersianWords(parseInt(decPart))
    );
  }

  return convertToWords(n);
}

// Persian digit names
const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];

const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];

const hundreds = ["", "یکصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];

const teens = [
  "ده",
  "یازده",
  "دوازده",
  "سیزده",
  "چهارده",
  "پانزده",
  "شانزده",
  "هفده",
  "هجده",
  "نوزده",
];

const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون", "کوادریلیون", "کوینتیلیون"];

function convertToWords(num: number): string {
  if (num === 0) return "";

  // Split number into groups of 3 digits
  const groups: number[] = [];
  let temp = num;

  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  // Convert each group to words
  const parts: string[] = [];

  for (let i = groups.length - 1; i >= 0; i--) {
    const groupValue = groups[i];
    if (groupValue === 0) continue;

    const groupWords = convertThreeDigits(groupValue);
    const scale = scales[i];

    if (scale) {
      parts.push(groupWords + " " + scale);
    } else {
      parts.push(groupWords);
    }
  }

  return parts.join(" و ").trim();
}

function convertThreeDigits(num: number): string {
  if (num === 0) return "";

  const h = Math.floor(num / 100);
  const remainder = num % 100;
  const t = Math.floor(remainder / 10);
  const o = remainder % 10;

  const parts: string[] = [];

  // Hundreds place
  if (h > 0) {
    parts.push(hundreds[h]);
  }

  // Tens and ones place
  if (remainder >= 10 && remainder < 20) {
    // Special case for 10-19
    parts.push(teens[remainder - 10]);
  } else {
    if (t > 0) {
      parts.push(tens[t]);
    }
    if (o > 0) {
      parts.push(ones[o]);
    }
  }

  return parts.join(" و ");
}
