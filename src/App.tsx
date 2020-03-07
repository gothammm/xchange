import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAppStorage } from './hooks/StorageHook';
import HomePage from './pages/HomePage';
import styled from 'styled-components';
import { Button, message } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import AppContext from './context/AppContext';

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  button {
    margin: 1em;
  }
`;

const App: React.FC = () => {
  const { clearStorage, getStorageData, updateStorageData } = useAppStorage();
  return (
    <AppContext.Provider
      value={{
        ...getStorageData(),
        update: updateStorageData,
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
              message.success(`Cleared wallet data.`);
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
