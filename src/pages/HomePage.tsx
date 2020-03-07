import React from 'react';
import FlexContainer from '../components/FlexContainer';
import CurrencyType from '../enums/CurrencyType';
import styled from 'styled-components';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import XChangeButton from '../components/XChangeButton';
import { useWallet } from '../hooks/WalletHook';
import WalletOverview from '../components/WalletOverview';

const HomeContainer = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
`;

const WalletContainer = styled.div`
  margin: 3em 0;
`;

const ActionBarContainer = styled(FlexContainer)`
  justify-content: space-between;
  flex: none;
  flex-direction: row;
  div {
    margin: 0 2.5em;
  }
`;

const HomePage: React.FC = () => {
  const { wallets, addWallet } = useWallet();
  const primaryWallet = wallets?.find(wallet => wallet.isPrimary);
  return (
    <HomeContainer>
      <WalletContainer>
        <WalletOverview wallet={primaryWallet} onWalletChange={() => {}} />
      </WalletContainer>
      <ActionBarContainer>
        <XChangeButton
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size={'large'}
          text={'Add Money'}
          onClick={() => addWallet('Hello', CurrencyType.USD, 10)}
        />
        <XChangeButton
          type="primary"
          shape="circle"
          icon={<SyncOutlined />}
          text={'Exchange'}
          size={'large'}
        />
      </ActionBarContainer>
    </HomeContainer>
  );
};

export default HomePage;
