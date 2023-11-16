import { ChainId, Fraction } from '@kyberswap/ks-sdk-core'
import { Trans, t } from '@lingui/macro'
import { isAddress } from 'ethers/lib/utils'
import JSBI from 'jsbi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Info } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

import MultichainLogoDark from 'assets/images/multichain_black.png'
import MultichainLogoLight from 'assets/images/multichain_white.png'
import { ReactComponent as ArrowUp } from 'assets/svg/arrow_up.svg'
import { ButtonConfirmed, ButtonError, ButtonLight } from 'components/Button'
import CurrencyInputPanelBridge from 'components/CurrencyInputPanel/CurrencyInputPanelBridge'
import Loader from 'components/Loader'
import ProgressSteps from 'components/ProgressSteps'
import { AutoRow, RowBetween } from 'components/Row'
import Tooltip, { MouseoverTooltip } from 'components/Tooltip'
import { AdvancedSwapDetailsDropdownBridge } from 'components/swapv2/AdvancedSwapDetailsDropdown'
import { SwapFormWrapper } from 'components/swapv2/styleds'
import { NETWORKS_INFO, SUPPORTED_NETWORKS } from 'constants/networks'
import { Z_INDEXS } from 'constants/styles'
import { useActiveWeb3React } from 'hooks'
import { useMultichainPool } from 'hooks/bridge'
import useBridgeCallback from 'hooks/bridge/useBridgeCallback'
import { useActiveNetwork } from 'hooks/useActiveNetwork'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import usePrevious from 'hooks/usePrevious'
import useTheme from 'hooks/useTheme'
import { BodyWrapper } from 'pages/AppBody'
import { useWalletModalToggle } from 'state/application/hooks'
import { useBridgeOutputValue, useBridgeState, useBridgeStateHandler } from 'state/bridge/hooks'
import { PoolValueOutMap } from 'state/bridge/reducer'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'
import { tryParseAmount } from 'state/swap/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { ExternalLink } from 'theme'
import { formattedNum } from 'utils'

import ComfirmBridgeModal from './ComfirmBridgeModal'
import ErrorWarningPanel from './ErrorWarning'
import PoolInfo from './PoolInfo'
import { formatPoolValue } from './helpers'
import { BridgeSwapState } from './type'

const AppBodyWrapped = styled(BodyWrapper)`
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04);
  z-index: ${Z_INDEXS.SWAP_FORM};
  padding: 20px 16px;
  margin-top: 0;
`
const ArrowWrapper = styled.div`
  padding: 8px 10px;
  background: ${({ theme }) => theme.buttonBlack};
  height: fit-content;
  width: fit-content;
  border-radius: 999px;
  margin-bottom: 0.75rem;
`

const Label = styled.div`
  color: ${({ theme }) => theme.subText};
  font-size: 12px;
  margin-bottom: 0.75rem;
`
const calcPoolValue = (amount: string, decimals: number) => {
  try {
    if (Number(amount))
      return new Fraction(amount, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals ?? 18))).toFixed(5)
  } catch (error) {}
  return '0'
}

type PoolValueType = {
  poolValueIn: string | undefined // undefined: unlimit
  poolValueOut: string | undefined
}

