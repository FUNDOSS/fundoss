export function formatAmountForDisplay(
  amount: number,
  currency: string,
): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    maximumSignificantDigits: 3,
  });
  return numberFormat.format(amount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string,
): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  const zeroDecimalCurrency = numberFormat.formatToParts(amount).filter((part) => part.type === 'decimal').length;
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}
