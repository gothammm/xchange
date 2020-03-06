import { useState, useEffect } from 'react';

const STORAGE_KEY = `xchange-data`;

export const useAppStorage = () => {
  const currentData = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || JSON.stringify({})
  );
  const [data, setData] = useState(currentData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  return {
    getStorageData: () => data,
    updateStorageData: (data: any) => setData(data),
  };
};
