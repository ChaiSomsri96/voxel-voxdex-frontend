import { Trans } from '@lingui/macro'
import { darken } from 'polished'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Flex } from 'rebass'
import styled, { keyframes } from 'styled-components'

import { ReactComponent as DropdownSVG } from 'assets/svg/down.svg'
import Menu from 'components/Menu'
//import Settings from 'components/Settings'
import { TutorialIds } from 'components/Tutorial/TutorialSwap/constant'
import Web3Network from 'components/Web3Network'
import { useActiveWeb3React } from 'hooks'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import { useWindowSize } from 'hooks/useWindowSize'
import { useIsDarkMode } from 'state/user/hooks'
import { ExternalLink } from 'theme/components'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ExchangeRateInfo from './ExchangeRateInfo'


const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    padding: 10px;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 98;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.background};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
     gap: 0px;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    justify-content: flex-end;
  `};

   ${({ theme }) => theme.mediaWidth.belowExtraSmall`
    display:none;
  `};

`
const HeaderMobileLinks = styled(Row)`
   display:none;
   justify-content: flex-end;
   text-align: right;
   ${({ theme }) => theme.mediaWidth.belowExtraSmall`
    display:block;
  `};

`
const IconImage = styled.img`
  width: 140px;
  margin-top: 1px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 114px;
  `};

   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     width: 100px;
  `};

   ${({ theme }) => theme.mediaWidth.belowExtraSmall`
     width: 150px;
  `};

`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.background : theme.buttonGray)};
  border-radius: 999px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  @media only screen and (max-width: 390px) {
    width: 100px;
  }
`

const AnalyticsWrapper = styled.span`
  @media (max-width: 1320px) {
    display: none;
  }
`

const DiscoverWrapper = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const CampaignWrapper = styled.span``

const AboutWrapper = styled.span`
  @media (max-width: 1440px) {
    display: none;
  }
`

const Title = styled(Link)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;

  :hover {
    transform: rotate(-5deg);
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    :hover {
      transform: rotate(0);
    }
  `}
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  padding: 8px 12px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.subText};
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.primary};
  }

  :hover {
    color: ${({ theme }) => darken(0.1, theme.primary)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 8px 6px;
  `}
`

const StyledNavExternalLink = styled(ExternalLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.subText};
  font-size: 1rem;
  width: fit-content;
  padding: 8px 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.subText};
  }

  :hover {
    color: ${({ theme }) => darken(0.1, theme.primary)};
    text-decoration: none;
  }

  :focus {
    color: ${({ theme }) => theme.subText};
    text-decoration: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
  `}
`

const shine = keyframes`
  0% {
    background-position: 0;
  }
  60% {
    background-position: 40px;
  }
  100% {
    background-position: 65px;
  }
`

export const SlideToUnlock = styled.div<{ active?: boolean }>`
  background: linear-gradient(
    to right,
    ${props => (props.active ? props.theme.primary : props.theme.subText)} 0,
    white 10%,
    ${props => (props.active ? props.theme.primary : props.theme.subText)} 20%
  );
  animation: ${shine} 1.3s infinite linear;
  animation-fill-mode: forwards;
  background-position: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-size-adjust: none;
`

const Dropdown = styled.div`
  display: none;
  position: absolute;
  background: ${({ theme }) => theme.tableHeader};
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.36));
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.01), 0 4px 8px rgba(0, 0, 0, 0.04), 0 16px 24px rgba(0, 0, 0, 0.04),
    0 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 16px;
  padding: 8px;
  width: max-content;
  top: 32px;
  @media only screen and (max-width:993px){
    position: absolute;
    left: -36px;
  } 

  ${({ theme }) => theme.mediaWidth.belowExtraSmall`
    padding: 8px 2px 8px 6px;
    left:-60px;
  `}
`
const DropdownIcon = styled(DropdownSVG)`
  transition: transform 300ms;
`

const HoverDropdown = styled.div<{ active: boolean }>`
  position: relative;
  display: inline-block;
  cursor: pointer;

  color: ${({ theme, active }) => (active ? theme.primary : theme.subText)};
  font-size: 1rem;
  width: fit-content;
  padding: 8px 6px 8px 12px;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 8px 2px 8px 6px;
  `}


  :hover {
    color: ${({ theme }) => darken(0.1, theme.primary)};

    ${Dropdown} {
      display: flex;
      flex-direction: column;

      ${StyledNavLink} {
        margin: 0;
      }
    }

    ${DropdownIcon} {
      transform: rotate(-180deg);
    }
  }
