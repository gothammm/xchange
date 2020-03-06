import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../../src/pages/HomePage';

describe(`CurrencyDisplay component`, () => {
  test(`should match snapshot for various currency type`, () => {
    const component = render(<HomePage />);
    expect(component.asFragment()).toMatchSnapshot();
  });
});
