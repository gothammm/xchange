import React, { useState } from 'react';
import FlexContainer from '../components/FlexContainer';
import styled from 'styled-components';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import XChangeButton from '../components/XChangeButton';
import { useWallet } from '../hooks/WalletHook';
import WalletOverview from '../components/WalletOverview';
import { Drawer, message } from 'antd';
import WalletList from '../components/WalletList';
import { DrawerProps } from 'antd/lib/drawer';
import AddMoneyModal from '../components/AddMoneyModal';

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
  const { wallets, resetWallet, makePrimary, addMoneyToWallet } = useWallet();
  const primaryWallet = wallets?.find(wallet => wallet.isPrimary);
  const [showWallets, setShowWallets] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  return (
    <HomeContainer>
      {primaryWallet && (
        <AddMoneyModal
          show={showAddMoney}
          wallet={primaryWallet}
          onCancel={() => setShowAddMoney(false)}
          onMoneyAdd={(value: number) => {
            addMoneyToWallet(primaryWallet, value);
            setShowAddMoney(false);
            message.success(`Money added successfully!`);
          }}
        />
      )}
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
          onClick={() => setShowAddMoney(true)}
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
        height={300}
        placement="bottom"
        closable={false}
        onClose={() => setShowWallets(false)}
        visible={showWallets}
      >
        <WalletList
          wallets={wallets || []}
          onMakeWalletPrimary={wallet => {
            makePrimary(wallet);
            setShowWallets(false);
          }}
        />
      </XChangeDrawer>
    </HomeContainer>
  );
};

export default HomePage;
