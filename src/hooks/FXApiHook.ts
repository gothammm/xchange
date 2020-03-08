import { useState } from 'react';
import CurrencyType from '../enums/CurrencyType';

const BASE_URL = `https://api.exchangeratesapi.io`;

interface FXResponse {
  rates: {
    [key: string]: string;
  };
  base: string;
}

interface FXResult {
  from: {
    currency: CurrencyType;
    value: number;
  };
  to: {
    currency: CurrencyType;
    value: number;
  };
  rate: number;
}

export const useFXApiHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [result, setResult] = useState<FXResult>();

  return {
    error,
    result,
    isLoading,
    fx: (value: number, from: CurrencyType, to: CurrencyType) => {
      setIsLoading(true);
      return fetch(`${BASE_URL}/latest?base=${from}&symbols=${to}`)
        .then(response => response.json())
        .then((fxData: FXResponse) => {
          const conversionRate = +fxData.rates[to];
          setResult({
            from: {
              value,
              currency: from,
            },
            to: {
              value: +(value * conversionRate).toFixed(2),
              currency: to,
            },
            rate: conversionRate,
          });
        })
        .catch(e => setError(e))
        .finally(() => setIsLoading(false));
    },
  };
};
