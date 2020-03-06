import React from 'react';
import { Typography } from 'antd';
import CurrencyType from '../enums/CurrencyType';

interface CurrencyDisplayProps {
  value: number;
  currency: CurrencyType;
}

const getDisplayString = (value: number, currency: CurrencyType) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency,
  });

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  currency,
  value,
}) => {
  return (
    <Typography.Title>{getDisplayString(value, currency)}</Typography.Title>
  );
};

export default CurrencyDisplay;
