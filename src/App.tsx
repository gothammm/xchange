import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { useAppStorage } from './hooks/StorageHook';
import HomePage from './pages/HomePage';
import styled from 'styled-components';
import { Button, message, Result, Tooltip } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import AppContext from './context/AppContext';
import ExchangePage from './pages/ExchangePage';

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
          <Tooltip placement="bottom" title="To erase all data and start fresh.">
            <Button
              type="primary"
              shape="round"
              icon={<ClearOutlined />}
              size={'large'}
              onClick={() => {
                clearStorage();
                message.warn(`Cleared wallet data.`);
              }}
            >
              Clear Data.
            </Button>
          </Tooltip>
        </Toolbar>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/exchange">
            <ExchangePage />
          </Route>
          <Route
            path="*"
            component={() => {
              const history = useHistory();
              return (
                <Result
                  status="404"
                  title="404"
                  subTitle="Sorry, the page you visited does not exist."
                  extra={
                    <Button type="primary" onClick={() => history.push('/')}>
                      Back Home
                    </Button>
                  }
                />
              );
            }}
          ></Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
