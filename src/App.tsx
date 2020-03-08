import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';
import { useAppStorage } from './hooks/StorageHook';
import HomePage from './pages/HomePage';
import { Button, Result, message } from 'antd';
import AppContext from './context/AppContext';
import ExchangePage from './pages/ExchangePage';
import Toolbar from './components/Toolbar';

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
        <Toolbar
          onClearStorageClick={() => {
            clearStorage();
            message.warn(`Cleared wallet data.`);
          }}
        />
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
