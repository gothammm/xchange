import React from 'react';
import CurrencyDisplay from '../../src/components/CurrencyDisplay';
import CurrencyType from '../../src/enums/CurrencyType';
import { render } from '@testing-library/react';

describe(`CurrencyDisplay component`, () => {
  test(`should match snapshot for various currency type`, () => {
    const usdCurrencyComponent = render(
      <CurrencyDisplay value={60} currency={CurrencyType.USD}></CurrencyDisplay>
    );
    expect(usdCurrencyComponent.asFragment()).toMatchSnapshot();
    const eurCurrencyComponent = render(
      <CurrencyDisplay value={60} currency={CurrencyType.EUR}></CurrencyDisplay>
    );
    expect(eurCurrencyComponent.asFragment()).toMatchSnapshot();
    const gbpCurrencyComponent = render(
      <CurrencyDisplay value={60} currency={CurrencyType.GBP}></CurrencyDisplay>
    );
    expect(gbpCurrencyComponent.asFragment()).toMatchSnapshot();
  });
});
