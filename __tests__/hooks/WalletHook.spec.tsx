import { renderHook, act } from '@testing-library/react-hooks';
import { useWallet, initialWalletData } from '../../src/hooks/WalletHook';
import { useAppStorage } from '../../src/hooks/StorageHook';
import AppContext, { AppContextType } from '../../src/context/AppContext';
import React, { ReactNode } from 'react';

describe(`WalletHook`, () => {
  beforeEach(() => localStorage.clear());
  test(`to trigger local storage update`, () => {
    const wrapper = ({ children }: { children?: ReactNode }) => (
      <AppContext.Provider
        value={{
          wallets: initialWalletData,
          update: (_: AppContextType) => ({}),
        }}
      >
        {children}
      </AppContext.Provider>
    );
    const { result } = renderHook(() => useWallet(), { wrapper });
    expect(result.current.wallets).toEqual(initialWalletData);
  });

  test(`to mark a wallet primary`, async () => {
    const wrapper = ({ children }: { children?: ReactNode }) => {
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
    const { result } = renderHook(() => useWallet(), { wrapper });
    expect(result.current.wallets).toEqual(initialWalletData);
    const nonPrimaryWallet = result.current?.wallets?.find(c => !c.isPrimary);

    act(() => {
      result.current?.makePrimary(nonPrimaryWallet!!);
    });

    expect(result.current?.wallets?.filter(c => c.isPrimary).length).toEqual(1);

    const updatedPrimaryWallet = result.current?.wallets?.find(
      c => c.isPrimary
    );
    expect(updatedPrimaryWallet).toBeTruthy();
    expect(updatedPrimaryWallet?.id).toEqual(nonPrimaryWallet?.id);
    expect(updatedPrimaryWallet?.isPrimary).toEqual(true);
  });

  test(`to add money to a wallet`, async () => {
    const wrapper = ({ children }: { children?: ReactNode }) => {
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
    const { result } = renderHook(() => useWallet(), { wrapper });
    expect(result.current.wallets).toEqual(initialWalletData);

    const walletToUpdate = initialWalletData[0];
    const moneyToAdd = 10;

    act(() => {
      result.current?.addMoneyToWallet(walletToUpdate, moneyToAdd);
    });

    expect(
      result.current?.wallets?.find(c => c.id === walletToUpdate.id)?.value
    ).toEqual(moneyToAdd);
  });
});
