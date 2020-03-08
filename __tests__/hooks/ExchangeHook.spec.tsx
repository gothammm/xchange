import { renderHook, act } from '@testing-library/react-hooks';
import { initialWalletData, useWallet } from '../../src/hooks/WalletHook';
import { useAppStorage } from '../../src/hooks/StorageHook';
import AppContext from '../../src/context/AppContext';
import React, { ReactNode } from 'react';
import { useExchange } from '../../src/hooks/ExchangeHook';

describe(`ExchangeHook`, () => {
  let appWrapper: React.ComponentType;
  beforeEach(() => {
    localStorage.clear();
    appWrapper = ({ children }: { children?: ReactNode }) => {
      const { updateStorageData, getStorageData } = useAppStorage();
      return (
        <AppContext.Provider
          value={{
            ...getStorageData(),
            update: updateStorageData,
          }}
        >
          {children}
        </AppContext.Provider>
      );
    };
  });

  test(`should transfer currency between two wallets`, async () => {
    const { result: exchangeHook } = renderHook(() => useExchange(), {
      wrapper: appWrapper,
    });

    const [primaryWallet, secondaryWallet] = initialWalletData;
    const addOrDeductFromWallet = 20;
    const moneyInPrimary = 100;
    const moneyInSecondary = 200;
    await act(async () => {
      await exchangeHook.current.exchange(
        { ...primaryWallet, value: moneyInPrimary },
        addOrDeductFromWallet,
        { ...secondaryWallet, value: moneyInSecondary },
        addOrDeductFromWallet
      );
    });

    const { result: walletHook } = renderHook(() => useWallet(), {
      wrapper: appWrapper,
    });

    const affectedPrimaryWallet = walletHook.current?.wallets?.find(
      wallet => wallet.id === primaryWallet.id
    );
    const affectedSecondaryWallet = walletHook.current?.wallets?.find(
      wallet => wallet.id === secondaryWallet.id
    );

    expect(affectedPrimaryWallet?.value).toEqual(
      moneyInPrimary - addOrDeductFromWallet
    );
    expect(affectedSecondaryWallet?.value).toEqual(
      moneyInSecondary + addOrDeductFromWallet
    );
  });
});
