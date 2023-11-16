import { Trans } from '@lingui/macro'
import React from 'react'
import { Plus } from 'react-feather'
import styled, { DefaultTheme, keyframes } from 'styled-components'

import { ButtonPrimary } from 'components/Button'
import useTheme from 'hooks/useTheme'
import { ToolbarWrapper } from 'pages/Pools/styleds'
import { Text } from 'rebass'
import { NavLink } from "react-router-dom";



const highlight = (theme: DefaultTheme) => keyframes`
  0%{
    box-shadow: 0 0 0px 0px ${theme.primary};
  }
  100%{
    box-shadow: 0 0 8px 4px ${theme.primary};
  }
`

const ButtonPrimaryWithHighlight = styled(ButtonPrimary)`
  padding: 10px 12px;
  float: right;
  border-radius: 40px;
  font-size: 14px;

  &[data-highlight='true'] {
    animation: ${({ theme }) => highlight(theme)} 0.8s 8 alternate ease-in-out;
  }
`


export const CreateTokenStakingBtn = () => {
  const theme = useTheme()
  return (
    <ToolbarWrapper style={{ marginBottom: '0px' }}>
      <NavLink to="/token-staking/add" style={{ textDecoration: "none", color: "white" }}>
        <ButtonPrimaryWithHighlight
          // onClick={handleClickCreatePoolButton}
          // data-highlight={shouldHighlightCreatePoolButton}
          style={{
            height: '38px',
            padding: '0px 12px',
          }}
        >
          <Plus width="22" height="22" />
          <Text as="span" sx={{ marginLeft: '4px' }}>
            <Trans>Create Token Staking</Trans>
          </Text>
        </ButtonPrimaryWithHighlight>
      </NavLink>
    </ToolbarWrapper>
  )
}

export default CreateTokenStakingBtn
