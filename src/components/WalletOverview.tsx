import React from 'react';
import styled from 'styled-components';
import FlexContainer from './FlexContainer';
import { WalletType } from '../context/AppContext';
import CurrencyDisplay from './CurrencyDisplay';
import { Empty, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface WalletOverviewProps {
  wallet?: WalletType | null; 
  onWalletClick: () => void;
  onWalletCreateClick: () => void;
}

const WalletOverviewContainer = styled(FlexContainer)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  h1 {
    margin: 0 0.3em;
  }
`;

const WalletOverviewContainerNotEmpty = styled(WalletOverviewContainer)`
  cursor: pointer;
  :active {
    opacity: 0.6;
  }
`;

const WalletOverview: React.FC<WalletOverviewProps> = ({
  wallet,
  onWalletClick,
  onWalletCreateClick,
}) => {
  if (!wallet) {
    return (
      <WalletOverviewContainer>
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description={`No wallet or any primary wallet found.`}
        >
          <Button type="primary" onClick={() => onWalletCreateClick()}>
            Create wallet now
          </Button>
        </Empty>
      </WalletOverviewContainer>
    );
  }
  return (
    <WalletOverviewContainerNotEmpty onClick={() => onWalletClick()}>
      <CurrencyDisplay value={wallet.value} currency={wallet.currency} />
      <DownOutlined
        style={{
          fontSize: '25px',
        }}
      />
    </WalletOverviewContainerNotEmpty>
  );
};

export default WalletOverview;
