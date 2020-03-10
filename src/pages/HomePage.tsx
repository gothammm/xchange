import React, { useState } from 'react';
import FlexContainer from '../components/FlexContainer';
import styled from 'styled-components';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import XChangeButton from '../components/XChangeButton';
import { useWallet } from '../hooks/WalletHook';
import WalletOverview from '../components/WalletOverview';
import AddMoneyModal from '../components/AddMoneyModal';
import { useHistory } from 'react-router-dom';
import CenterPageContainer from '../components/CenterPageContainer';
import WalletSelect from '../components/WalletSelect';
import { WalletType } from '../context/AppContext';
import { message } from 'antd';

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
  const { wallets, resetWallet, makePrimary, addMoneyToWallet, getPrimaryWallet } = useWallet();
  const primaryWallet = getPrimaryWallet();
  const [showWallets, setShowWallets] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const history = useHistory();
  return (
    <CenterPageContainer>
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
          onClick={() => history.push('/exchange')}
        />
      </ActionBarContainer>
      <WalletSelect
        onWalletSelect={(wallet: WalletType) => {
          makePrimary(wallet);
          setShowWallets(false);
        }}
        show={showWallets}
        onClose={() => setShowWallets(false)}
        wallets={wallets}
        headerText={`Available Wallets`}
        actionText={`Make primary`}
      />
    </CenterPageContainer>
  );
};

export default HomePage;
