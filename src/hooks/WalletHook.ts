import { useContext } from 'react';
import AppContext from '../context/AppContext';
import CurrencyType from '../enums/CurrencyType';

export const initialWalletData = [
  {
    currency: CurrencyType.USD,
    value: 0,
    name: 'USD Wallet',
    isPrimary: true,
  },
  {
    currency: CurrencyType.GBP,
    value: 0,
    name: 'GBP Wallet',
    isPrimary: false,
  },
  {
    currency: CurrencyType.EUR,
    value: 0,
    name: 'EUR Wallet',
    isPrimary: false,
  },
];

export const useWallet = () => {
  const appContext = useContext(AppContext);
  return {
    wallets: appContext?.wallets,
    resetWallet: () =>
      appContext?.update({
        ...appContext,
        wallets: initialWalletData,
      }),
    addWallet: (
      name: string,
      currency: CurrencyType,
      initialValue: number = 0
    ) => {
      const newWallet = {
        name,
        currency,
        value: initialValue,
        isPrimary: false,
      };
      appContext?.update({
        ...appContext,
        wallets: (appContext.wallets || []).concat([newWallet]),
      });
    },
  };
};