export default function SwapForm() {
  const { account, chainId } = useActiveWeb3React()
  const { changeNetwork } = useActiveNetwork()
  const [{ tokenInfoIn, tokenInfoOut, chainIdOut, currencyIn, listTokenOut, listTokenIn, listChainIn, loadingToken }] =
    useBridgeState()
  const { resetBridgeState, setBridgeState, setBridgePoolInfo } = useBridgeStateHandler()
  const toggleWalletModal = useWalletModalToggle()
  const isDark = true
  const theme = useTheme()
  const { mixpanelHandler } = useMixpanel()

  const [inputAmount, setInputAmount] = useState('')
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const [poolValue, setPoolValue] = useState<PoolValueType>({
    poolValueIn: undefined,
    poolValueOut: undefined,
  })

  // modal and loading
  const [swapState, setSwapState] = useState<BridgeSwapState>({
    showConfirm: false,
    attemptingTxn: false,
    swapErrorMessage: '',
    txHash: undefined,
  })

  const listChainOut = useMemo(() => {
    const destChainInfo = tokenInfoIn?.destChains || {}
    return (Object.keys(destChainInfo).map(Number) as ChainId[]).filter(id => SUPPORTED_NETWORKS.includes(id))
  }, [tokenInfoIn])

  const outputInfo = useBridgeOutputValue(inputAmount)

  const anyToken = tokenInfoOut?.fromanytoken

  const poolParamIn = useMemo(() => {
    const anytoken = tokenInfoOut?.isFromLiquidity && tokenInfoOut?.isLiquidity ? anyToken?.address : undefined
    const underlying = tokenInfoIn?.address
    return anytoken && underlying ? [{ anytoken, underlying }] : []
  }, [anyToken?.address, tokenInfoIn?.address, tokenInfoOut?.isFromLiquidity, tokenInfoOut?.isLiquidity])

  const poolParamOut = useMemo(() => {
    return listTokenOut
      .map(({ multichainInfo: token }) => ({
        anytoken: token?.isLiquidity ? token?.anytoken?.address : undefined,
        underlying: token?.underlying?.address,
      }))
      .filter(e => e.anytoken && e.underlying) as { anytoken: string; underlying: string }[]
  }, [listTokenOut])

  const poolDataIn = useMultichainPool(chainId, poolParamIn)
  const poolDataOut = useMultichainPool(chainIdOut, poolParamOut)

  useEffect(() => {
    const address = anyToken?.address
    let poolValueIn: string | undefined
    if (address && poolDataIn?.[address]?.balanceOf) {
      poolValueIn = calcPoolValue(poolDataIn[address]?.balanceOf, anyToken?.decimals)
    }
    setPoolValue(poolValue => ({ ...poolValue, poolValueIn }))
  }, [poolDataIn, anyToken])

  useEffect(() => {
    const poolValueOutMap: PoolValueOutMap = {}
    let poolValueOut: string | undefined
    if (poolDataOut) {
      Object.keys(poolDataOut).forEach(anytokenAddress => {
        const poolInfo = poolDataOut?.[anytokenAddress]
        const token = listTokenOut.find(e => e.multichainInfo?.anytoken?.address === anytokenAddress)
        if (!poolInfo?.balanceOf || !token?.multichainInfo?.anytoken?.decimals) return
        if (anytokenAddress === tokenInfoOut?.anytoken?.address) {
          poolValueOut = calcPoolValue(poolInfo?.balanceOf, tokenInfoOut?.anytoken?.decimals)
        }
        poolValueOutMap[anytokenAddress] = formatPoolValue(
          calcPoolValue(poolInfo?.balanceOf, token?.multichainInfo?.anytoken?.decimals),
        )
      })
    }
    setPoolValue(poolValue => ({ ...poolValue, poolValueOut }))
    setBridgePoolInfo({ poolValueOut: poolValueOutMap })
  }, [poolDataOut, listTokenOut, tokenInfoOut, setBridgePoolInfo])

  useEffect(() => {
    setBridgeState({ chainIdOut: listChainOut[0] })
  }, [setBridgeState, listChainOut])

  useEffect(() => {
    setBridgeState({ tokenOut: listTokenOut[0] || null })
  }, [setBridgeState, listTokenOut])

  useEffect(() => {
    setInputAmount('')
  }, [tokenInfoIn, chainId])

  const prevChain = usePrevious(chainId)
  useEffect(() => {
    if (chainId !== prevChain && prevChain) {
      resetBridgeState()
    }
  }, [chainId, prevChain, resetBridgeState])

  const useSwapMethods = tokenInfoOut?.routerABI
  const routerToken = tokenInfoOut?.router && isAddress(tokenInfoOut?.router) ? tokenInfoOut?.router : undefined

  const { execute: onWrap, inputError: wrapInputError } = useBridgeCallback(
    inputAmount,
    anyToken?.address,
    routerToken,
    tokenInfoIn?.tokenType === 'NATIVE' || !!useSwapMethods?.includes('anySwapOutNative'),
    tokenInfoOut?.type === 'swapin' ? tokenInfoOut?.DepositAddress : account,
  )

  const inputError: string | undefined | { state: 'warn' | 'error'; tip: string } = useMemo(() => {
    if (!listTokenOut.length && !listTokenIn.length && !loadingToken) {
      return { state: 'error', tip: t`Cannot get token info. Please try again later.` }
    }

    const inputNumber = Number(inputAmount)

    if (!tokenInfoIn || !chainIdOut || !tokenInfoOut || inputNumber === 0) return

    if (isNaN(inputNumber)) return t`Input amount is not valid`

    if (inputNumber < Number(tokenInfoOut.MinimumSwap)) {
      return t`The amount to bridge must be more than ${formattedNum(tokenInfoOut.MinimumSwap, false, 5)} ${
        tokenInfoIn.symbol
      }`
    }
    if (inputNumber > Number(tokenInfoOut.MaximumSwap)) {
      return t`The amount to bridge must be less than ${formattedNum(tokenInfoOut.MaximumSwap)} ${tokenInfoIn.symbol}`
    }

    if (tokenInfoOut.isLiquidity && tokenInfoOut.underlying) {
      const poolLiquidity = formatPoolValue(poolValue.poolValueOut)
      if (inputNumber > Number(poolValue.poolValueOut))
        return t`The bridge amount must be less than the current available amount of the pool which is ${poolLiquidity} ${tokenInfoOut.symbol}.`

      const ratio = 0.7
      if (inputNumber > ratio * Number(poolValue.poolValueOut)) {
        return {
          state: 'warn',
          tip: t`Note: Your transfer amount (${formattedNum(inputAmount, false, 5)} ${
            tokenInfoIn.symbol
          }) is more than ${100 * ratio}% of the available liquidity (${poolLiquidity} ${tokenInfoOut.symbol})!`,
        }
      }
    }

    const isWrapInputError = wrapInputError && inputNumber > 0
    if (isWrapInputError) return t`Insufficient ${tokenInfoIn?.symbol} balance`
    return
  }, [
    tokenInfoIn,
    chainIdOut,
    wrapInputError,
    inputAmount,
    tokenInfoOut,
    poolValue.poolValueOut,
    loadingToken,
    listTokenOut,
    listTokenIn,
  ])

  const handleTypeInput = useCallback(
    (value: string) => {
      if (tokenInfoIn) setInputAmount(value)
    },
    [tokenInfoIn],
  )

  const showPreview = () => {
    setSwapState(state => ({ ...state, showConfirm: true, swapErrorMessage: '', txHash: '' }))
    if (chainId && chainIdOut) {
      mixpanelHandler(MIXPANEL_TYPE.BRIDGE_CLICK_REVIEW_TRANSFER, {
        from_network: NETWORKS_INFO[chainId].name,
        to_network: NETWORKS_INFO[chainIdOut].name,
      })
    }
  }

  const hidePreview = useCallback(() => {
    setSwapState(state => ({ ...state, showConfirm: false }))
  }, [])

  const handleSwap = useCallback(async () => {
    try {
      if (!useSwapMethods) return
      setSwapState(state => ({ ...state, attemptingTxn: true }))
      if (chainId && chainIdOut) {
        mixpanelHandler(MIXPANEL_TYPE.BRIDGE_CLICK_TRANSFER, {
          from_token: tokenInfoIn?.symbol,
          to_token: tokenInfoOut?.symbol,
          bridge_fee: outputInfo.fee,
          from_network: NETWORKS_INFO[chainId].name,
          to_network: NETWORKS_INFO[chainIdOut].name,
          trade_qty: inputAmount,
        })
      }
      const txHash = await onWrap(useSwapMethods)
      setInputAmount('')
      setSwapState(state => ({ ...state, attemptingTxn: false, txHash }))
    } catch (error) {
      console.error(error)
      setSwapState(state => ({ ...state, attemptingTxn: false, swapErrorMessage: error?.message || error }))
    }
  }, [
    useSwapMethods,
    onWrap,
    chainId,
    chainIdOut,
    inputAmount,
    outputInfo.fee,
    mixpanelHandler,
    tokenInfoIn?.symbol,
    tokenInfoOut?.symbol,
  ])

  const maxAmountInput = useCurrencyBalance(account || undefined, currencyIn)?.toExact()
  const handleMaxInput = useCallback(() => {
    maxAmountInput && setInputAmount(maxAmountInput)
  }, [maxAmountInput])

  const approveSpender = (() => {
    const isRouter = !['swapin', 'swapout'].includes(tokenInfoOut?.type ?? '')
    if (tokenInfoOut?.isApprove) {
      return isRouter ? tokenInfoOut.spender : anyToken?.address
    }
    return undefined
  })()

  const formatInputBridgeValue = tryParseAmount(
    inputAmount,
    currencyIn && tokenInfoOut?.isApprove ? currencyIn : undefined,
  )
  const [approval, approveCallback] = useApproveCallback(
    formatInputBridgeValue && tokenInfoOut?.isApprove ? formatInputBridgeValue : undefined,
    approveSpender,
  )

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
    if (approval === ApprovalState.NOT_APPROVED) {
      setApprovalSubmitted(false)
    }
  }, [approval, approvalSubmitted])

  const onCurrencySelect = useCallback(
    (tokenIn: WrappedTokenInfo) => {
      setBridgeState({ tokenIn })
    },
    [setBridgeState],
  )
  const onCurrencySelectDest = useCallback(
    (tokenOut: WrappedTokenInfo) => {
      setBridgeState({ tokenOut })
    },
    [setBridgeState],
  )
  const onSelectDestNetwork = useCallback(
    (chainId: ChainId) => {
      setBridgeState({ chainIdOut: chainId })
    },
    [setBridgeState],
  )

  const showApproveFlow =
    !inputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const disableBtnApproved = approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || !!inputError
  const disableBtnReviewTransfer =
    !!inputError ||
    [inputAmount, tokenInfoIn, tokenInfoOut, chainIdOut].some(e => !e) ||
    (approval !== ApprovalState.APPROVED && tokenInfoOut?.isApprove)
  return (
    <>
      <Flex style={{ position: 'relative', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
        <SwapFormWrapper style={{ position: 'unset' }}>
          <AppBodyWrapped style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Flex flexDirection={'column'}>
              <Label>
                <Trans>You Transfer</Trans>
              </Label>
              <Tooltip
                text={typeof inputError === 'string' ? inputError : ''}
                show={typeof inputError === 'string'}
                placement="top"
              >
                <CurrencyInputPanelBridge
                  chainIds={listChainIn}
                  selectedChainId={chainId}
                  onSelectNetwork={changeNetwork}
                  error={typeof inputError === 'string'}
                  value={inputAmount}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onCurrencySelect={onCurrencySelect}
                  id="swap-currency-input"
                />
              </Tooltip>
            </Flex>

            <PoolInfo chainId={chainId} tokenIn={tokenInfoIn} poolValue={poolValue.poolValueIn} />

            <div>
              <Flex alignItems={'flex-end'} justifyContent="space-between">
                <Label>
                  <Trans>You Receive</Trans>
                </Label>
                <ArrowWrapper>
                  <ArrowUp width={24} fill={theme.subText} style={{ cursor: 'default' }} />
                </ArrowWrapper>
              </Flex>
              <CurrencyInputPanelBridge
                chainIds={listChainOut}
                onSelectNetwork={onSelectDestNetwork}
                selectedChainId={chainIdOut}
                isOutput
                value={outputInfo.outputAmount.toString()}
                onCurrencySelect={onCurrencySelectDest}
                id="swap-currency-output"
              />
            </div>

            <PoolInfo chainId={chainIdOut} tokenIn={tokenInfoIn} poolValue={poolValue.poolValueOut} />

            {typeof inputError !== 'string' && inputError?.state && (
              <ErrorWarningPanel title={inputError?.tip} type={inputError?.state} />
            )}
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>
                <Trans>Connect Wallet</Trans>
              </ButtonLight>
            ) : (
              showApproveFlow && (
                <>
                  <RowBetween>
                    <ButtonConfirmed
                      onClick={approveCallback}
                      disabled={disableBtnApproved}
                      width="48%"
                      altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                      confirmed={approval === ApprovalState.APPROVED}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          <Trans>Approving</Trans> <Loader stroke="white" />
                        </AutoRow>
                      ) : (
                        <Flex alignContent={'center'}>
                          <MouseoverTooltip
                            placement="bottom"
                            width="300px"
                            text={t`You would need to first allow Multichain smart contract to use your ${tokenInfoIn?.symbol}. This has to be done only once for each token.`}
                          >
                            <Info size={18} />
                          </MouseoverTooltip>
                          <Text marginLeft={'5px'}>
                            <Trans>Approve {tokenInfoIn?.symbol}</Trans>
                          </Text>
                        </Flex>
                      )}
                    </ButtonConfirmed>
                    <ButtonError width="48%" id="swap-button" disabled={disableBtnReviewTransfer} onClick={showPreview}>
                      <Text fontSize={16} fontWeight={500}>
                        {t`Review transfer`}
                      </Text>
                    </ButtonError>
                  </RowBetween>
                  <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                </>
              )
            )}
            {!showApproveFlow && account && (
              <ButtonError onClick={showPreview} disabled={disableBtnReviewTransfer}>
                <Text fontWeight={500}>{t`Review Transfer`}</Text>
              </ButtonError>
            )}
            <Flex justifyContent={'flex-end'}>
              <Flex alignItems={'center'} style={{ gap: 6 }}>
                <Text color={theme.subText} fontSize={12}>
                  Powered by
                </Text>
                <ExternalLink href="https://multichain.org/">
                  <img
                    src={isDark ? MultichainLogoLight : MultichainLogoDark}
                    alt="VoxelSwap with multichain"
                    height={13}
                  />
                </ExternalLink>
              </Flex>
            </Flex>
          </AppBodyWrapped>
        </SwapFormWrapper>

        <AdvancedSwapDetailsDropdownBridge outputInfo={outputInfo} />
      </Flex>

      <ComfirmBridgeModal swapState={swapState} onDismiss={hidePreview} onSwap={handleSwap} outputInfo={outputInfo} />
    </>
  )
}
