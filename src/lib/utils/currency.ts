export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  const currencyData = CURRENCIES.find((c) => c.code === currency);
  const symbol = currencyData?.symbol || "$";

  if (currency === "IDR") {
    // Format IDR: Rp 1.000.000
    return `${symbol} ${amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  } else {
    // Format USD: $1,000.00
    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

export function getCurrencySymbol(currency: string = "USD"): string {
  const currencyData = CURRENCIES.find((c) => c.code === currency);
  return currencyData?.symbol || "$";
}
