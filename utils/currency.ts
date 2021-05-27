export function formatAmountForDisplay(
  amount: number,
  floor = true,
): string {
  const numberFormat = new Intl.NumberFormat(['en-US']);
  const floored = Math.floor(amount);
  const digits = Math.floor((amount * 100) - (floored * 100));
  let digitsDisplay = '';
  if (digits && !floor) {
    if (digits < 10) {
      digitsDisplay = `.0${digits}`;
    } else {
      digitsDisplay = `.${digits}`;
    }
  }
  return `$${numberFormat.format(floored)}${digitsDisplay}`;
}

export function formatAmountForStripe(
  amount: number,
): number {
  return Math.round(amount * 100);
}
