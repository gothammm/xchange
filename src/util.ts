export const getCurrencyDisplayValue = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
