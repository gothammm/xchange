import React, { ReactNode } from 'react';
import { render, fireEvent } from '@testing-library/react';
import ExchangePage from '../../src/pages/ExchangePage';
import { MemoryRouter } from 'react-router-dom';
import AppContext from '../../src/context/AppContext';
import { useAppStorage } from '../../src/hooks/StorageHook';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWallet } from '../../src/hooks/WalletHook';
import fetch from 'jest-fetch-mock';

describe(`ExchangePage component`, () => {
  let appWrapper: React.ComponentType;
  const exchangeRate = 1.3;
  beforeEach(() => {
    localStorage.clear();
    appWrapper = ({ children }: { children?: ReactNode }) => {
      const { updateStorageData, getStorageData } = useAppStorage();
      return (
        <AppContext.Provider
          value={{
            ...getStorageData(),
            update: updateStorageData,
          }}
        >
          {children}
        </AppContext.Provider>
      );
    };
    fetch.mockResponse(req => {
      if (req.url.includes('/latest')) {
        return Promise.resolve({
          body: JSON.stringify({
            rates: {
              GBP: exchangeRate.toString(),
              EUR: exchangeRate.toString(),
            },
            base: 'USD',
          }),
          status: 200,
        });
      }
      return Promise.reject({
        status: 400,
        body: `error`,
      });
    });
  });

  test(`should match snapshot`, () => {
    const component = render(
      <MemoryRouter>
        <ExchangePage />
      </MemoryRouter>
    );
    expect(component.asFragment()).toMatchSnapshot();
  });

  test(`should convert currency between two currency input`, async () => {
    const { result } = renderHook(() => useWallet(), { wrapper: appWrapper });
    const initialMoney = 100;
    act(() => {
      result.current.wallets?.forEach(wallet => {
        result.current?.addMoneyToWallet(wallet, initialMoney);
      });
    });
    const component = render(
      <MemoryRouter>
        <ExchangePage />
      </MemoryRouter>,
      { wrapper: appWrapper }
    );
    const usdInput: HTMLInputElement = (await component.findByTestId(
      'USD'
    )) as HTMLInputElement;
    fireEvent.keyDown(usdInput, { key: '1', code: 10 });
    fireEvent.keyDown(usdInput, { key: '0', code: 10 });
    fireEvent.keyDown(usdInput, { key: '0', code: 10 });
    fireEvent.keyDown(usdInput, { key: '0', code: 10 });
    fireEvent.keyDown(usdInput, { key: '0', code: 10 });

    expect(usdInput.value).toEqual('$100.00');

    const allInputs: HTMLInputElement[] = (await component.findAllByRole(
      'currency-input'
    )) as HTMLInputElement[];
    const exchangeInput: HTMLInputElement | null =
      allInputs.find(
        item => item.attributes?.getNamedItem('data-testid')?.value !== 'USD'
      ) || null;
    expect(exchangeInput).toBeTruthy();
    expect(exchangeInput?.value).toEqual('£130.00');
  });
});
