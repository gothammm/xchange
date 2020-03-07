import React, { useState } from 'react';
import FlexContainer from '../components/FlexContainer';
import CurrencyType from '../enums/CurrencyType';
import styled from 'styled-components';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import XChangeButton from '../components/XChangeButton';
import { useWallet } from '../hooks/WalletHook';
import WalletOverview from '../components/WalletOverview';
import { Drawer, message } from 'antd';
import WalletList from '../components/WalletList';
import { DrawerProps } from 'antd/lib/drawer';

const HomeContainer = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  flex: 0.9;
`;

const XChangeDrawer: React.FC<DrawerProps> = styled(Drawer)`
  .ant-drawer-body {
    padding: 0 8px;
  }
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
  const { wallets, addWallet, resetWallet } = useWallet();
  const primaryWallet = wallets?.find(wallet => wallet.isPrimary);
  const [showWallets, setShowWallets] = useState(false);
  return (
    <HomeContainer>
      <WalletContainer>
        <WalletOverview
          onWalletCreateClick={() => {
            resetWallet();
            message.success(`Wallet reset to initial state.`);
          }}
          wallet={primaryWallet}
          onWalletClick={() => setShowWallets(true)}
        />
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
      <XChangeDrawer
        title="Available Wallets"
        placement="bottom"
        closable={false}
        onClose={() => setShowWallets(false)}
        visible={showWallets}
      >
        <WalletList wallets={wallets || []} />
      </XChangeDrawer>
    </HomeContainer>
  );
};

export default HomePage;
