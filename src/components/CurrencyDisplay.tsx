import React from 'react';
import { Typography } from 'antd';
import CurrencyType from '../enums/CurrencyType';

interface CurrencyDisplayProps {
  value: number;
  currency: CurrencyType;
}

export const getCurrencyDisplayString = (value: number, currency: CurrencyType) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency,
  });

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  currency,
  value,
}) => {
  return (
    <Typography.Title>{getCurrencyDisplayString(value, currency)}</Typography.Title>
  );
};

export default CurrencyDisplay;
