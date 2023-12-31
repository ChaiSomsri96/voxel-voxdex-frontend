import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Edit2, Eye } from 'react-feather'
import { useMedia } from 'react-use'
import { Flex } from 'rebass'
import styled from 'styled-components'

import { Drop, MoneyBagOutline } from 'components/Icons'
import AgriCulture from 'components/Icons/AgriCulture'
import Deposit from 'components/Icons/Deposit'
import { VERSION } from 'constants/v2'
import useTheme from 'hooks/useTheme'
import { ExternalLink, StyledInternalLink } from 'theme'

import { ProMMFarmGuide, ProMMFarmGuideWrapper } from './styleds'

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.primary};
`

const Highlight = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`

const guideStepByVersion: Record<
  VERSION,
  Array<{
    icon: React.ReactElement
    content: React.ReactElement
    title: string
  }>
> = {
  [VERSION.ELASTIC]: [
    {
      content: (
        <Trans>
          <Highlight>Identify</Highlight> the Elastic farm you would like to participate in
        </Trans>
      ),
      icon: <Eye size={20} />,
      title: 'Step 1',
    },
    {
      content: (
        <Trans>
          <Highlight>Add liquidity</Highlight> to the corresponding{' '}
          {<StyledInternalLink to="/pools"> pool</StyledInternalLink>} and receive a NFT token for
          your liquidity position
        </Trans>
      ),
      icon: <Drop size={20} />,
      title: 'Step 2',
    },
    {
      content: (
        <Trans>
          <Highlight>Approve</Highlight> the farming contract (if you haven&apos;t) to let it access your liquidity
          positions (NFT tokens)
        </Trans>
      ),
      icon: <Edit2 size={18} />,
      title: 'Step 3',
    },
    {
      content: (
        <Trans>
          <Highlight>Deposit</Highlight> your liquidity position (NFT token) into the farming contract. Then{' '}
          <Highlight>stake</Highlight> it into the farm
        </Trans>
      ),
      icon: <Deposit width={20} height={20} />,
      title: 'Step 4',
    },
    {
      content: (
        <Trans>
          <Highlight>Harvest</Highlight> your farming rewards whenever you want
        </Trans>
      ),
      icon: <AgriCulture width={20} height={20} />,
      title: 'Step 5',
    },
    {
      content: (
        <Trans>
          <Highlight>Claim</Highlight> your farming rewards from the{' '}
          <StyledInternalLink to="/farms?type=vesting">Vesting</StyledInternalLink> tab! Note: some farms
          may have a vesting period
        </Trans>
      ),
      icon: <MoneyBagOutline size={20} />,
      title: 'Step 6',
    },
  ],
  [VERSION.CLASSIC]: [
    {
      content: <Trans>Identify the Classic farm you would like to participate in</Trans>,
      icon: <Eye size={20} />,
      title: 'Step 1',
    },
    {
      content: (
        <Trans>
          Add liquidity to the corresponding{' '}
          <StyledInternalLink to="/pools?tab=classic">Classic pool</StyledInternalLink> to receive Liquidity Provider
          (LP) tokens
        </Trans>
      ),
      icon: <Drop size={20} />,
      title: 'Step 2',
    },
    {
      content: <Trans>Stake your LP tokens in the farm you identified earlier</Trans>,
      icon: <Deposit width={20} height={20} />,
      title: 'Step 3',
    },
    {
      content: <Trans>Harvest your farming rewards whenever you want</Trans>,
      icon: <AgriCulture width={20} height={20} />,
      title: 'Step 4',
    },
    {
      content: <Trans>Claim your farming rewards! (Note: some farms may have a vesting period)</Trans>,
      icon: <MoneyBagOutline size={20} />,
      title: 'Step 5',
    },
  ],
}

function NftStakingGuide() {
  const [show, setShow] = useState(!isMobile)
  const theme = useTheme()
  const upToMedium = useMedia('(max-width: 992px)')


  return (
    <ProMMFarmGuideWrapper>
      <Flex justifyContent="space-between" alignItems="center">
        <ProMMFarmGuide>
         
            <>
              <Trans>
               Select a collection from below and stake your NFT to earn rewards.
              </Trans>

              {(!upToMedium || !show) && (
                <ExternalLink href="#">
                  {' '}
                  <Trans>Learn More ↗</Trans>
                </ExternalLink>
              )}
            </>
         
        </ProMMFarmGuide>

       
      </Flex>


    </ProMMFarmGuideWrapper>
  )
}

export default NftStakingGuide
