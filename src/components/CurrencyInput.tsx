import React, { useCallback, KeyboardEvent } from 'react';
import { Input, Typography } from 'antd';
import { WalletType } from '../context/AppContext';
import { getCurrencyDisplayString } from './CurrencyDisplay';
import styled from 'styled-components';
import Text from 'antd/lib/typography/Text';

interface CurrencyInputProps {
  wallet: WalletType;
  value: number;
  maxValue?: number;
  onChange: (value: number) => void;
}

const VALID_FIRST = /^[1-9]{1}$/;
const VALID_NEXT = /^[0-9]{1}$/;
const DELETE_KEY_CODE = 8;

const CurrencyPrefix = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const InputWrapper = styled.div`
  input {
    text-align: right;
    font-size: 23px;
  }
  h3 {
    margin: 0;
  }
`;

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  wallet,
  value,
  onChange,
  maxValue = 100000000,
}) => {
  const valueAbsTrunc = Math.trunc(Math.abs(value));

  if (
    value !== valueAbsTrunc ||
    !Number.isFinite(value) ||
    Number.isNaN(value)
  ) {
    throw new Error(`Invalid Value`);
  }
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      debugger;
      const { key, keyCode } = e;
      if (
        (value === 0 && !VALID_FIRST.test(key)) ||
        (value !== 0 && !VALID_NEXT.test(key) && keyCode !== DELETE_KEY_CODE)
      ) {
        return;
      }
      const valueString = value.toString();
      let nextValue: number;
      if (keyCode !== DELETE_KEY_CODE) {
        const nextValueString: string =
          value === 0 ? key : `${valueString}${key}`;
        nextValue = Number.parseInt(nextValueString, 10);
      } else {
        const nextValueString = valueString.slice(0, -1);
        nextValue =
          nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10);
      }
      if (nextValue > maxValue) {
        return;
      }
      onChange(nextValue);
    },
    [maxValue, onChange, value]
  );
  const valueDisplay = getCurrencyDisplayString(value / 100, wallet.currency);
  return (
    <InputWrapper>
      <Input
        placeholder="Enter value"
        value={valueDisplay}
        onKeyDown={handleKeyDown}
        prefix={
          <CurrencyPrefix>
            <Typography.Title level={3}>{wallet.currency}</Typography.Title>
            <Text type="secondary">
              Balance: {getCurrencyDisplayString(wallet.value, wallet.currency)}
            </Text>
          </CurrencyPrefix>
        }
      />
    </InputWrapper>
  );
};

export default CurrencyInput;
