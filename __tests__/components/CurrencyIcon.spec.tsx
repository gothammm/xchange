import React from 'react';
import CurrencyIcon from '../../src/components/CurrencyIcon';
import CurrencyType from '../../src/enums/CurrencyType';
import { render } from '@testing-library/react';

describe(`CurrencyIcon`, () => {
  test(`to match snapshot`, () => {
    const component = render(<CurrencyIcon currency={CurrencyType.USD} />);
    expect(component.asFragment()).toMatchSnapshot();

    component.rerender(<CurrencyIcon currency={CurrencyType.EUR} />);
    expect(component.asFragment()).toMatchSnapshot();

    component.rerender(<CurrencyIcon currency={CurrencyType.GBP} />);
    expect(component.asFragment()).toMatchSnapshot();
  });
});
