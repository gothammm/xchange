import { renderHook } from '@testing-library/react-hooks';
import { useWallet, initialWalletData } from '../../src/hooks/WalletHook';
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
});
