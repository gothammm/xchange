import { createContext } from 'react';
import CurrencyType from '../enums/CurrencyType';

interface WalletType {
  currency: CurrencyType;
  value: number;
  name: string;
}

interface AppContextType {
  wallets: WalletType[];
  update: (data: AppContextType) => {} 
}

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;