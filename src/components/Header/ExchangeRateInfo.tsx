import styled from 'styled-components'
import useMarketTokenInfo from 'hooks/useMarketTokenInfo'
import { NETWORKS_INFO } from 'constants/networks'
import { formattedNum } from 'utils'
import { ChainId } from '@kyberswap/ks-sdk-core'
import Row from 'components/Row'
import Card from 'components/Card'

const NetworkSwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: fit-content;
`

const NetworkCard = styled(Card)`
  position: relative;
  background-color: ${({ theme }) => theme.buttonBlack};
  color: ${({ theme }) => theme.text};
  border-radius: 999px;
  padding: 8px 12px;
  border: 1px solid transparent;
  min-width: fit-content;


  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.2rem;
    width: initial;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: auto;

  `};
   ${({ theme }) => theme.mediaWidth.belowExtraSmall`
    display:none;
  `};
`

const NetworkLabel = styled.div`
  white-space: nowrap;
  font-weight: 500;
  margin-left:5px;

`


export default function ExchangeRateInfo() {

  const tokenAddress = NETWORKS_INFO[ChainId.MAINNET].marketToken.address;
  


  const { data: tokenInfo, loading } = useMarketTokenInfo(tokenAddress)

  return (
      <NetworkCard  role="button">
      <NetworkSwitchContainer>
        <Row>
          <img src={ tokenInfo?.logo }
            alt={tokenInfo?.name}
            style={{ width: 20, height: 20, marginRight: '2px' }}
          />
          <NetworkLabel>{formattedNum((tokenInfo?.price).toString(), true)}</NetworkLabel>
        </Row>
       
      </NetworkSwitchContainer>
     
    </NetworkCard>

  )
}
