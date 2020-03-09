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

const updateWallet = (walletToUpdate: WalletType, wallets: WalletType[]) => {
  return wallets?.reduce((newWalletsList: WalletType[], wallet: WalletType) => {
    if (wallet.id === walletToUpdate.id) {
      return [...newWalletsList, walletToUpdate];
    }
    return [...newWalletsList, wallet];
  }, [] as WalletType[]);
};

export const useWallet = () => {
  const appContext = useContext(AppContext);
  const commit = (wallets: WalletType[]) => {
    if (!appContext) {
      return;
    }
    appContext?.update({ ...appContext, wallets });
  };
  return {
    updateWallet: updateWallet,
    wallets: appContext?.wallets || [],
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
    commit: commit,
    deductMoneyFromWallet: (
      walletToUpdate: WalletType,
      value: number,
      doCommit = true
    ) => {
      const updatedWallet = {
        ...walletToUpdate,
        value: walletToUpdate.value - value,
      } as WalletType;
      if (doCommit) {
        const updatedWallets = updateWallet(
          updatedWallet,
          appContext?.wallets || []
        );
        commit(updatedWallets);
      }
      return updatedWallet;
    },
    addMoneyToWallet: (
      walletToUpdate: WalletType,
      value: number,
      doCommit = true
    ) => {
      const updatedWallet = {
        ...walletToUpdate,
        value: walletToUpdate.value + value,
      } as WalletType;
      if (doCommit) {
        const updatedWallets = updateWallet(
          updatedWallet,
          appContext?.wallets || []
        );
        commit(updatedWallets);
      }
      return updatedWallet;
    },
    resetWallet: () =>
      appContext?.update({
        ...appContext,
        wallets: initialWalletData,
      }),
    getPrimaryWallet: () =>
      appContext?.wallets?.find(wallet => wallet.isPrimary) || null,
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
