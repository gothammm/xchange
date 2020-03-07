import { createContext } from 'react';
import CurrencyType from '../enums/CurrencyType';

export interface WalletType {
  currency: CurrencyType;
  value: number;
  name: string;
  isPrimary: boolean;
}

export interface AppContextType {
  wallets: WalletType[];
  update: (data: AppContextType) => {} 
}

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;