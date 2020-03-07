import { createContext } from 'react';
import CurrencyType from '../enums/CurrencyType';

export interface WalletType {
  currency: CurrencyType;
  value: number;
  name: string;
  isPrimary: boolean;
  id: number;
}

export interface AppContextType {
  wallets: WalletType[];
  update: (data: AppContextType) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
