import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAppStorage } from './hooks/StorageHook';
import AppContext from './context/AppContext';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  const { getStorageData, updateStorageData } = useAppStorage();
  return (
    <AppContext.Provider
      value={{ ...getStorageData(), update: updateStorageData }}
    >
      <Router>
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
