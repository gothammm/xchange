import React from 'react';
import FlexContainer from '../components/FlexContainer';
import CurrencyType from '../enums/CurrencyType';
import styled from 'styled-components';
import {
  PlusOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import XChangeButton from '../components/XChangeButton';
import CurrencyDisplay from '../components/CurrencyDisplay';

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

const Home: React.FC = () => {
  const size = 'large';
  return (
    <HomeContainer>
      <WalletContainer>
        <CurrencyDisplay value={60} currency={CurrencyType.USD} />
      </WalletContainer>
      <ActionBarContainer>
        <XChangeButton
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size={size}
          text={'Add Money'}
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
          icon={<InfoCircleOutlined />}
          text={'Details'}
          size={size}
        />
        <XChangeButton
          type="primary"
          shape="circle"
          icon={<WalletOutlined />}
          text={'Wallet'}
          size={size}
        />
      </ActionBarContainer>
    </HomeContainer>
  );
};

export default Home;
