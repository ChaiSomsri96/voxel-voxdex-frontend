import { t } from '@lingui/macro'
import { ArrowLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Flex } from 'rebass'
import styled, { css } from 'styled-components'

import { ButtonEmpty } from 'components/Button'
import { LiquidityAction } from 'components/NavigationTabs'
import { RowBetween } from 'components/Row'
import { TutorialType } from 'components/Tutorial'
import useTheme from 'hooks/useTheme'
import { useMedia } from 'react-use'
import QuestionHelper from 'components/QuestionHelper'
// import TransactionSettings from 'components/TransactionSettings'
// import { ShareButtonWithModal } from 'components/ShareModal'


// For Add Farms Form Page Header

const ButtonBack = styled(ButtonEmpty)`
  width: 36px;
  height: 36px;
  justify-content: center;
  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.buttonBlack};
  }
`
const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text};
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`
const Wrapper = styled(RowBetween)`
  padding: 1rem 0 4px;

  @media only screen and (min-width: 768px) {
    padding: 1rem 0;
  }
`


const StyledMenuButton = styled.button<{ active?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.subText};

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

export function HeaderTabs({
    action,
    customTitle = "",
    showTooltip = true,
    hideShare = false,
    onShared,
    onCleared,
    onBack,
    tooltip,
    tutorialType,
}: {
    action: LiquidityAction
    showTooltip?: boolean
    hideShare?: boolean
    onShared?: () => void
    onCleared?: () => void
    onBack?: () => void
    tooltip?: string
    customTitle?: string
    tutorialType?: TutorialType
}) {
    const history = useHistory()
    const below768 = useMedia('(max-width: 768px)')
    const goBack = () => {
        history.goBack()
    }

    const theme = useTheme()
    const arrow = (
        <ButtonBack width="fit-content" padding="0" onClick={!!onBack ? onBack : goBack}>
            <StyledArrowLeft />
        </ButtonBack>
    )
    const title = (
        <Flex>
            <ActiveText>
                {customTitle
                    ?
                    customTitle
                    :
                    <>
                        {action === LiquidityAction.CREATE
                            ? t`Create a new pool`
                            : action === LiquidityAction.ADD
                                ? t`Add Farms`
                                : action === LiquidityAction.INCREASE
                                    ? t`Increase Liquidity`
                                    : t`Remove Liquidity`}
                    </>
                }
            </ActiveText>
            {showTooltip && (
                <QuestionHelper
                    size={16}
                    text={
                        tooltip ||
                        (action === LiquidityAction.CREATE
                            ? t`Create a new liquidity pool and earn fees on trades for this token pair`
                            : action === LiquidityAction.ADD
                                ? t`Add liquidity for a token pair and earn fees on the trades that are in your selected price range`
                                : action === LiquidityAction.INCREASE
                                    ? t``
                                    : action === LiquidityAction.REMOVE
                                        ? t`Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive`
                                        : t``)
                    }
                />
            )}
        </Flex>
    )
    return (
        <Tabs>
            <Wrapper>
                {below768 && (
                    <Flex alignItems={'center'}>
                        {arrow}
                        {title}
                    </Flex>
                )}
                {!below768 && arrow}
                {!below768 && title}
                <Flex style={{ gap: '0px' }}>
                    {/* {onCleared && (
                        <StyledMenuButton active={false} onClick={onCleared}>
                            <Trash size={18} />
                        </StyledMenuButton>
                    )}
                    <TransactionSettings hoverBg={theme.buttonBlack} />
                    {!hideShare && <ShareButtonWithModal onShared={onShared} />} */}
                </Flex>
            </Wrapper>
        </Tabs>
    )
}