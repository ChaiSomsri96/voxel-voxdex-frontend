import { Trans } from '@lingui/macro'
import { stringify } from 'qs'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { useFarmAction, useStakingAction } from 'state/nfts/promm/hooks'
import NftCards from 'components/NftPools/NftCards'
import StakedNftCards from 'components/NftPools/StakedNftCards'
import NftStakingGuide from 'components/NftPools/NftStakingGuide'
import useTheme from 'hooks/useTheme'
import {
  PageWrapper,
  PoolTitleContainer,
  Tab,
  TabContainer,
  TabWrapper
} from 'components/NftPools/styleds'

import { VERSION } from 'constants/v2'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useBlockNumber } from 'state/application/hooks'
import { isInEnum } from 'utils/string'
import styled from 'styled-components'
import { NftStakingInfo } from './NftStakingInfo'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { NftStakingButton } from './NftStakingButton'

export const NftCard = styled.div`
    background: #1C1C1C;
    height: auto;
    border-radius: 12px;
    padding: 15px 15px 20px 15px;
    position: relative;
    max-width:320px;
    margin-right:5px;
`
const Details = () => {

  const { nftAddress, stakingAddress } = useParams<{ nftAddress: string, stakingAddress: string }>();
  const theme = useTheme()

  const { fetchBalance, fetchPoolInfo, isApprovedContract, approve } = useFarmAction(stakingAddress, nftAddress)
  const { fetchPools } = useStakingAction();

  const [balance, setBalance] = useState<number>(0)
  const [poolInfo, setPoolInfo] = useState<any>(null)
  const [farm, setFarm] = useState<any>()
  const [isApprovedForAll, setApprovedForAll] = useState<boolean>(false)
  const [approvalTx, setApprovalTx] = useState('')
  const isApprovalTxPending = useIsTransactionPending(approvalTx)



  const getPools = async () => {
    const allPools: any[] = await fetchPools();
    const pools = allPools.filter(function (nftFrm) {

      if (nftFrm.stakingContract == stakingAddress)
        return true;
      else
        return false;

    })
    setFarm(pools[0]);
  };

  useEffect(() => {
    getPools();
  }, [approvalTx, isApprovedForAll])


  const getBalance = async () => {

    setPoolInfo(await fetchPoolInfo());

    const bal = await fetchBalance();
    setBalance(bal.toNumber());
  };

  const below768 = useMedia('(max-width: 768px)')
  const below1500 = useMedia('(max-width: 1500px)')
  const blockNumber = useBlockNumber()

  useEffect(() => {

    getBalance();

  }, [balance, blockNumber])

  const qs = useParsedQueryString()
  const type = qs.type || 'active'
  const farmType = qs.tab && typeof qs.tab === 'string' && isInEnum(qs.tab, VERSION) ? qs.tab : VERSION.ELASTIC
  const history = useHistory()

  const renderTabContent = () => {
    switch (type) {
      case 'active':
        return <NftCards nftAddress={nftAddress} stakingAddress={stakingAddress} />
      case 'ended':
        return <StakedNftCards nftAddress={nftAddress} stakingAddress={stakingAddress} />
      default:
        return <></>
    }
  }

  const { mixpanelHandler } = useMixpanel()

  return (
    <>
      <PageWrapper gap="24px">

        <Flex
          justifyContent='space-between'
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
            <Trans>{farm?.name}</Trans>
          </Text>

          <NftStakingInfo poolInfo={poolInfo} />

        </Flex>

        <NftStakingGuide />

        <div>
          <Flex justifyContent='space-between' alignItems='start'>
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
                      <Trans>Wallet NFTs</Trans>
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
                      <Trans>Staked NFTs</Trans>
                    </span>
                  </PoolTitleContainer>
                </Tab>

              </TabWrapper>
            </TabContainer>


            <NftStakingButton />
          </Flex>

          {renderTabContent()}
        </div>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}

export default Details
