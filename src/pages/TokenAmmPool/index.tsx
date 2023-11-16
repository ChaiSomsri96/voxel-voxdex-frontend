import { Trans } from '@lingui/macro'
import React, { useRef, useState, useEffect } from 'react'
import { Info } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import Card from 'components/Card'
import { AutoColumn } from 'components/Column'
import { useActiveWeb3React } from 'hooks'
import { useProAmmPositions } from 'hooks/useProAmmPositions'
import useTheme from 'hooks/useTheme'
import { InstructionText, PageWrapper, PositionCardGrid, Tab } from 'pages/Pool'
import { useTokenStakingAction } from 'state/nfts/promm/hooks'
import { TYPE } from 'theme'
import ContentLoader from './ContentLoader'
import PositionListItem from './PositionListItem'
import { useBlockNumber } from 'state/application/hooks'

export const TabRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    gap: 1rem;
    width: 100%;
    flex-direction: column;
  `}
`

interface AddressSymbolMapInterface {
  [key: string]: string
}

export default function TokenAmmPool() {
  const { account, chainId } = useActiveWeb3React()
  const tokenAddressSymbolMap = useRef<AddressSymbolMapInterface>({})
  const { positions, loading: positionsLoading } = useProAmmPositions(account)
  const [pools, setPools] = useState<any[]>([])
  const [showStaked, setShowStaked] = useState(false)
  const [loading, setLoading] = useState(true)
  const { fetchPools } = useTokenStakingAction();
  const blockNumber = useBlockNumber()
  const theme = useTheme()

  const getPools = async () => {
    const allPools: any[] = await fetchPools().catch((e) => { setLoading(false); setPools([]); })

    if (allPools) {
      setPools(allPools);
    }

    setLoading(false);
  };

  useEffect(() => {
    getPools();

  }, [chainId, account, showStaked])

  return (
    <>
      <PageWrapper style={{ padding: 0, marginTop: '24px' }}>
        <AutoColumn gap="lg" style={{ width: '100%' }}>
          <InstructionText>
            <Trans>Here you can view all staking pools and staked balances in the Pools</Trans>
          </InstructionText>
          <TabRow>
            <Flex justifyContent="space-between" flex={1} alignItems="center" width="100%">
              <Flex sx={{ gap: '1rem' }} alignItems="center">
                <Tab
                  active={!showStaked}
                  role="button"
                  onClick={() => {
                    setShowStaked(false)
                  }}
                >
                  <Trans>All Staking Pools</Trans>
                </Tab>

                <Tab
                  active={showStaked}
                  onClick={() => {
                    setShowStaked(true)
                  }}
                  role="button"
                >
                  <Trans>Staked Pools</Trans>
                </Tab>
              </Flex>
            </Flex>
          </TabRow>

          {!account ? (
            <Card padding="40px">
              <TYPE.body color={theme.text3} textAlign="center">
                <Flex flexDirection="column" alignItems="center" justifyContent="center" marginTop="60px">
                  <Info size={48} color={theme.subText} />
                  <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                    <Trans>
                      Connect to a wallet to view staking Pools.
                    </Trans>
                  </Text>
                </Flex>
              </TYPE.body>
            </Card>
          ) : positionsLoading || loading ? (
            <PositionCardGrid>
              <ContentLoader />
              <ContentLoader />
              <ContentLoader />
            </PositionCardGrid>
          ) : (pools.length > 0) ? (
            <>
              <PositionCardGrid style={{ display: 'grid' }}>
                {pools.map((p: any) => (
                  <PositionListItem
                    key={p.stakingContract}
                    closedPool={false}
                    showStaked={showStaked}
                    stakedToken={p.stakedToken}
                    rewardToken={p.rewardToken}
                    stakingContract={p.stakingContract}
                  />
                ))}
              </PositionCardGrid>
            </>
          ) : (
            <Flex flexDirection="column" alignItems="center" marginTop="60px">
              <Info size={48} color={theme.subText} />
              <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                <Trans>
                  No Staking pools found. Please visit later.
                </Trans>
              </Text>
            </Flex>
          )}
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
