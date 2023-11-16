import { Price, Token } from '@kyberswap/ks-sdk-core'
import { Position } from '@kyberswap/ks-sdk-elastic'
import { Trans } from '@lingui/macro'
import React, { useState, useEffect } from 'react'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import QuestionHelper from 'components/QuestionHelper'
import { ButtonEmpty, ButtonOutlined, ButtonPrimary, ButtonLight } from 'components/Button'
import { LightCard, OutlineCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowBetween, RowFixed } from 'components/Row'
import Divider from 'components/Divider'
import ProAmmStakeInfo from 'components/ProAmm/ProAmmStakeInfo'
import { useToken } from 'hooks/Tokens'
import useTheme from 'hooks/useTheme'
import { useTokenStakingDetailsAction } from 'state/nfts/promm/hooks'
import { formatBalance } from 'utils/formatBalance'
import ContentLoader from './ContentLoader'
import StakeModal from 'components/StakeModal/StakeModal'
import UnStakeModal from 'components/UnStakeModal/UnStakeModal'
import { useIsTransactionPending } from 'state/transactions/hooks'
import Loader from 'components/Loader'
import { useActiveWeb3React } from 'hooks'

const StyledPositionCard = styled(LightCard)`
  border: none;
  background: ${({ theme }) => theme.background};
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 16px;
  `}
`

const TabContainer = styled.div`
  display: flex;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.tabBackgound};
  padding: 2px;
`

const Tab = styled(ButtonEmpty) <{ isActive?: boolean; isLeft?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${({ theme, isActive }) => (isActive ? theme.tabActive : theme.tabBackgound)};
  padding: 4px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.2s;

  &:hover {
    text-decoration: none;
  }
`

const TabText = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ theme, isActive }) => (isActive ? theme.text : theme.subText)};
`

const StakedInfo = styled.div`
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 12px;
  margin-top: 16px;
`

const StakedRow = styled.div`
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 20px;

  > * {
    /* to make sure all immediate buttons take equal width */
    flex: 1 1 50%;
  }
