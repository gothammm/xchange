import React, { useState, useEffect, useRef } from 'react';
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
import WalletSelect from '../components/WalletSelect';

const InputContainer = styled(FlexContainer)`
  justify-content: flex-end;
  flex: none;
`;

const CenterContainer = styled(FlexContainer)`
  justify-content: center;
`;

const ExchangeButton = styled(Button)`
  margin-top: 2em;
`;

const ErrorInWallet: React.FC<{ message: string; onHomeClick: () => void }> = ({
  message,
  onHomeClick,
}) => {
  return (
    <CenterPageContainer>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={message}>
        <Button type="primary" onClick={onHomeClick}>
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
    return (
      <ErrorInWallet
        onHomeClick={() => history.push('/')}
        message={`Data was cleared, no wallet found.`}
      />
    );
  }
  const activeWallet = getPrimaryWallet();
  const [showWallets, setShowWallets] = useState(false);

  const [hasSwapped, setHasSwapped] = useState(false);
  const otherWallets =
    (activeWallet &&
      wallets?.filter(wallet => wallet.id !== activeWallet.id)) ||
    [];
  const [secondaryWallet, setSecondaryWallet] = useState(otherWallets[0]);
  const [isExchanging, setIsExchanging] = useState(false);
  const [walletToChange, setWalletToChange] = useState<WalletType | null>(null);
  const fx = useFXApiHook();
  const [exchangeValue, setExchangeValue] = useState<{
    from: number;
    to: number;
  }>({ from: 0, to: 0 });

  if (!wallets) {
    return (
      <ErrorInWallet
        onHomeClick={() => history.push('/')}
        message={`Data was cleared, no wallet found.`}
      />
    );
  }

  if (!activeWallet) {
    return (
      <ErrorInWallet
        onHomeClick={() => history.push('/')}
        message={`Oops, no primary wallet was found.`}
      />
    );
  }
  const [primaryWallet, setPrimaryWallet] = useState(activeWallet);

  if (otherWallets && otherWallets.length <= 0) {
    return (
      <ErrorInWallet
        onHomeClick={() => history.push('/')}
        message={`Oops, only primary wallet was found, we require more than one wallet for exchange.`}
      />
    );
  }

  const fetchFXRate = async (primary: WalletType, secondary: WalletType) => {
    return fx.getFXRate(primary.currency, secondary.currency);
  };

  const onWalletChange = (wallet: WalletType) => {
    setWalletToChange(wallet);
    setShowWallets(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFXRate(primaryWallet, secondaryWallet);
      message.info(`Exchange rate has been refreshed`);
    }, 10000);
    fetchFXRate(primaryWallet, secondaryWallet);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchFXRate(primaryWallet, secondaryWallet);
  }, [secondaryWallet.id, primaryWallet.id]);

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
      <CenterContainer>
        <InputContainer>
          <CurrencyInput
            onWalletChange={onWalletChange}
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
            onWalletChange={onWalletChange}
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
                setIsExchanging(false);
                history.push('/');
              })
              .catch(e => {
                setIsExchanging(false);
                message.error(e);
              });
          }}
        >
          Exchange
        </ExchangeButton>
      </CenterContainer>
      <WalletSelect
        onWalletSelect={(wallet: WalletType) => {
          if (!walletToChange || !wallet) {
            return;
          }
          if (walletToChange.id === wallet.id) return;
          if (walletToChange.id === primaryWallet.id) {
            setPrimaryWallet(wallet);
            secondaryWallet.id === wallet.id &&
              setSecondaryWallet(primaryWallet);
            fetchFXRate(wallet, primaryWallet);
          } else if (walletToChange.id === secondaryWallet.id) {
            setSecondaryWallet(wallet);
            primaryWallet.id === wallet.id && setPrimaryWallet(secondaryWallet);
            fetchFXRate(secondaryWallet, wallet);
          }
          setShowWallets(false);
        }}
        show={showWallets}
        onClose={() => setShowWallets(false)}
        wallets={
          wallets.map(wallet =>
            walletToChange && walletToChange.id === wallet.id
              ? { ...wallet, isPrimary: true }
              : { ...wallet, isPrimary: false }
          ) || []
        }
        text={`Available Wallets / Currency`}
      />
    </CenterPageContainer>
  );
};

export default ExchangePage;
