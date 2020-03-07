import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAppStorage } from './hooks/StorageHook';
import { initialWalletData } from './hooks/WalletHook';
import AppContext from './context/AppContext';
import HomePage from './pages/HomePage';
import styled from 'styled-components';
import { Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  button {
    margin: 1em;
  }
`;

const App: React.FC = () => {
  const { getStorageData, updateStorageData, clearStorage } = useAppStorage();
  const xChangeStorageData = getStorageData();
  return (
    <AppContext.Provider
      value={{
        ...getStorageData(),
        update: updateStorageData,
        wallets:
          xChangeStorageData.wallets && xChangeStorageData.wallets.length > 0
            ? xChangeStorageData.wallets
            : initialWalletData,
      }}
    >
      <Router>
        <Toolbar>
          <Button
            type="primary"
            shape="round"
            icon={<ClearOutlined />}
            size={'large'}
            onClick={() => {
              clearStorage();
            }}
          >
            Clear Data.
          </Button>
        </Toolbar>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
