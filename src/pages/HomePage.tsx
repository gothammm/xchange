import React from 'react';
import FlexContainer from '../components/FlexContainer';
import CurrencyType from '../enums/CurrencyType';
import styled from 'styled-components';
import {
  PlusOutlined,
  SyncOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import XChangeButton from '../components/XChangeButton';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { useWallet } from '../hooks/WalletHook';

const HomeContainer = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
`;

const WalletContainer = styled.div`
  margin: 2em 0;
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
  const size = 'large';
  const { wallets, addWallet } = useWallet();
  return (
    <HomeContainer>
      <WalletContainer>
        {wallets?.map(wallet => (
          <CurrencyDisplay value={wallet.value} currency={wallet.currency} />
        ))}
      </WalletContainer>
      <ActionBarContainer>
        <XChangeButton
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size={size}
          text={'Add Money'}
          onClick={() => addWallet('Hello', CurrencyType.USD, 10)}
        />
        <XChangeButton
          type="primary"
          shape="circle"
          icon={<SyncOutlined />}
          text={'Exchange'}
          size={size}
        />
        <XChangeButton
          type="primary"
          shape="circle"
          icon={<WalletOutlined />}
          text={'Wallets'}
          size={size}
        />
      </ActionBarContainer>
    </HomeContainer>
  );
};

export default HomePage;
