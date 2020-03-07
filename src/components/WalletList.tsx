import React from 'react';
import styled from 'styled-components';
import { WalletType } from '../context/AppContext';
import { List, Avatar } from 'antd';
import { getCurrencyDisplayString } from './CurrencyDisplay';

interface WalletListProps {
  wallets: WalletType[];
}

const WalletListContainer = styled.div``;

const WalletList: React.FC<WalletListProps> = ({ wallets }) => {
  return (
    <WalletListContainer>
      <List
        itemLayout="horizontal"
        dataSource={wallets}
        renderItem={(item: WalletType) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={getCurrencyDisplayString(item.value, item.currency)}
              description={`${item.currency}`}
            />
          </List.Item>
        )}
      />
    </WalletListContainer>
  );
};

export default WalletList;
