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

const makeNumberEvenOrOdd = (
  value: number,
  predicate: (val: number) => boolean
) => {
  if (value <= 0) return 0;
  if (predicate(value)) return value;
  const odd = value + 1;
  return odd > 4 ? value - 2 : odd;
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

  const [swapCounter, setSwapCounter] = useState(0);
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

  const syncFXRate = useRef<() => void>();

  const defaultWalletChangeUseEffectDeps = [
    primaryWallet.id,
    secondaryWallet.id,
    fx.result?.rate,
  ];

  useEffect(() => {
    const interval = setInterval(
      () => syncFXRate.current && syncFXRate.current(),
      10000
    );
    fetchFXRate(primaryWallet, secondaryWallet);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    syncFXRate.current = () => {
      fetchFXRate(primaryWallet, secondaryWallet);
      message.info(`Exchange rate has been refreshed`);
    };
    fetchFXRate(primaryWallet, secondaryWallet);
  }, [secondaryWallet.id, primaryWallet.id]);

  useEffect(() => {
    if (swapCounter % 2 !== 0) {
      return;
    }
    const from = exchangeValue.from;
    const to = exchangeValue.to;
    if (from <= 0 && to <= 0) return;
    if (fx.error || !fx.result) {
      message.error(`FX Rate data is unavailable, try again.`);
      return;
    }
    if (
      fx.result.from !== primaryWallet.currency ||
      fx.result.to !== secondaryWallet.currency
    ) {
      return;
    }
    return setExchangeValue({
      to: from,
      from: fx.getFXValue(fx.result, from, true),
    });
  }, defaultWalletChangeUseEffectDeps);

  useEffect(() => {
    if (swapCounter % 2 === 0) {
      return;
    }
    const from = exchangeValue.from;
    const to = exchangeValue.to;
    if (from <= 0 && to <= 0) return;
    if (fx.error || !fx.result) {
      message.error(`FX Rate data is unavailable, try again.`);
      return;
    }
    if (
      fx.result.from !== primaryWallet.currency ||
      fx.result.to !== secondaryWallet.currency
    ) {
      return;
    }
    return setExchangeValue({
      from: from,
      to: fx.getFXValue(fx.result, from),
    });
  }, defaultWalletChangeUseEffectDeps);

  return (
    <CenterPageContainer>
      <CenterContainer>
        <InputContainer>
          <CurrencyInput
            prefixText={'-'}
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
            setSwapCounter(
              makeNumberEvenOrOdd(2, val => val % 2 === 0)
            );
          }}
        />
        <InputContainer>
          <CurrencyInput
            prefixText={'+'}
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
          setSwapCounter(
            makeNumberEvenOrOdd(2, val => val % 2 !== 0)
          );
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
        actionText={`Select`}
        headerText={`Available Wallets / Currency`}
      />
    </CenterPageContainer>
  );
};

export default ExchangePage;
