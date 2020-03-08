enum CurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

namespace CurrencyType {
  export const getSymbol = (currency: CurrencyType) =>
    (0)
      .toLocaleString('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\d/g, '')
      .trim();
}

export default CurrencyType;
