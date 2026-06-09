/**
 * Convert seconds to a formatted time string (HH:MM:SS).
 * This is a simple conversion without sign handling or validation.
 *
 * @param seconds - Total seconds (non-negative recommended)
 * @returns Formatted time string, e.g. "01:02:03"
 *
 * @example
 * timeDisplay(3665) // returns "01:01:05"
 */
export function timeDisplay(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Convert seconds to a formatted "HH:MM:SS" string with sign support.
 *
 * @param totalSeconds - Total seconds (can be negative)
 * @returns Formatted time string with optional leading minus sign, e.g. "01:02:03" or "-01:02:03"
 * @throws {Error} When input is not a number
 *
 * @example
 * secondsToHms(3665) // returns "01:01:05"
 * secondsToHms(-3665) // returns "-01:01:05"
 */
export function secondsToHms(totalSeconds: number): string {
  if (isNaN(totalSeconds)) throw new Error("Input must be a number");

  const sign = totalSeconds < 0 ? "-" : "";
  const absSeconds = Math.abs(totalSeconds);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  return `${sign}${timePad(hours)}:${timePad(minutes)}:${timePad(seconds)}`;
}

/**
 * Convert seconds to an object with padded hour, minute, and second strings.
 * Note: The sign is not included in the returned object.
 *
 * @param totalSeconds - Total seconds (can be negative)
 * @returns Object containing hours, minutes, and seconds as zero-padded strings
 * @throws {Error} When input is not a number
 *
 * @example
 * secondsToHmsObject(3665) // returns { hours: "01", minutes: "01", seconds: "05" }
 * secondsToHmsObject(-3665) // returns { hours: "01", minutes: "01", seconds: "05" } (sign is ignored)
 */
export function secondsToHmsObject(totalSeconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  if (isNaN(totalSeconds)) throw new Error("Input must be a number");

  const absSeconds = Math.abs(totalSeconds);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  return {
    hours: timePad(hours),
    minutes: timePad(minutes),
    seconds: timePad(seconds),
  };
}

/**
 * Pad a number with leading zeros to ensure it has at least 2 digits.
 *
 * @param n - Number to pad
 * @returns String with at least 2 digits, e.g. "05" or "12"
 *
 * @example
 * timePad(5) // returns "05"
 * timePad(12) // returns "12"
 */
export function timePad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Convert a "HH:MM:SS" formatted time string to total seconds.
 *
 * @param timeStr - Time string in format "HH:MM:SS" (optionally with leading '-')
 * @returns Total seconds (negative if input starts with '-')
 * @throws {Error} If format is invalid, contains non-numeric values, or minutes/seconds are out of range (0-59)
 *
 * @example
 * hmsToSeconds("01:01:05") // returns 3665
 * hmsToSeconds("-01:01:05") // returns -3665
 * hmsToSeconds("99:59:59") // returns 359999 (hours can exceed 23)
 */
export function hmsToSeconds(timeStr: string): number {
  const trimmed = timeStr.trim();
  const isNegative = trimmed.startsWith("-");
  const clean = isNegative ? trimmed.slice(1) : trimmed;

  const parts = clean.split(":");
  if (parts.length !== 3) {
    throw new Error('Invalid format. Expected "HH:MM:SS"');
  }

  const [hours, minutes, seconds] = parts.map((part) => {
    const num = Number(part);
    if (isNaN(num)) throw new Error(`Non‑numeric component: ${part}`);
    return num;
  });

  // Optional: range checks
  if (minutes < 0 || minutes >= 60) throw new Error("Minutes must be 0–59");
  if (seconds < 0 || seconds >= 60) throw new Error("Seconds must be 0–59");
  // Hours can be any non‑negative integer

  const total = hours * 3600 + minutes * 60 + seconds;
  return isNegative ? -total : total;
}
