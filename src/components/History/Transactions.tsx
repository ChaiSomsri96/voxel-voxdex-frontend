import React  from 'react'
import { useActiveWeb3React } from 'hooks'
import { useTradeHistory,useLiquidityHistory } from 'state/prommPools/hooks'
import { NETWORKS_INFO } from 'constants/networks'
import { ChainId,Currency} from '@kyberswap/ks-sdk-core'
import { Flex, Text } from 'rebass'
import { Trans } from '@lingui/macro'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import Divider from 'components/Divider'
import { formatBalance } from 'utils/formatBalance'
import moment from 'moment';
import { Info } from 'react-feather'
import { useCurrencyConvertedToNative } from 'utils/dmm'

const TableHeader = styled.div<{ fade?: boolean; oddRow?: boolean }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1.5fr 1fr 0.75fr 1fr 1.5fr 1fr 140px;
  grid-template-areas: 'pools liq apy vesting_duration reward staked_balance action';
  padding: 16px 24px;
  font-size: 12px;
  align-items: center;
  height: fit-content;
  position: relative;
  opacity: ${({ fade }) => (fade ? '0.6' : '1')};
  background-color: ${({ theme }) => theme.tableHeader};
  border-top-left-radius: 1.25rem;
  border-top-right-radius: 1.25rem;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04);

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-gap: 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-gap: 1.5rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-gap: 1.5rem;
  `};
`

 const ProMMFarmTableHeader = styled(TableHeader)`
  grid-template-columns: 30px 320px 200px;
  grid-template-areas: 'usd_value token0 time';
  grid-gap: 2rem;

  border-top-left-radius: 0;
  border-top-right-radius: 0;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 30px 320px 200px;
    grid-gap: 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 30px 150px 100px;
    grid-gap: 1rem;
  `}

 
`
const FarmContent = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 20px;
  overflow: hidden;
`

const TransactionRow= styled.div`
 display:flex;
 gap: 10px;
 align-items: baseline;
 ${({ theme }) => theme.mediaWidth.upToLarge`
    display:block;
    grid-gap: 0px;
 `};
`

 const TransactionWrapper = styled.div<{ isShowTutorial?: boolean }>`
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right:10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-bottom:10px;
     margin-right:0px;
  `}
`

export default function Transactions({ currencyIn, currencyOut }: { currencyIn?: Currency; currencyOut?: Currency }) {

  const inputNativeCurrency = useCurrencyConvertedToNative(currencyIn)
  const outputNativeCurrency = useCurrencyConvertedToNative(currencyOut)

  const token0 = inputNativeCurrency?.wrapped
  const token1 = outputNativeCurrency?.wrapped
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  const apolloClient = NETWORKS_INFO[chainId || ChainId.MAINNET].elasticClient
  const etherscanUrl=   NETWORKS_INFO[chainId || ChainId.MAINNET].etherscanUrl;
  const tradeData=useTradeHistory(apolloClient,token0,
        token1,"desc");

  const liquidityData=useLiquidityHistory(apolloClient,token0,
        token1,"desc");




 const renderTradeHistoryGroupHeaderOnDesktop = () => {
    return (
      <Flex
        sx={{
          alignItems: 'center',
          padding: '0 1rem',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        <Text
          sx={{
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '20px',
            color: theme.subText,
          }}
        >
          <Trans>Trade History</Trans>
        </Text>
    </Flex>
        )

  }

   const renderLiquidityHistoryGroupHeaderOnDesktop = () => {
    return (
      <Flex
        sx={{
          alignItems: 'center',
          padding: '0 1rem',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        <Text
          sx={{
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '20px',
            color: theme.subText,
          }}
        >
          <Trans>Liquidity History</Trans>
        </Text>
    </Flex>
        )

  }

    const renderTradeTableRowOnDesktop=(data:any)=>{
       return ( <ProMMFarmTableHeader>
        <Flex grid-area="usd_value" alignItems="center" justifyContent="flex-start">
          
           
           {data?.amountUSD &&  <Trans>{formatBalance(data?.amountUSD)} </Trans>}

         
         
        </Flex>

        <Flex grid-area="token0" alignItems="center" justifyContent="flex-start">
         
            <a rel="noreferrer" href={`${etherscanUrl}/tx/${data?.transaction?.id}`} target="_blank"><Trans> {data?.amount0 && <>{formatBalance(data?.amount0)} </>} {data?.token0?.symbol} - {data?.amount1 && <>{formatBalance(data?.amount1)} </>} {data?.token1?.symbol}</Trans></a>
           
          
        </Flex>

       
       

        <Flex grid-area="time" alignItems="center" justifyContent="flex-end" style={{'textTransform':'capitalize'}}>
         
            <Trans>{ moment(new Date(data?.timestamp*1000)).fromNow()}</Trans>
          

        </Flex>


      </ProMMFarmTableHeader>)

    }
    const renderTradeTableHeaderOnDesktop = () => {
    return (
      <ProMMFarmTableHeader>
        <Flex grid-area="usd_value" alignItems="center" justifyContent="flex-start">
          
            <Trans>USD</Trans>
         
        </Flex>

        <Flex grid-area="token0" alignItems="center" justifyContent="flex-start">
         
            <Trans>Amount</Trans>
          
        </Flex>

        
        <Flex grid-area="time" alignItems="center" justifyContent="flex-end">
         
            <Trans>Time</Trans>
          

        </Flex>


      </ProMMFarmTableHeader>
    )
  }

  return (
   <TransactionRow> 
   <TransactionWrapper> 
   <FarmContent>
   <>
   {renderTradeHistoryGroupHeaderOnDesktop()}
   {renderTradeTableHeaderOnDesktop()}
   </>

    <Divider />
 <div className="tableBody">

     {!tradeData.loading && tradeData?.data?.swaps.length<1 && <Flex flexDirection="column" alignItems="center" 
     justifyContent="center" paddingTop="50px">
                <Info size={48} color={theme.subText}   />
                <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                  <Trans>
                    No Trading History Available.
                  </Trans>
                </Text>
              </Flex> 
     }

    {!tradeData.loading && tradeData?.data?.swaps.map((swap:any, index:any) => {
        return (
          renderTradeTableRowOnDesktop(swap)
        )
      })}
 </div>
   </FarmContent>
   </TransactionWrapper>

  <TransactionWrapper> 
   <FarmContent>
   <>
   {renderLiquidityHistoryGroupHeaderOnDesktop()}
   {renderTradeTableHeaderOnDesktop()}
   </>

   <Divider />
   <div className="tableBody">
     {!liquidityData.loading && liquidityData?.data?.mints.length<1 && 
      <Flex flexDirection="column" alignItems="center" 
     justifyContent="center" paddingTop="50px">
                <Info size={48} color={theme.subText} />
                <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                  <Trans>
                    No Liquidity History Available.
                  </Trans>
                </Text>
              </Flex> 
     }


    {!liquidityData.loading && liquidityData?.data?.mints.map((mint:any, index:any) => {
        return (
          renderTradeTableRowOnDesktop(mint)
        )
      })}

    
   </div>
   </FarmContent>
   </TransactionWrapper>
   </TransactionRow>
  )
}

