import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { ChevronDown } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import { BestPrice, LowestSlippage, MoneyBagOutline } from 'components/Icons'
import AntiSnippingAttack from 'components/Icons/AntiSnippingAttack'
import Loader from 'components/Loader'
import { VERSION } from 'constants/v2'
import useParsedQueryString from 'hooks/useParsedQueryString'
import useTheme from 'hooks/useTheme'
import { useGlobalData } from 'state/about/hooks'
import { ExternalLink } from 'theme'
import { formatBigLiquidity } from 'utils/formatBalance'

const Wrapper = styled.div`
  gap: 12px;
  display: flex;

  @media only screen and (max-width: 880px) {
    display: none;
  }
`

const ShowDetailBtn = styled.button<{ isOpen?: boolean }>`
  border: none;
  outline: none;
  line-height: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s;
  transform: rotate(${({ isOpen }) => (isOpen ? '-180deg' : 0)});
  color: ${({ theme }) => theme.text};
`

const DetailWrapper = styled.div<{ isOpen?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 24px;
  margin-top: ${({ isOpen }) => (isOpen ? '16px' : 0)};
  height: ${({ isOpen }) => (isOpen ? 'auto' : 0)};
  max-height: ${({ isOpen }) => (isOpen ? '1000px' : 0)};
  transition: margin-top 200ms ease, height 200ms ease;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToMedium`
      grid-template-columns: 1fr;
  `}
`

const DetailWrapperClassic = styled(DetailWrapper)`
  grid-template-columns: 1fr 1fr 1fr;

  ${({ theme }) => theme.mediaWidth.upToMedium`
      grid-template-columns: 1fr;
  `}
`
const DetailItem = styled.div`
  border-radius: 20px;
  padding: 16px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.subText};
  font-size: 12px;
  display: flex;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
      background: transparent;
      grid-template-columns: 1fr;
      align-items: center;
      padding: 0;
      gap: 12px;
  `}
`

export const GlobalData = () => {
  const data = useGlobalData()

  const globalData = data && data.dmmFactories[0]
  const aggregatorData = data?.aggregatorData

  return (
    <Wrapper>
      <GlobalDataItem>
        <GlobalDataItemTitle>
          <Trans>Total Trading Volume:</Trans>&nbsp;
        </GlobalDataItemTitle>
        <GlobalDataItemValue>
          {aggregatorData?.totalVolume ? formatBigLiquidity(aggregatorData.totalVolume, 2, true) : <Loader />}
        </GlobalDataItemValue>
      </GlobalDataItem>
      <GlobalDataItem>
        <GlobalDataItemTitle>
          <Trans>Total Value Locked:</Trans>&nbsp;
        </GlobalDataItemTitle>
        <GlobalDataItemValue>
          {globalData ? formatBigLiquidity(globalData.totalLiquidityUSD, 2, true) : <Loader />}
        </GlobalDataItemValue>
      </GlobalDataItem>
    </Wrapper>
  )
}

export const Instruction = () => {
  const qs = useParsedQueryString()
  const tab = (qs.tab as string) || VERSION.ELASTIC

  const theme = useTheme()

  const [show, setShow] = useState(!isMobile) // hide by default on mobile

  return (
    <InstructionItem>
      <Flex justifyContent="space-between" alignItems="center">
        <Text lineHeight="24px">
          <Trans>Add liquidity to our Pools and earn trading fees automatically.</Trans>
         
          &nbsp;
          <ExternalLink
            href={'https://voxelxnetwork2.gitbook.io/guides/creating-a-pool'}
          >
            <Trans>Learn More ↗</Trans>
          </ExternalLink>
        </Text>
        <ShowDetailBtn isOpen={show} onClick={() => setShow(prev => !prev)}>
          <ChevronDown size={24} />
        </ShowDetailBtn>
      </Flex>

        <DetailWrapper isOpen={show}>
          <DetailItem>
            <BestPrice size={24} />
            <Text flex={1}>Add liquidity in any price range you want and earn more with concentrated liquidity</Text>
          </DetailItem>

          <DetailItem>
            <LowestSlippage size={24} />
            <Text flex={1}>Your trading fee earnings will be compounded automatically (in the full price range)</Text>
          </DetailItem>

          <DetailItem>
            <MoneyBagOutline size={24} color={theme.primary} />
            <Text flex={1}>Collect your fee earnings whenever you want, without removing your initial liquidity</Text>
          </DetailItem>

          <DetailItem>
            <AntiSnippingAttack size={24} />
            <Text flex={1}>
              We protect liquidity providers like you from sniping attacks so you continue to earn more trading fees
            </Text>
          </DetailItem>
        </DetailWrapper>
  
    </InstructionItem>
  )
}

const GlobalDataItem = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.background};
  padding: 6px 12px;
  border-radius: 999px;
`

const GlobalDataItemTitle = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.subText};
`

const GlobalDataItemValue = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`

const InstructionItem = styled.div`
  padding: 1rem 0;
  font-size: 12px;
  color: ${({ theme }) => theme.subText};
  line-height: 1.5;
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`
