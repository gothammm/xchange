import { WalletType } from '../context/AppContext';
import { useWallet } from './WalletHook';

export const useExchange = () => {
  const {
    addMoneyToWallet,
    deductMoneyFromWallet,
    updateWallet,
    wallets,
    commit,
  } = useWallet();

  return {
    exchange: (
      fromWallet: WalletType,
      amountToDeductFromWallet: number,
      toWallet: WalletType,
      amountToAddToWallet: number
    ) => {
      return Promise.resolve().then(() => {
        if (fromWallet.value - amountToDeductFromWallet < 0) {
          return Promise.reject(
            `Not enough money in wallet with currency ${fromWallet.currency} to exchange`
          );
        }
        const updatedContextWallets = [
          deductMoneyFromWallet(fromWallet, amountToDeductFromWallet, false),
          addMoneyToWallet(toWallet, amountToAddToWallet, false),
        ].reduce((contextWallets, wallet) => {
          return updateWallet(wallet, contextWallets);
        }, (wallets || []) as WalletType[]);

        commit(updatedContextWallets);
        return Promise.resolve();
      });
    },
  };
};
