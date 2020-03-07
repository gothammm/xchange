import React from 'react';
import styled from 'styled-components';
import FlexContainer from './FlexContainer';
import { WalletType } from '../context/AppContext';
import CurrencyDisplay from './CurrencyDisplay';
import { Empty, Button } from 'antd';

interface WalletOverviewProps {
  wallet?: WalletType;
  onWalletChange: () => void;
}

const WalletOverviewContainer = styled(FlexContainer)``;

const WalletOverview: React.FC<WalletOverviewProps> = ({ wallet }) => {
  if (!wallet) {
    return (
      <WalletOverviewContainer>
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description={`No wallet or any primary wallet found.`}
        >
          <Button type="primary">Create a wallet now</Button>
        </Empty>
      </WalletOverviewContainer>
    );
  }
  return (
    <WalletOverviewContainer>
      <CurrencyDisplay value={wallet.value} currency={wallet.currency} />
    </WalletOverviewContainer>
  );
};

export default WalletOverview;
