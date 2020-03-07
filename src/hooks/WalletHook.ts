import { useContext } from 'react';
import AppContext, { WalletType } from '../context/AppContext';
import CurrencyType from '../enums/CurrencyType';

export const initialWalletData = [
  {
    currency: CurrencyType.USD,
    value: 0,
    name: 'USD Wallet',
    isPrimary: true,
    id: 0,
  },
  {
    currency: CurrencyType.GBP,
    value: 0,
    name: 'GBP Wallet',
    isPrimary: false,
    id: 1,
  },
  {
    currency: CurrencyType.EUR,
    value: 0,
    name: 'EUR Wallet',
    isPrimary: false,
    id: 3,
  },
];

export const useWallet = () => {
  const appContext = useContext(AppContext);
  return {
    wallets: appContext?.wallets,
    makePrimary: (wallet: WalletType) => {
      const updatedWallets =
        appContext?.wallets?.reduce(
          (acc, item) => [
            ...acc,
            { ...item, isPrimary: wallet.id === item.id },
          ],
          [] as WalletType[]
        ) || [];
      appContext?.update({ ...appContext, wallets: updatedWallets });
    },
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
      } as WalletType;
      appContext?.update({
        ...appContext,
        wallets: (appContext.wallets || []).concat([newWallet]),
      });
    },
  };
};
