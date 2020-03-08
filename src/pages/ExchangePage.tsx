import React, { useState, useEffect } from 'react';
import CenterPageContainer from '../components/CenterPageContainer';
import { useWallet } from '../hooks/WalletHook';
import CurrencyInput from '../components/CurrencyInput';
import { Empty, Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import FlexContainer from '../components/FlexContainer';
import ExchangeInformation from '../components/ExchangeInformation';
import { useFXApiHook } from '../hooks/FXApiHook';
import { WalletType } from '../context/AppContext';
import { useExchange } from '../hooks/ExchangeHook';

const InputContainer = styled(FlexContainer)`
  justify-content: flex-end;
  flex: none;
`;

const ExchangeButton = styled(Button)`
  margin-top: 2em;
  width: 25em;
`;

const ErrorInWallet: React.FC<{ message: string }> = ({ message }) => {
  const history = useHistory();
  return (
    <CenterPageContainer>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={message}>
        <Button type="primary" onClick={() => history.push('/')}>
          Go Home
        </Button>
      </Empty>
    </CenterPageContainer>
  );
};

const ExchangePage: React.FC = () => {
  const { getPrimaryWallet, wallets } = useWallet();
  const { exchange } = useExchange();
  const history = useHistory();

  if (!wallets) {
    return <ErrorInWallet message={`Data was cleared, no wallet found.`} />;
  }
  const activeWallet = getPrimaryWallet();
  const [exchangeValue, setExchangeValue] = useState<{
    from: number;
    to: number;
  }>({ from: 0, to: 0 });
  const [hasSwapped, setHasSwapped] = useState(false);
  const otherWallets =
    (activeWallet &&
      wallets?.filter(wallet => wallet.id !== activeWallet.id)) ||
    [];

  if (!activeWallet) {
    return <ErrorInWallet message={`Oops, no primary wallet was found.`} />;
  }

  if (otherWallets && otherWallets.length <= 0) {
    return (
      <ErrorInWallet
        message={`Oops, only primary wallet was found, we require more than one wallet for exchange.`}
      />
    );
  }
  const [primaryWallet, setPrimaryWallet] = useState(activeWallet);
  const [secondaryWallet, setSecondaryWallet] = useState(otherWallets[0]);
  const [isExchanging, setIsExchanging] = useState(false);

  const fx = useFXApiHook();

  const fetchFXRate = async (primary: WalletType, secondary: WalletType) => {
    return fx.getFXRate(primary.currency, secondary.currency);
  };

  useEffect(() => {
    // Create interval to constantly call rate.
    const interval = setInterval(() => {
      fetchFXRate(primaryWallet, secondaryWallet);
    }, 1000000);
    fetchFXRate(primaryWallet, secondaryWallet);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const from = exchangeValue.from;
    const to = exchangeValue.to;
    if (from <= 0 && to <= 0) return;
    if (!hasSwapped) return;
    if (fx.error || !fx.result) {
      message.error(`FX Rate data is unavailable, try again.`);
      return;
    }
    const doReverse = activeWallet.currency !== fx.result.from;
    if (primaryWallet.id !== activeWallet.id) {
      return setExchangeValue({
        to: from,
        from: fx.getFXValue(fx.result, from, doReverse),
      });
    }
    if (primaryWallet.id === activeWallet.id) {
      return setExchangeValue({
        from: to,
        to: fx.getFXValue(fx.result, to, doReverse),
      });
    }
  }, [primaryWallet.id, secondaryWallet.id]);

  return (
    <CenterPageContainer>
      <InputContainer>
        <CurrencyInput
          wallet={primaryWallet}
          onChange={value => {
            setExchangeValue({
              from: value,
              to:
                !fx.error && fx.result
                  ? fx.getFXValue(fx.result, value)
                  : value,
            });
          }}
          value={exchangeValue.from}
        />
      </InputContainer>
      <ExchangeInformation
        isLoading={fx.isLoading}
        conversionRate={fx.result}
        primary={primaryWallet}
        secondary={secondaryWallet}
        onRefreshRate={() => fetchFXRate(primaryWallet, secondaryWallet)}
        onSwap={(newPrimary, newSecondary) => {
          setPrimaryWallet(newPrimary);
          setSecondaryWallet(newSecondary);
          fetchFXRate(newPrimary, newSecondary);
          !hasSwapped && setHasSwapped(true);
        }}
      />
      <InputContainer>
        <CurrencyInput
          wallet={secondaryWallet}
          onChange={value => {
            setExchangeValue({
              to: value,
              from:
                !fx.error && fx.result
                  ? fx.getFXValue(fx.result, value)
                  : value,
            });
          }}
          value={exchangeValue.to}
        />
      </InputContainer>
      <ExchangeButton
        loading={isExchanging}
        disabled={exchangeValue.from <= 0 && exchangeValue.to <= 0}
        type="primary"
        shape="round"
        onClick={() => {
          setIsExchanging(true);
          exchange(
            primaryWallet,
            exchangeValue.from / 100,
            secondaryWallet,
            exchangeValue.to / 100
          )
            .then(() => {
              message.success(`Exchange successful!`);
              history.push('/');
            })
            .catch(e => {
              message.error(e);
            })
            .finally(() => setIsExchanging(false));
        }}
      >
        Exchange
      </ExchangeButton>
    </CenterPageContainer>
  );
};

export default ExchangePage;
