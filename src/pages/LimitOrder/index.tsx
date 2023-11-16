import React from 'react'
import { GelatoLimitOrderPanel, GelatoLimitOrdersHistoryPanel, GelatoProvider, useGelatoLimitOrders } from '@gelatonetwork/limit-orders-react'
import { RouteComponentProps } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import {
  PageWrapper,
  Container,
  SwapFormWrapper,
  InfoComponentsWrapper
} from 'components/swapv2/styleds'


function Gelato({ children }: { children?: React.ReactNode }) {
  const { library, chainId, account } = useActiveWeb3React();
  return (
    <GelatoProvider
      library={library}
      chainId={chainId}
      account={account ?? undefined}

    >
      {children}
    </GelatoProvider>
  );
}

export default function LimitOrder({ history }: RouteComponentProps) {
  const {
    handlers: {
      handleInput,
      handleRateType,
      handleCurrencySelection,
      handleSwitchTokens,
      handleLimitOrderSubmission,
      handleLimitOrderCancellation
    },
    derivedOrderInfo: {
      parsedAmounts,
      currencies,
      currencyBalances,
      trade,
      formattedAmounts,
      inputError,
    },
    orderState: { independentField, rateType, typedValue },
  } = useGelatoLimitOrders();

  console.log("currencies", currencies);

  const theme = useTheme()

  return (
    <PageWrapper>
      <Container>
        <SwapFormWrapper isShowTutorial={false}>
          <Gelato>
            <GelatoLimitOrderPanel />
          </Gelato>
        </SwapFormWrapper>
        <InfoComponentsWrapper>
          <Gelato>
            <GelatoLimitOrdersHistoryPanel />
          </Gelato>
        </InfoComponentsWrapper>


      </Container>
    </PageWrapper>

  )

}