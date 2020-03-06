import React from 'react';
import renderer from 'react-test-renderer';
import CurrencyDisplay from '../../src/components/CurrencyDisplay';
import CurrencyType from '../../src/enums/CurrencyType';

describe(`CurrencyDisplay component`, () => {
  test(`should match snapshot for various currency type`, () => {
    const usdCurrencyComponent = renderer.create(
      <CurrencyDisplay value={60} currency={CurrencyType.USD}></CurrencyDisplay>
    );
    expect(usdCurrencyComponent.toJSON()).toMatchSnapshot();
    const eurCurrencyComponent = renderer.create(
      <CurrencyDisplay value={60} currency={CurrencyType.EUR}></CurrencyDisplay>
    );
    expect(eurCurrencyComponent.toJSON()).toMatchSnapshot();
    const gbpCurrencyComponent = renderer.create(
      <CurrencyDisplay value={60} currency={CurrencyType.GBP}></CurrencyDisplay>
    );
    expect(gbpCurrencyComponent.toJSON()).toMatchSnapshot();
  });
});