`

interface PositionListItemProps {
  showStaked: boolean
  closedPool: boolean
  stakedToken: string
  rewardToken: string
  stakingContract: string
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} {
  if (!position) {
    return {}
  }
  const token0 = position.amount0.currency
  const token1 = position.amount1.currency
  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}

function PositionListItem({
  showStaked,
  closedPool,
  stakedToken,
  rewardToken,
  stakingContract
}: PositionListItemProps) {
  const { chainId, account } = useActiveWeb3React()

  const _stakedToken = useToken(stakedToken)
  const _rewardToken = useToken(rewardToken)
  const currency0 = _stakedToken 
  const currency1 = _rewardToken
  const [poolInfo, setPoolInfo] = useState<any>(null)
  const [approvalTx, setApprovalTx] = useState('')
  const isApprovalTxPending = useIsTransactionPending(approvalTx);
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showUnStakeModal, setShowUnStakeModal] = useState(false)
  const [isStakeLoading, setIsStakeLoading] = useState(false)
  const [isUnStakeLoading, setIsUnStakeLoading] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const { fetchPoolInfo, stake, unStake, emergencyUnstake, harvest, approve } = useTokenStakingDetailsAction(stakingContract, stakedToken);

  const getPoolInfo = async () => {

    setPoolInfo(await fetchPoolInfo());

  };

  const handleApprove = async () => {
    if (poolInfo.availableTokens > 0) {
      setIsApproving(true)
      const tx = await approve().catch((e) => { setIsApproving(false); })
      setApprovalTx(tx)
    }
  }

  const stakeTokens = async (token: any) => {
    setIsStakeLoading(true);
    const tx = await stake(token).catch((e) => { setIsStakeLoading(false); })
    setApprovalTx(tx)
  }

  const unstakeTokens = async () => {
    const tx = await unStake()
    setApprovalTx(tx)
  }

  const emergencyUnstakeTokens = async () => {
    setIsUnStakeLoading(true);
    const tx = await emergencyUnstake().catch((e) => { setIsUnStakeLoading(false); })
    setApprovalTx(tx)
  }

  const harvestRewards = async () => {
    const tx = await harvest()
    setApprovalTx(tx)
  }

  const openStakeModal = () => {
    setIsStakeLoading(false);
    setShowStakeModal(true);
  }

  const openUnStakeModal = () => {
    setIsUnStakeLoading(false);
    const currentDate = new Date();
    const unStakeDate = new Date(((poolInfo.lockPeriodUntil).toNumber()) * 1000)

    if (currentDate < unStakeDate) {
      setShowUnStakeModal(true);
    }
    else if (currentDate > unStakeDate) {
      unstakeTokens();
    }
  }


  useEffect(() => {
    getPoolInfo();
  }, [approvalTx, isApprovalTxPending, account])

  useEffect(() => {
    if (!isApprovalTxPending) {
      setIsApproving(false)
      setShowStakeModal(false);
      setShowUnStakeModal(false);
    }
  }, [isApprovalTxPending])


  const theme = useTheme()


  return currency0 && currency1 && poolInfo ? (
    <StyledPositionCard style={{ display: (showStaked && !poolInfo.tokenStaked) ? 'none' : 'block' }}  >
      <>
        <ProAmmStakeInfo stakedToken={currency0} rewardToken={currency1} />
        <OutlineCard marginTop="1rem" padding="1rem">
          <AutoColumn gap="md">
            <RowBetween>
              <Text fontSize={12} fontWeight={500} color={theme.subText}>
                <Trans>Total Staked {currency0?.symbol}</Trans>
              </Text>
              <RowFixed>
                <CurrencyLogo size="16px" style={{ marginLeft: '8px' }} currency={currency0} />
                <Text fontSize={12} fontWeight={500} marginLeft={'6px'}>
                  {poolInfo.totalStaked && <>{formatBalance(poolInfo.totalStaked)} </>} {' '}
                  {currency0?.symbol}
                </Text>
              </RowFixed>
            </RowBetween>

            <RowBetween>
              <Text fontSize={12} fontWeight={500} color={theme.subText}>
                <Trans>Available {currency0?.symbol}</Trans>
              </Text>
              <RowFixed>
                <CurrencyLogo size="16px" style={{ marginLeft: '8px' }} currency={currency0} />
                <Text fontSize={12} fontWeight={500} marginLeft={'6px'}>
                  {poolInfo.availableTokens && <>{formatBalance(poolInfo.availableTokens)} </>}{' '}
                  {currency0?.symbol}
                </Text>
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={12} fontWeight={500} color={theme.subText}>
                <Trans>Your Staked {currency0?.symbol}</Trans>
              </Text>
              <RowFixed>
                <CurrencyLogo size="16px" style={{ marginLeft: '8px' }} currency={currency0} />
                <Text fontSize={12} fontWeight={500} marginLeft={'6px'}>
                  {poolInfo.tokenStaked && <>{formatBalance(poolInfo.tokenStaked)} </>}{' '}
                  {currency0?.symbol}
                </Text>
              </RowFixed>
            </RowBetween>
          </AutoColumn>
        </OutlineCard>
        <OutlineCard marginTop="1rem" padding="1rem">
          <AutoColumn gap="md">
            <RowBetween>
              <Flex>
                <Text fontSize={12} fontWeight={500} color={theme.subText}>
                  <Trans>{currency1.symbol} Rewards Earned</Trans>
                </Text>
                <QuestionHelper text={`Rewards Earned yet`} />
              </Flex>
              <RowFixed>
                <CurrencyLogo size="16px" style={{ marginLeft: '8px' }} currency={currency1} />
                <Text fontSize={12} fontWeight={500} marginLeft={'6px'}>
                  {poolInfo.rewardEarned && <>{formatBalance(poolInfo.rewardEarned)} </>}{' '}
                  {currency1?.symbol}
                </Text>
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Flex>
                <Text fontSize={12} fontWeight={500} color={theme.subText}>
                  <Trans>APR</Trans>
                </Text>
                <QuestionHelper text={`APR of pool`} />
              </Flex>
              <RowFixed>

                <Text fontSize={12} fontWeight={500} marginLeft={'6px'}>
                  {poolInfo.apr && <>{poolInfo.apr}</>} {"%"}
                </Text>
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Flex>
                <Text fontSize={12} fontWeight={500} color={theme.subText}>
                  <Trans>Lock Duration</Trans>
                </Text>
                <QuestionHelper text={`Duration that you going to lock your tokens`} />
              </Flex>
              <RowFixed>

                <Text fontSize={12} fontWeight={500} marginLeft={'6px'}>
                  {poolInfo.lockPeriod}
                </Text>
              </RowFixed>
            </RowBetween>

            <ButtonLight disabled={!poolInfo.rewardEarned} onClick={() => harvestRewards()} style={{ padding: '10px', fontSize: '14px' }}>
              <Flex alignItems="center" sx={{ gap: '8px' }}>
                <QuestionHelper
                  size={16}
                  text={
                    !poolInfo.rewardEarned
                      ? `You don't have any rewards to harvest`
                      : `Harvest your rewards`
                  }
                  color={!poolInfo.rewardEarned ? theme.disableText : theme.primary}
                />
                <Trans>Harvest</Trans>
              </Flex>
            </ButtonLight>
          </AutoColumn>
        </OutlineCard>

        <Divider sx={{ marginTop: '20px' }} />
        <div style={{ marginBottom: '20px' }} />
        <Flex flexDirection={'column'} marginTop="auto">
          {poolInfo.isApproved ?

            <ButtonGroup>

              <ButtonOutlined
                padding="8px"
                disabled={poolInfo.tokenStaked < 1}
                onClick={() => openUnStakeModal()}
              >
                <Text width="max-content" fontSize="14px">
                  <Trans>Unstake Tokens</Trans>
                </Text>
              </ButtonOutlined>

              <ButtonPrimary
                padding="8px"
                disabled={poolInfo.isClosed}
                style={{
                  borderRadius: '18px',
                  fontSize: '14px',
                }}
                onClick={() => openStakeModal()}
              >
                <Text width="max-content" fontSize="14px">
                  <Trans>{poolInfo.isClosed ? 'Staking Closed' : 'Stake'}</Trans>
                </Text>
              </ButtonPrimary>
            </ButtonGroup>
            :
            <ButtonGroup>
              <ButtonOutlined
                padding="8px"
                onClick={() => handleApprove()}
                disabled={isApproving || (poolInfo.availableTokens == 0)}
              >
                <Text width="max-content" fontSize="14px">
                  <Trans>
                    {
                      isApproving
                        ?
                        <Flex alignItems="center" justifyContent="center">Approving&nbsp;Contract&nbsp;<Loader /></Flex>
                        :
                        <>
                          {
                            (poolInfo.availableTokens == 0)
                              ?
                              `Insufficient ${currency0?.symbol} balance`
                              :
                              "Approve Contract"
                          }
                        </>
                    }
                  </Trans>
                </Text>
              </ButtonOutlined>
            </ButtonGroup>


          }

        </Flex>

        <StakeModal
          showModal={showStakeModal}
          closeModal={() => setShowStakeModal(false)}
          availableTokens={poolInfo.availableTokens}
          minStakeRequired={poolInfo.minStakeRequired}
          stake={(token: any) => stakeTokens(token)}
          isStakeLoading={isStakeLoading}
        />

        <UnStakeModal
          showModal={showUnStakeModal}
          closeModal={() => setShowUnStakeModal(false)}
          lockPeriodUntil={poolInfo.lockPeriodUntil}
          unstakeFee={poolInfo.unstakeFee}
          unStake={emergencyUnstakeTokens}
          isUnStakeLoading={isUnStakeLoading}
        />

      </>
    </StyledPositionCard>
  ) : (
    <ContentLoader />
  )
}

export default React.memo(PositionListItem)
