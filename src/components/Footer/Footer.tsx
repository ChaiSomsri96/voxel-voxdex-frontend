import { Trans } from '@lingui/macro'
import React from 'react'
import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import { Telegram } from 'components/Icons'
import Discord from 'components/Icons/Discord'
import LinkedIn from 'components/Icons/LinkedIn'
import Instagram from 'components/Icons/Instagram'
import {TwitterNew} from 'components/Icons/TwitterIcon'
import {FacebookNew} from 'components/Icons/Facebook'
import useTheme from 'hooks/useTheme'
import { useIsDarkMode } from 'state/user/hooks'
import { ExternalLink, ExternalLinkNoLineHeight } from 'theme'

const FooterWrapper = styled.div`
  background: ${({ theme }) => theme.buttonGray + '33'};
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin-bottom: 4rem;
  `};
`

const FooterContent = styled.div`
  display: flex;
  justify-content; space-between;
  margin: auto;
  align-items: center;
  width: 100%;
  padding: 16px;
  flex-direction: column-reverse;

  @media only screen and (min-width: 768px) {
    flex-direction: row;
    padding: 16px 16px;
  }

  @media only screen and (min-width: 1000px) {
    padding: 16px 32px;
  }

  @media only screen and (min-width: 1366px) {
    padding: 16px 120px;
  }

  @media only screen and (min-width: 1500px) {
    padding: 16px 120px;
  }
`

const InfoWrapper = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.subText + '33'};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 16px;
    gap: 24px;
  `};
`

const Separator = styled.div`
  width: 1px;
  background: ${({ theme }) => theme.border};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none
  `}
`

const Item = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.subText};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
  @media only screen and (max-width: 768px) {
    display:none;
  }
`

const Item2 = styled.div`
    display:flex;
    align-items: center;
  color: ${({ theme }) => theme.subText};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    gap: 12px;
  `};
  @media only screen and (max-width: 460px) {
    .footer_nav{
      display:grid;
      grid-template-columns: auto auto auto;
    }
    @media only screen and (max-width: 340px) {
      .footer_nav{
        display:grid;
        grid-template-columns: auto auto;
      }
  }
`

const Item3 = styled.div`
  display: flex;
  align-items: center;
  margin-top:5px;
  color: ${({ theme }) => theme.subText};
  @media only screen and (min-width: 768px) {
    display:none;
  }
 
`

export const FooterSocialLink = () => {
  const theme = useTheme()
  return (
    <Flex alignItems="center" justifyContent="center" sx={{ gap: '24px' }}>
      <ExternalLinkNoLineHeight href="https://t.me/VoxelXNetwork_Official">
        <Telegram size={28} color={theme.subText} />
      </ExternalLinkNoLineHeight>
      <ExternalLinkNoLineHeight href="https://twitter.com/VoxelXnetwork">
        <TwitterNew  size={36} color={theme.subText} />
      </ExternalLinkNoLineHeight>
      <ExternalLinkNoLineHeight href="https://www.facebook.com/VoxelXnetwork">
        <FacebookNew size={36} color={theme.subText} />
      </ExternalLinkNoLineHeight>
      <ExternalLinkNoLineHeight href="https://discord.com/invite/voxelxnetwork">
        <Discord width={28} height={32} color={theme.subText} />
      </ExternalLinkNoLineHeight>

      <ExternalLinkNoLineHeight href="https://www.linkedin.com/company/voxel-x-network">
        <LinkedIn size={36} color={theme.subText} />
      </ExternalLinkNoLineHeight>
      <ExternalLinkNoLineHeight href="https://www.instagram.com/voxelxnetwork">
        <Instagram size={36} color={theme.subText} />
      </ExternalLinkNoLineHeight>
      
    </Flex>
  )
}

function Footer() {
  const isDarkMode = useIsDarkMode()
  const above768 = useMedia('(min-width: 768px)')

  return (
    <FooterWrapper>
      <FooterContent>
        <InfoWrapper>

          <Item>
            <Text marginRight="6px">
              <Trans>Powered By</Trans>
            </Text>
            <ExternalLink href="https://www.voxelxnetwork.com/" style={{ display: 'flex' }}>
              VoxelxNetwork
            </ExternalLink>
            {/*<p className="aboutVxl"> Our community is building a comprehensive decentralized trading platform for the future of finance. Join us!</p>*/}
          </Item>
          <Separator />
          <Item2>
            <ul className="footer_nav">
              <li className="nav_item">
                <h2 className="nav_title">Products</h2>
                <ul className="nav_ul">
                  <li>
                    <a href="#">Liquidity Pools</a>
                  </li>
                  <li>
                    <a href="#">Staking</a>
                  </li>
                  <li>
                    <a href="#">Farming</a>
                  </li>
                </ul>
              </li>
              <li className="nav_item">
                <h2 className="nav_title">Help</h2>
                <ul className="nav_ul">
                  <li>
                    <a href="#">What is voxel swap?</a>
                  </li>
                  <li>
                    <a href="#">Ask on Discord</a>
                  </li>
                  <li>
                    <a href="#">Ask on Twitter</a>
                  </li>
                  <li>
                    <a href="#">Ask on Forum</a>
                  </li>
                </ul>
              </li>
              <li className="nav_item">
                <h2 className="nav_title">Developers</h2>
                <ul className="nav_ul">
                  <li>
                    <a href="#">Gitbook</a>
                  </li>
                  <li>
                    <a href="#">Github</a>
                  </li>
                  <li>
                    <a href="#">Development</a>
                  </li>
                  <li>
                    <a href="#">voxelGuard</a>
                  </li>
                </ul>
              </li>
              <li className="nav_item">
                <h2 className="nav_title">Governance</h2>
                <ul className="nav_ul">
                  <li>
                    <a href="#">Forum &amp; Proposals</a>
                  </li>
                  <li>
                    <a href="#">Vote</a>
                  </li>
                </ul>
              </li>
              <li className="nav_item ">
                <h2 className="nav_title" >Protocol</h2>
                <ul className="nav_ul">
                  <li>
                    <a href="#">Apply for Onsen</a>
                  </li>
                  <li>
                    <a href="#">Apply for Miso</a>
                  </li>
                  <li>
                    <a href="#">vesting</a>
                  </li>
                </ul>
              </li>
            </ul>
          </Item2>
        </InfoWrapper>
        {/* this for Brand Promotion Tab But Before 768px it will be visible otherwise disabled */}
        <Item3>
          <Text marginRight="6px">
            <Trans>Powered By</Trans>
          </Text>
          <ExternalLink href="https://www.voxelxnetwork.com/" style={{ display: 'flex' }}>
            VoxelxNetwork
          </ExternalLink>
          {/*<p className="aboutVxl"> Our community is building a comprehensive decentralized trading platform for the future of finance. Join us!</p>*/}
        </Item3>
        <FooterSocialLink />
      </FooterContent>
    </FooterWrapper>
  )
}

export default Footer
