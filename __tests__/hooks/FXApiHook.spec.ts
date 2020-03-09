import { renderHook, act } from '@testing-library/react-hooks';
import { useFXApiHook } from '../../src/hooks/FXApiHook';
import CurrencyType from '../../src/enums/CurrencyType';
import fetch from 'jest-fetch-mock';

describe(`FXApiHook`, () => {
  test(`to validate exchange API call`, async () => {
    fetch.mockResponse(req => {
      if (req.url.includes('/latest')) {
        return Promise.resolve({
          body: JSON.stringify({
            rates: {
              GBP: '1.30',
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
    const { result, waitForNextUpdate } = renderHook(() => useFXApiHook());

    act(() => {
      result.current.getFXRate(CurrencyType.USD, CurrencyType.GBP);
    });
    await waitForNextUpdate();
    expect(result.current.result).toEqual({
      from: CurrencyType.USD,
      to: CurrencyType.GBP,
      rate: 1.3,
    });
  });

  test(`to validate conversion calc`, () => {
    const { result } = renderHook(() => useFXApiHook());
    const usdGbpConvertResult = result.current.getFXValue(
      {
        from: CurrencyType.USD,
        to: CurrencyType.GBP,
        rate: 2,
      },
      10
    );

    const gbpUsdConverResult = result.current.getFXValue(
      {
        from: CurrencyType.USD,
        to: CurrencyType.GBP,
        rate: 2
      },
      10,
      true
    );
    expect(gbpUsdConverResult).toEqual(5);
    expect(usdGbpConvertResult).toEqual(20);
  });
});
