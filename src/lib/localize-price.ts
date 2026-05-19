interface LocalizePriceProps {
  price: number;
  currency?: "IRR" | "IRT" | "USD";
}

/**
 * Formats a price according to the specified locale and currency.
 *
 * - For `IRT` (Toman), it converts and displays the number manually in Persian digits.
 * - For `IRR` or `USD`, it uses the built-in Intl currency formatting.
 *
 * @param {LocalizePriceProps} params - The configuration object for price localization.
 * @returns {string} The localized price string.
 *
 * @example
 * localizePrice({ price: 12000, currency: "IRT" });
 * // => "۱۲٬۰۰۰ تومان"
 *
 * @example
 * localizePrice({ price: 150000, currency: "IRR" });
 * // => "ریال ۱۵۰٬۰۰۰"
 *
 * @example
 * localizePrice({ price: 20, currency: "USD" });
 * // => "$20.00"
 */
export default function localizePrice({ price, currency = "IRR" }: LocalizePriceProps) {
  if (currency === "IRT") {
    // Convert Toman to localized Persian numerals
    return new Intl.NumberFormat("fa-IR").format(price);
  }

  return new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency,
  }).format(price);
}
