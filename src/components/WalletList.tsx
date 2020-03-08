import React from 'react';
import styled from 'styled-components';
import { WalletType } from '../context/AppContext';
import { List, Avatar } from 'antd';
import { getCurrencyDisplayString } from './CurrencyDisplay';
import CurrencyIcon from './CurrencyIcon';
import { CheckOutlined } from '@ant-design/icons';

interface WalletListProps {
  wallets: WalletType[];
  onMakeWalletPrimary: (wallet: WalletType) => void;
  actionText?: string;
}

const WalletListContainer = styled.div`
  .ant-avatar.ant-avatar-circle {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const PrimaryMark = styled.div``;

const WalletList: React.FC<WalletListProps> = ({
  wallets,
  onMakeWalletPrimary,
  actionText = 'Make Primary',
}) => {
  return (
    <WalletListContainer>
      <List
        itemLayout="horizontal"
        dataSource={wallets}
        renderItem={(item: WalletType) => (
          <List.Item
            actions={
              item.isPrimary
                ? []
                : [
                    <a
                      onClick={() => onMakeWalletPrimary(item)}
                      key={`${item.currency}:make-primary`}
                    >
                      {actionText}
                    </a>,
                  ]
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  icon={<CurrencyIcon currency={item.currency} />}
                />
              }
              title={getCurrencyDisplayString(item.value, item.currency)}
              description={`${item.currency}`}
            />
            {item.isPrimary && (
              <PrimaryMark>
                <CheckOutlined
                  style={{
                    marginRight: '10px',
                    fontSize: '20px',
                  }}
                />
              </PrimaryMark>
            )}
          </List.Item>
        )}
      />
    </WalletListContainer>
  );
};

export default WalletList;
