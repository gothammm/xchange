import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../../src/pages/HomePage';
import { MemoryRouter } from 'react-router-dom';

describe(`HomePage component`, () => {
  test(`should match snapshot for various currency type`, () => {
    const component = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(component.asFragment()).toMatchSnapshot();
  });
});
