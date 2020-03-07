import { useState, useEffect } from 'react';
import { initialWalletData } from './WalletHook';

const STORAGE_KEY = `xchange-data`;

export const useAppStorage = () => {
  const currentData = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || JSON.stringify({
      wallets: initialWalletData
    })
  );
  const [data, setData] = useState(currentData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [JSON.stringify(data)]);

  return {
    getStorageData: () => data,
    updateStorageData: (data: any) => setData(data),
    clearStorage: () => setData({}),
  };
};
