import React from 'react';
import CurrencyInput from '../../src/components/CurrencyInput';
import { render } from '@testing-library/react';
import { initialWalletData } from '../../src/hooks/WalletHook';

describe(`CurrencyInput component`, () => {
  test(`simple snapshot for different wallet data`, () => {
    initialWalletData.forEach(wallet => {
      const component = render(
        <CurrencyInput value={60} wallet={wallet} onChange={() => {}} />
      );
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
