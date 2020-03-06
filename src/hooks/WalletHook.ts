import { useContext } from 'react';
import AppContext from '../context/AppContext';
import CurrencyType from '../enums/CurrencyType';

export const useWallet = () => {
  const appContext = useContext(AppContext);

  return {
    wallets: appContext?.wallets,
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
