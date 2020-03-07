import { renderHook, act } from '@testing-library/react-hooks';
import { useAppStorage } from '../../src/hooks/StorageHook';
import { initialWalletData } from '../../src/hooks/WalletHook';

describe(`StorageHook`, () => {
  test(`to trigger local storage update`, () => {
    const { result } = renderHook(() => useAppStorage());
    expect(result.current.getStorageData()).toEqual({
      wallets: initialWalletData,
    });
    act(() => {
      result.current.updateStorageData({ test: 1 });
    });
    expect(result.current.getStorageData()).toEqual({ test: 1 });
  });
});
