import React from 'react';
import { render } from '@testing-library/react';
import ExchangePage from '../../src/pages/ExchangePage';
import { MemoryRouter } from 'react-router-dom';

describe(`ExchangePage component`, () => {
  test(`should match snapshot`, () => {
    const component = render(
      <MemoryRouter>
        <ExchangePage />
      </MemoryRouter>
    );
    expect(component.asFragment()).toMatchSnapshot();
  });
});
