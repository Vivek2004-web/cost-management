// Currency utility — converts USD amounts to Indian Rupees (INR)
// Exchange rate: 1 USD = 84 INR (fixed demo rate)

export const USD_TO_INR = 84;
export const CURRENCY_SYMBOL = '₹';

/**
 * Convert a USD amount to INR
 * @param {number} usd
 * @returns {number}
 */
export function toINR(usd) {
  return (usd || 0) * USD_TO_INR;
}

/**
 * Format a USD value as INR string with ₹ symbol and Indian number formatting
 * e.g. formatINR(1650) => "₹1,38,600"
 * @param {number} usd
 * @param {boolean} compact - show compact like ₹1.38L
 * @returns {string}
 */
export function formatINR(usd, compact = false) {
  const inr = toINR(usd);
  if (compact && inr >= 100000) {
    return `₹${(inr / 100000).toFixed(2)}L`;
  }
  if (compact && inr >= 1000) {
    return `₹${(inr / 1000).toFixed(1)}K`;
  }
  return `₹${inr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format a raw INR value (already in rupees, not USD)
 * @param {number} inr
 * @returns {string}
 */
export function formatRaw(inr) {
  return `₹${(inr || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