`

const Trans2 = styled.div`
  @media only screen and (max-width: 440px) {
    display:none;
  }
`
const Trans1 = styled.div`
  @media only screen and (min-width: 441px) {
    display:none;
  }
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const isDark = useIsDarkMode()
  const { pathname } = useLocation()
  const [isHoverSlide, setIsHoverSlide] = useState(false)

  const { width } = useWindowSize()

  const under369 = width && width < 369
  const under500 = width && width < 500
  const { mixpanelHandler } = useMixpanel()
  return (
    <HeaderFrame>
      <HeaderRow>
        <Title to="/swap">
          <UniIcon>
            <IconImage width="40px" src={isDark ? '/logo-dark.png' : '/logo-dark.png'} alt="logo" />
          </UniIcon>
        </Title>
        <HeaderMobileLinks>
          <HoverDropdown active={true}>
            <Flex alignItems="center">
              <Trans>Menu</Trans>
              <DropdownIcon />
            </Flex>
            <Dropdown>
              <StyledNavLink
                id={`swapv2-nav-link`}
                to={'/swap'}
                isActive={match => Boolean(match)}
                style={{ flexDirection: 'column' }}
              >
                <Flex alignItems="center" sx={{ gap: '10px' }}>
                  <Trans>Swap</Trans>
                </Flex>
              </StyledNavLink>{' '}
              <StyledNavLink
                id={`buy-crypto-nav-link`}
                to={'/limit-order'}
                isActive={match => Boolean(match)}
                onClick={() => {
                  mixpanelHandler(MIXPANEL_TYPE.SWAP_BUY_CRYPTO_CLICKED)
                }}
              >
                <Flex alignItems="center" sx={{ gap: '8px' }}>
                  <Trans>Limit Order</Trans>
                </Flex>
              </StyledNavLink>
              <StyledNavLink
                id="pools-nav-link"
                to="/pools"
                isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/pools')}
                style={{ width: '100%' }}
              >
                <Trans>All Pools</Trans>
              </StyledNavLink>

              <StyledNavLink
                id="my-pools-nav-link"
                to={'/myPools'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add') ||
                  pathname.startsWith('/remove') ||
                  pathname.startsWith('/create') ||
                  (pathname.startsWith('/find') && pathname.endsWith('find'))
                }
              >
                <Trans>My Pools</Trans>
              </StyledNavLink>

              <StyledNavLink
                onClick={() => {
                  mixpanelHandler(MIXPANEL_TYPE.FARM_UNDER_EARN_TAB_CLICK)
                }}
                id="farms-nav-link"
                to="/farms"
                isActive={match => Boolean(match)}
              >
                <Trans>Farms</Trans>
              </StyledNavLink>
              <StyledNavLink
                id={`swapv2-nav-link`}
                to={'/token-staking'}
                isActive={match => Boolean(match)}
                style={{ flexDirection: 'column' }}
              >
                <Flex alignItems="center" sx={{ gap: '10px' }}>
                  <Trans>Token Staking</Trans>
                </Flex>
              </StyledNavLink>{' '}
              <StyledNavLink
                id={`buy-crypto-nav-link`}
                to={'/nft-staking'}
                isActive={match => Boolean(match)}

              >
                <Flex alignItems="center" sx={{ gap: '8px' }}>
                  <Trans>NFT Staking</Trans>
                </Flex>
              </StyledNavLink>
              <StyledNavLink
                id={`bridge`}
                to={'/bridge'}
                isActive={match => Boolean(match)}

              >
                <Flex alignItems="center" sx={{ gap: '8px' }}>
                  <Trans>Bridge</Trans>
                </Flex>
              </StyledNavLink>

            </Dropdown>

          </HoverDropdown>

        </HeaderMobileLinks>
        <HeaderLinks>
          <HoverDropdown active={pathname.includes('/swap')}>
            <Flex alignItems="center">
              <Trans>Swap</Trans>
              <DropdownIcon />
            </Flex>

            <Dropdown>
              <StyledNavLink
                id={`swapv2-nav-link`}
                to={'/swap'}
                isActive={match => Boolean(match)}
                style={{ flexDirection: 'column' }}
              >
                <Flex alignItems="center" sx={{ gap: '10px' }}>
                  <Trans>Swap</Trans>
                </Flex>
              </StyledNavLink>{' '}
              <StyledNavLink
                id={`buy-crypto-nav-link`}
                to={'/limit-order'}
                isActive={match => Boolean(match)}
                onClick={() => {
                  mixpanelHandler(MIXPANEL_TYPE.SWAP_BUY_CRYPTO_CLICKED)
                }}
              >
                <Flex alignItems="center" sx={{ gap: '8px' }}>
                  <Trans>Limit Order</Trans>
                </Flex>
              </StyledNavLink>

            </Dropdown>
          </HoverDropdown>

          <Flex id={TutorialIds.EARNING_LINKS} alignItems="center">
            <HoverDropdown active={pathname.toLowerCase().includes('pools')}>
              <Flex alignItems="center">
                <Trans>Earn</Trans>
                <DropdownIcon />
              </Flex>
              <Dropdown>
                <StyledNavLink
                  id="pools-nav-link"
                  to="/pools"
                  isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/pools')}
                  style={{ width: '100%' }}
                >
                  <Trans>All Pools</Trans>
                </StyledNavLink>

                <StyledNavLink
                  id="my-pools-nav-link"
                  to={'/myPools'}
                  isActive={(match, { pathname }) =>
                    Boolean(match) ||
                    pathname.startsWith('/add') ||
                    pathname.startsWith('/remove') ||
                    pathname.startsWith('/create') ||
                    (pathname.startsWith('/find') && pathname.endsWith('find'))
                  }
                >
                  <Trans>My Pools</Trans>
                </StyledNavLink>


                <StyledNavLink
                  onClick={() => {
                    mixpanelHandler(MIXPANEL_TYPE.FARM_UNDER_EARN_TAB_CLICK)
                  }}
                  id="farms-nav-link"
                  to="/farms"
                  isActive={match => Boolean(match)}
                >
                  <Trans>Farms</Trans>
                </StyledNavLink>


              </Dropdown>
            </HoverDropdown>
          </Flex>

          <Trans2>
            <CampaignWrapper id={TutorialIds.CAMPAIGN_LINK}>
              <StyledNavLink
                onClick={() => {
                  mixpanelHandler(MIXPANEL_TYPE.FARM_UNDER_EARN_TAB_CLICK)
                }}
                id="farms-nav-link"
                to="/farms"
                isActive={match => Boolean(match)}
              >
                <Trans>Farms</Trans>
              </StyledNavLink>
            </CampaignWrapper>
          </Trans2>

          <HoverDropdown active={pathname.includes('/token-staking') || pathname.includes('/nft-staking')}>
            <Flex alignItems="center">
              <Trans>Staking</Trans>
              <DropdownIcon />
            </Flex>

            <Dropdown>
              <StyledNavLink
                id={`swapv2-nav-link`}
                to={'/token-staking'}
                isActive={match => Boolean(match)}
                style={{ flexDirection: 'column' }}
              >
                <Flex alignItems="center" sx={{ gap: '10px' }}>
                  <Trans>Token Staking</Trans>
                </Flex>
              </StyledNavLink>{' '}
              <StyledNavLink
                id={`buy-crypto-nav-link`}
                to={'/nft-staking'}
                isActive={match => Boolean(match)}

              >
                <Flex alignItems="center" sx={{ gap: '8px' }}>
                  <Trans>NFT Staking</Trans>
                </Flex>
              </StyledNavLink>
            </Dropdown>
          </HoverDropdown>

          <AnalyticsWrapper>
            <StyledNavLink
              id={`bridge`}
              to={'/bridge'}
              isActive={match => Boolean(match)}

            >
              <Flex alignItems="center" sx={{ gap: '8px' }}>
                <Trans>Bridge</Trans>
              </Flex>
            </StyledNavLink>
          </AnalyticsWrapper>

          {/* <AnalyticsWrapper>
            <StyledNavLink
              id={`manageAuth`}
              to={'/manage-auth'}
              isActive={match => Boolean(match)}
            >
              <Flex alignItems="center" sx={{ gap: '8px' }}>
                <Trans>Manage Auth</Trans>
              </Flex>
            </StyledNavLink>
          </AnalyticsWrapper> */}
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>

          <ExchangeRateInfo />

          <Web3Network />

          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          {/* <Settings /> */}
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
