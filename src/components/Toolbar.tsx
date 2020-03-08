import React from 'react';
import styled from 'styled-components';
import { Tooltip, Button } from 'antd';
import { ClearOutlined, HomeOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  button {
    margin: 1em;
  }
  justify-content: space-between;
`;

const Toolbar: React.FC<{
  onClearStorageClick: () => void;
}> = ({ onClearStorageClick }) => {
  const history = useHistory();
  return (
    <ToolbarWrapper>
      <Tooltip placement="bottom" title="Go home">
        <Button
          shape="circle"
          icon={<HomeOutlined />}
          onClick={() => history.replace('/')}
        />
      </Tooltip>
      <Tooltip placement="bottom" title="To erase all data and start fresh.">
        <Button
          type="primary"
          shape="round"
          icon={<ClearOutlined />}
          size={'large'}
          onClick={onClearStorageClick}
        >
          Clear Data.
        </Button>
      </Tooltip>
    </ToolbarWrapper>
  );
};

export default Toolbar;
