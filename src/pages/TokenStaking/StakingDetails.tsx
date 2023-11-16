import { stringify } from 'qs'
import { useState, useEffect } from 'react'
import { useHistory,useParams} from 'react-router-dom'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import {useFarmAction,useStakingAction } from 'state/nfts/promm/hooks'
import NftCards from 'components/NftPools/NftCards'
import StakedNftCards from 'components/NftPools/StakedNftCards'
import NftStakingGuide from 'components/NftPools/NftStakingGuide'
import { MouseoverTooltip } from 'components/Tooltip'
import useTheme from 'hooks/useTheme'
import {
  PageWrapper,
  PoolTitleContainer,
  Tab,
  TabContainer,
  TabWrapper,
  TopBar,
} from 'components/NftPools/styleds'

import { VERSION } from 'constants/v2'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useBlockNumber } from 'state/application/hooks'
import { isInEnum } from 'utils/string'
import styled from 'styled-components'

export const NftCard= styled.div`
    background: #1C1C1C;
    height: auto;
    border-radius: 12px;
    padding: 15px 15px 20px 15px;
    position: relative;
    max-width:320px;
    margin-right:5px;
`
const StakingDetails = () => {

  const { tokenAddress,stakingAddress } = useParams<{ tokenAddress: string,stakingAddress: string }>();
   const theme = useTheme()

   const { fetchBalance } = useFarmAction(stakingAddress,tokenAddress)
   const { fetchPools } = useStakingAction();

   const [balance, setBalance] = useState<number>(0)
  
   const [farm, setFarm] = useState<any>(null)

   const getPools = async () => {
      const allPools:any[]= await fetchPools();

     const pools= allPools.filter(function(nftFrm){

        if(nftFrm.stakingContract=== stakingAddress)
          return true;
        else
          return false;

      })
      setFarm(pools[0]);
      
   };

  useEffect( () => {
      getPools();

  }, ["farm"])


  const getBalance = async () => {
    const bal=await fetchBalance();
      setBalance(bal.toNumber());
  };
 
 const below768 = useMedia('(max-width: 768px)')
 const below1500 = useMedia('(max-width: 1500px)')


 const blockNumber = useBlockNumber()
  useEffect( () => {
    
    getBalance();

  }, [balance,blockNumber])

  const qs = useParsedQueryString()
  const type = qs.type || 'active'
  const farmType = qs.tab && typeof qs.tab === 'string' && isInEnum(qs.tab, VERSION) ? qs.tab : VERSION.ELASTIC
  const history = useHistory()

  const renderTabContent = () => {
    switch (type) {
      case 'active':
        return <NftCards nftAddress={tokenAddress} stakingAddress={stakingAddress} />
      case 'ended':
        return <StakedNftCards nftAddress={tokenAddress} stakingAddress={stakingAddress} />
      default:
        return <></>
    }
  }



  const { mixpanelHandler } = useMixpanel()
 
  return (
    <>
      <PageWrapper gap="24px">
        <TopBar>
    
     <Flex>
     <MouseoverTooltip text={''}>
        <Flex
          alignItems={'center'}
     
        >
          <Text
            fontWeight={500}
            fontSize={[18, 20, 24]}
            color={theme.primary}
            width={'auto'}
            marginRight={'5px'}
            role="button"
            
          >
            {farm?.name}
          </Text>
          
        </Flex>
      </MouseoverTooltip>

    </Flex>
     
        </TopBar>

        <NftStakingGuide />

      <div>
          <TabContainer>
            <TabWrapper>
              <Tab
                onClick={() => {
                  if (type && type !== 'active') {
                    mixpanelHandler(MIXPANEL_TYPE.FARMS_ACTIVE_VIEWED)
                  }
                  const newQs = { ...qs, type: 'active' }
                  history.push({
                    search: stringify(newQs),
                  })
                }}
                isActive={!type || type === 'active'}
              >
                <PoolTitleContainer>
                  <span>
                    Wallet NFTs
                  </span>
                </PoolTitleContainer>
              </Tab>
              <Tab
                onClick={() => {
                  if (type !== 'ended') {
                    mixpanelHandler(MIXPANEL_TYPE.FARMS_ENDING_VIEWED)
                  }
                  const newQs = { ...qs, type: 'ended' }
                  history.push({
                    search: stringify(newQs),
                  })
                }}
                isActive={type === 'ended'}
              >
                <PoolTitleContainer>
                  <span>
                    Staked NFTs
                  </span>
                </PoolTitleContainer>
              </Tab>

            </TabWrapper>
          </TabContainer>
          {renderTabContent()}
        </div>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}

export default StakingDetails
