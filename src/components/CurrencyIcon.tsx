import React from 'react';
import CurrencyType from '../enums/CurrencyType';
import { DollarOutlined, EuroOutlined, PoundOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const CurrencyIcon: React.FC<{ currency: CurrencyType }> = ({ currency }) => {
  switch (currency) {
    case CurrencyType.USD:
      return <DollarOutlined />;
    case CurrencyType.EUR:
      return <EuroOutlined />;
    case CurrencyType.GBP:
      return <PoundOutlined />;
    default:
      return <QuestionCircleOutlined />;
  }
};

export default CurrencyIcon;
