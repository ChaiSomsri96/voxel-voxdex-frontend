import { ChainId } from '@kyberswap/ks-sdk-core'
import { Trans, t } from '@lingui/macro'
import React, { useRef } from 'react'
import {
  BookOpen,
  Edit,
  FileText,
  Menu as MenuIcon,
  MessageCircle,
  PieChart,
  UserPlus,
} from 'react-feather'
import { NavLink } from 'react-router-dom'
import { useMedia } from 'react-use'
import styled, { css } from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import MenuFlyout from 'components/MenuFlyout'
import { DMM_ANALYTICS_URL } from 'constants/index'
import { NETWORKS_INFO } from 'constants/networks'
import { useActiveWeb3React } from 'hooks'
import useClaimReward from 'hooks/useClaimReward'
import useMixpanel from 'hooks/useMixpanel'
import useTheme from 'hooks/useTheme'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ExternalLink } from 'theme'
const sharedStylesMenuItem = css`
  flex: 1;
  padding: 0.75rem 0;
  text-decoration: none;
  display: flex;
  font-weight: 500;
  white-space: nowrap;
  align-items: center;
  color: ${({ theme }) => theme.subText};

  :hover {
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    text-decoration: none;
  }

  > svg {
    margin-right: 8px;
  }
`

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text};
  }
`

const StyledMenuButton = styled.button<{ active?: boolean }>`
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};

  border-radius: 999px;

  :hover {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.buttonBlack};
  }

  ${({ active }) =>
    active
      ? css`
          cursor: pointer;
          outline: none;
          background-color: ${({ theme }) => theme.buttonBlack};
        `
      : ''}
     
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

export const NavMenuItem = styled(NavLink)`
  ${sharedStylesMenuItem}
`

const MenuItem = styled(ExternalLink)`
  ${sharedStylesMenuItem}
`

const MenuButton = styled.div`
  ${sharedStylesMenuItem}
`

const MenuFlyoutBrowserStyle = css`
  min-width: unset;
  right: -8px;

  & ${MenuItem}:nth-child(1),
  & ${NavMenuItem}:nth-child(1) {
    padding-top: 0.75rem;
  }
`

const MenuFlyoutMobileStyle = css`
  & ${MenuItem}:nth-child(1),
  & ${NavMenuItem}:nth-child(1) {
    padding-top: 0.75rem;
  }
`
const ClaimRewardButton = styled(ButtonPrimary)`
  margin-top: 20px;
  padding: 11px;
  font-size: 14px;
  width: max-content;
`

export const NewLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.red};
  height: calc(100% + 4px);
  margin-left: 2px;
`

export default function Menu() {
  const { chainId, account } = useActiveWeb3React()
  const theme = useTheme()
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)

  const under1440 = useMedia('(max-width: 1440px)')
  const above1321 = useMedia('(min-width: 1321px)')
  const above768 = useMedia('(min-width: 768px)')
  const under369 = useMedia('(max-width: 360px)')

  const getBridgeLink = () => {
    if (!chainId) return ''
    return NETWORKS_INFO[chainId].bridgeURL
  }

  const bridgeLink = getBridgeLink()
  const toggleClaimPopup = useToggleModal(ApplicationModal.CLAIM_POPUP)
  const toggleFaucetPopup = useToggleModal(ApplicationModal.FAUCET_POPUP)
  const { pendingTx } = useClaimReward()
  const { mixpanelHandler } = useMixpanel()
  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton active={open} onClick={toggle} aria-label="Menu">
        <StyledMenuIcon />
      </StyledMenuButton>

      <MenuFlyout
        node={node}
        browserCustomStyle={MenuFlyoutBrowserStyle}
        mobileCustomStyle={MenuFlyoutMobileStyle}
        isOpen={open}
        toggle={toggle}
        translatedTitle={t`Menu`}
        hasArrow
      >



        <NavMenuItem to="/referral" onClick={toggle}>
          <UserPlus size={14} />
          <Trans>Referral</Trans>
        </NavMenuItem>
        {!above1321 && (
          <MenuItem id="link" href={DMM_ANALYTICS_URL[chainId as ChainId]}>
            <PieChart size={14} />
            <Trans>Analytics</Trans>
          </MenuItem>
        )}
        <MenuItem id="link" href="https://voxelxnetwork2.gitbook.io">
          <BookOpen size={14} />
          <Trans>Docs</Trans>
        </MenuItem>
        <MenuItem id="link" href="#">
          <MessageCircle size={14} />
          <Trans>Forum</Trans>
        </MenuItem>

        <MenuItem id="link" href="#">
          <FileText size={14} />
          <Trans>Terms</Trans>
        </MenuItem>

        <MenuItem id="link" href="#">
          <Edit size={14} />
          <Trans>Contact Us</Trans>
        </MenuItem>

      </MenuFlyout>

    </StyledMenu>
  )
}
