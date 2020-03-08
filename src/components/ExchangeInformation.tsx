import React from 'react';
import styled from 'styled-components';
import FlexContainer from './FlexContainer';
import { Button } from 'antd';
import { SwapOutlined, RiseOutlined } from '@ant-design/icons';
import { WalletType } from '../context/AppContext';
import { FXResult } from '../hooks/FXApiHook';
import CurrencyType from '../enums/CurrencyType';

interface ExchangeInformationProps {
  onSwap: (primary: WalletType, secondary: WalletType) => void;
  onRefreshRate: () => void;
  primary: WalletType;
  secondary: WalletType;
  conversionRate?: FXResult;
  isLoading: boolean;
}

const MainContainer = styled(FlexContainer)`
  flex: none;
  margin: 1em 0;
  .anticon.anticon-swap {
    transform: rotate(90deg);
  }
  flex-direction: row;
  justify-content: space-between;
`;

const SwapButton = styled(Button)`
  margin-right: 8em;
`;

const RateButton = styled(Button)``;

const getConversionRateText = (
  from: WalletType,
  to: WalletType,
  rate: FXResult
) => {
  return `${CurrencyType.getSymbol(from.currency)}1 = ${CurrencyType.getSymbol(
    to.currency
  )}${rate.rate}`;
};

const ExchangeInformation: React.FC<ExchangeInformationProps> = ({
  onSwap,
  onRefreshRate,
  primary,
  secondary,
  isLoading,
  conversionRate,
}) => {
  return (
    <MainContainer>
      <SwapButton
        icon={<SwapOutlined />}
        onClick={() => onSwap(secondary, primary)}
        type="primary"
        shape="circle"
      />
      <RateButton
        loading={isLoading || (!isLoading && !conversionRate)}
        icon={<RiseOutlined />}
        type="primary"
        shape="round"
        onClick={() => onRefreshRate()}
      >
        {conversionRate &&
          getConversionRateText(primary, secondary, conversionRate)}
      </RateButton>
    </MainContainer>
  );
};

export default ExchangeInformation;
