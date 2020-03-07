import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import CurrencyInput from './CurrencyInput';
import { WalletType } from '../context/AppContext';

const AddMoneyModalWrapper = styled.div``;

interface AddMoneyModalProps {
  wallet: WalletType;
  show: boolean;
  onMoneyAdd: (value: number) => void;
  onCancel: () => void;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  wallet,
  show,
  onCancel,
  onMoneyAdd,
}) => {
  const [value, setValue] = useState(0);
  return (
    <AddMoneyModalWrapper>
      <Modal
        closable={false}
        visible={show}
        onCancel={onCancel}
        okText="Add money"
        onOk={() => {
          onMoneyAdd(value / 100);
          setValue(0);
        }}
      >
        <CurrencyInput wallet={wallet} onChange={setValue} value={value} />
      </Modal>
    </AddMoneyModalWrapper>
  );
};

export default AddMoneyModal;
