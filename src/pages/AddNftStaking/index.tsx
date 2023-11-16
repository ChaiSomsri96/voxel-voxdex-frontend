import { TransactionResponse } from '@ethersproject/providers'
import { ONE } from '@kyberswap/ks-sdk-classic'
import { Currency, CurrencyAmount, WETH } from '@kyberswap/ks-sdk-core'
import { FeeAmount, NonfungiblePositionManager } from '@kyberswap/ks-sdk-elastic'
import { Trans, t } from '@lingui/macro'
import JSBI from 'jsbi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import { LiquidityAction } from 'components/NavigationTabs'
import ProAmmPoolInfo from 'components/ProAmm/ProAmmPoolInfo'
import ProAmmPooledTokens from 'components/ProAmm/ProAmmPooledTokens'
import ProAmmPriceRange from 'components/ProAmm/ProAmmPriceRange'
import { RowBetween } from 'components/Row'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { TutorialType } from 'components/Tutorial'
import { ArrowWrapper as ArrowWrapperVertical } from 'components/swapv2/styleds'
import { NETWORKS_INFO } from 'constants/networks'
import { nativeOnChain } from 'constants/tokens'
import { VERSION } from 'constants/v2'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useProAmmNFTPositionManagerContract } from 'hooks/useContract'
import useProAmmPoolInfo from 'hooks/useProAmmPoolInfo'
import useProAmmPreviousTicks from 'hooks/useProAmmPreviousTicks'
import useTheme from 'hooks/useTheme'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useTokensPrice, useWalletModalToggle } from 'state/application/hooks'
import { Bound, Field } from 'state/mint/proamm/actions'
import {
  useProAmmDerivedMintInfo,
  useProAmmMintActionHandlers,
  useProAmmMintState,
  useRangeHopCallbacks,
} from 'state/mint/proamm/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useIsExpertMode } from 'state/user/hooks'
import { basisPointsToPercent, calculateGasMargin } from 'utils'
import { currencyId } from 'utils/currencyId'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { FlexLeft, ResponsiveTwoColumns, RightContainer, } from './styled'
import { useMedia } from 'react-use'
import { HeaderTabs } from './HeaderTabs'
import { useStakingAction } from 'state/nfts/promm/hooks'
import Loader from 'components/Loader'
import { ethers } from 'ethers'
import CurrencySelector from 'pages/AddTokenStaking/CurrencySelector'


export const Container = styled.div`
  width: 100%;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.background};

  padding: 4px 20px 28px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 16px 24px;
  `};
`

const AddressBox = styled.div`
  border-radius: 8px;
  background: ${({ theme }) => theme.buttonBlack};
  padding: 12px;
  overflow: hidden;
  margin-bottom:10px;
`

const AddressInput = styled.input`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.text};
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  border-bottom: 1px solid;
`

const PageWrapper = styled.div`
  width: 100%;
  padding: 28px;
  min-width: 343px;
`

const BodyWrapper = styled.div`
  max-width: 1016px;
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 20px;
  margin: auto;
`
const BlockDiv = styled.div`
  display: block;
  width: 100%;
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red};
  font-size: 12px;
  margin-top: 8px;
`

const Span = styled.span`
color: #f01d64;
`

export const ArrowWrapper = styled(ArrowWrapperVertical) <{ rotated?: boolean }>`
  transform: rotate(${({ rotated }) => (rotated ? '270deg' : '90deg')});
  width: 40px;
  height: 40px;
`
export default function AddFarmV2({
  match: {
    params: { currencyIdA, currencyIdB, feeAmount: feeAmountFromUrl },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string; feeAmount?: string; tokenId?: string }>) {

  const routeHistory = useHistory();
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useTheme()
  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected
  const expertMode = useIsExpertMode()
  const addTransactionWithType = useTransactionAdder()
  const positionManager = useProAmmNFTPositionManagerContract()
  const { createNftStake, checkRole } = useStakingAction();


  const [reward, setReward] = useState('')
  const [nftAddress, setNftAddress] = useState('')
  const [collectionName, setCollectionName] = useState('')
  const [rewardTokenAddress, setRewardTokenAddress] = useState(currencyIdA)
  const [lockTime, setLockTime] = useState('')
  const [collectionLogo, setCollectionLogo] = useState('')

  const [rewardErr, setRewardErr] = useState('')
  const [nftAddressErr, setNftAddressErr] = useState('')
  const [collectionNameErr, setCollectionNameErr] = useState('')
  const [rewardTokenAddressErr, setRewardTokenAddressErr] = useState('')
  const [lockTimeErr, setLockTimeErr] = useState('')
  const [collectionLogoErr, setCollectionLogoErr] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [clearCurrency, setClearCurrency] = useState(false);
  const [touched, setTouched] = useState(false)
  const above1000 = useMedia('(min-width: 1000px)')

  const [roleCheck, setRoleCheck] = useState(false);
  const checkAuth = async () => {

    if (!account) {
      routeHistory.push('/nft-staking')
    }

    const response = await checkRole(
      { role: "0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c" }
    )
    setRoleCheck(response)

    if (!response) {
      routeHistory.push('/nft-staking')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])


  const handleSubmit = async () => {
    const data = { reward, nftAddress, collectionName, rewardTokenAddress, lockTime, collectionLogo };
    const err = validate(data);

    setRewardErr(err.reward!);
    setNftAddressErr(err.nftAddress!);
    setCollectionNameErr(err.collectionName!);
    setRewardTokenAddressErr(err.rewardTokenAddress!);
    setLockTimeErr(err.lockTime!);
    setCollectionLogoErr(err.collectionLogo!);

    if (!touched) {
      setTouched(true)
    }

    if (
      roleCheck &&
      !err.reward &&
      !err.nftAddress &&
      !err.collectionName &&
      !err.rewardTokenAddress &&
      !err.lockTime &&
      !err.collectionLogo
    ) {
      if (data) {
        setIsLoading(true);

        const _data = {
          nftCollectionAddress: nftAddress,
          rewardToken: rewardTokenAddress,
          rewardPerDay: ethers.utils.parseUnits(String(reward), "ether").toString(),
          lockTime: lockTime,
          name: collectionName,
          logoURI: collectionLogo,
        }

        const res = await createNftStake(_data).catch((e) => { console.log(e); setIsLoading(false); })

        if (res) {
          setIsLoading(false);
          routeHistory.push('/nft-staking')
        }
      }
    }
  }

  // Input Fields Validations
  const validate = (valu: any) => {
    type obj = {
      reward?: string;
      nftAddress?: string;
      collectionName?: string;
      rewardTokenAddress?: string;
      lockTime?: string;
      collectionLogo?: string;
    };

    const errors: obj = {};

    const regex = /[A-Za-z0-9]{2,5}$/i;
    if (!Number(valu.reward)) {
      errors.reward = "Reward is Required !";
    }

    if (!valu.nftAddress) {
      errors.nftAddress = "NFT Address is Required !";
    } else if (!regex.test(valu.nftAddress)) {
      errors.nftAddress = "This is not a Valid NFT Address!";
    } else if (valu.nftAddress.length < 5) {
      errors.nftAddress = "Address Value Must Be Greater Than 5 Character";
    }

    if (!valu.collectionName) {
      errors.collectionName = "Collectin Name is Required !";
    }

    if (valu.rewardTokenAddress == undefined) {
      errors.rewardTokenAddress = "Token Address is Required !";
    }

    if (!valu.lockTime) {
      errors.lockTime = "Minimum Lock Time is Required !";
    }

    if (!valu.collectionLogo) {
      errors.collectionLogo = "Collection Logo URL is Required !";
    }

    return errors;
  };

  // Prevent minus, plus and e from input type number
  const onKeyDownDecimal = (event: any) => {
    if (
      event.keyCode === 189 || // (-)
      event.keyCode === 187 || // (+)
      event.keyCode === 69     // (e)
    ) {
      event.preventDefault()
    }
  }

  const clearForm = () => {
    if (!isLoading) {
      setReward('')
      setNftAddress('')
      setCollectionName('')
      setRewardTokenAddress('')
      setLockTime('')
      setCollectionLogo('')
      setRewardErr('')
      setNftAddressErr('')
      setCollectionNameErr('')
      setRewardTokenAddressErr('')
      setLockTimeErr('')
      setCollectionLogoErr('')
      setTouched(false)
      setIsLoading(false)
      setClearCurrency(!clearCurrency)
    }
  }

  const numberInputFilter = (val: any, maxValue = 0) => {
    const format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

    if (Number(maxValue) === 0) {
      if (Number(val) >= 0 || !format.test(String(val))) {
        return (val);
      }
    }
    else if (Number(maxValue) > 0) {

      if (Number(val) < Number(maxValue)) {
        if (Number(val) >= 0 || !format.test(String(val))) {
          return (val);
        }
      }
      else if (Number(val) > Number(maxValue)) {
        return (maxValue);
      }
    }
  }


  // fee selection from url
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : FeeAmount.MEDIUM
  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  const tokenA = (baseCurrency ?? undefined)?.wrapped
  const tokenB = (quoteCurrency ?? undefined)?.wrapped
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  // mint state
  const { independentField, typedValue, startPriceTypedValue } = useProAmmMintState()

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
    amount0Unlock,
    amount1Unlock,
  } = useProAmmDerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
  )
  const poolAddress = useProAmmPoolInfo(baseCurrency, currencyB, feeAmount)
  const previousTicks =
    // : number[] = []
    useProAmmPreviousTicks(pool, position)
  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useProAmmMintActionHandlers(noLiquidity)

  const isValid = !errorMessage && !invalidRange

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // capital efficiency warning
  const [showCapitalEfficiencyWarning, setShowCapitalEfficiencyWarning] = useState(false)

  useEffect(() => setShowCapitalEfficiencyWarning(false), [baseCurrency, quoteCurrency, feeAmount])

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toExact() ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      let maxAmount = maxAmountSpend(currencyBalances[field])
      let amountUnlock = JSBI.BigInt('0')
      if (maxAmount && currencies[field] && noLiquidity && tokenA && tokenB) {
        if (
          (!invertPrice && tokenA.equals(currencies[field] as Currency)) ||
          (invertPrice && tokenB.equals(currencies[field] as Currency))
        ) {
          amountUnlock = amount0Unlock
        } else {
          amountUnlock = amount1Unlock
        }
        maxAmount = maxAmount?.subtract(CurrencyAmount.fromRawAmount(currencies[field] as Currency, amountUnlock))
      }
      return {
        ...accumulator,
        [field]: maxAmount,
      }
    },
    {},
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    !!currencies[Field.CURRENCY_A] && depositADisabled && noLiquidity
      ? CurrencyAmount.fromFractionalAmount(currencies[Field.CURRENCY_A] as Currency, ONE, ONE)
      : parsedAmounts[Field.CURRENCY_A],
    chainId ? NETWORKS_INFO[chainId].elastic.nonfungiblePositionManager : undefined,
  )

  const [approvalB, approveBCallback] = useApproveCallback(
    !!currencies[Field.CURRENCY_B] && depositBDisabled && noLiquidity
      ? CurrencyAmount.fromFractionalAmount(currencies[Field.CURRENCY_B] as Currency, ONE, ONE)
      : parsedAmounts[Field.CURRENCY_B],
    chainId ? NETWORKS_INFO[chainId].elastic.nonfungiblePositionManager : undefined,
  )

  const tokens = useMemo(
    () => [currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]].map(currency => currency?.wrapped),
    [currencies],
  )
  const usdPrices = useTokensPrice(tokens, VERSION.ELASTIC)
  const estimatedUsdCurrencyA =
    parsedAmounts[Field.CURRENCY_A] && usdPrices[0]
      ? parseFloat((parsedAmounts[Field.CURRENCY_A] as CurrencyAmount<Currency>).toExact()) * usdPrices[0]
      : 0

  const estimatedUsdCurrencyB =
    parsedAmounts[Field.CURRENCY_B] && usdPrices[1]
      ? parseFloat((parsedAmounts[Field.CURRENCY_B] as CurrencyAmount<Currency>).toExact()) * usdPrices[1]
      : 0

  const allowedSlippage = useUserSlippageTolerance()

  async function onAdd() {
    if (!chainId || !library || !account) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (!previousTicks || previousTicks.length !== 2) {
      return
    }
    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined

      const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, previousTicks, {
        slippageTolerance: basisPointsToPercent(allowedSlippage[0]),
        recipient: account,
        deadline: deadline.toString(),
        useNative,
        createPool: noLiquidity,
      })

      const txn: { to: string; data: string; value: string } = {
        to: NETWORKS_INFO[chainId].elastic.nonfungiblePositionManager,
        data: calldata,
        value,
      }

      setAttemptingTxn(true)
      library
        .getSigner()
        .estimateGas(txn)
        .then(estimate => {
          const newTxn = {
            ...txn,
            gasLimit: calculateGasMargin(estimate),
          }
          //calculateGasMargin = 0x0827f6

          return library
            .getSigner()
            .sendTransaction(newTxn)
            .then((response: TransactionResponse) => {
              setAttemptingTxn(false)
              if (noLiquidity) {
                addTransactionWithType(response, {
                  type: 'Elastic Create pool',
                  summary: `${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '0'} ${baseCurrency.symbol} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '0'
                    } ${quoteCurrency.symbol} `,
                  arbitrary: {
                    token_1: baseCurrency.symbol,
                    token_2: quoteCurrency.symbol,
                  },
                })
              } else {
                addTransactionWithType(response, {
                  type: 'Elastic Add liquidity',
                  summary: `${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '0'} ${baseCurrency.symbol} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '0'
                    } ${quoteCurrency.symbol} `,
                  arbitrary: {
                    poolAddress: poolAddress,
                    token_1: baseCurrency.symbol,
                    token_2: quoteCurrency.symbol,
                  },
                })
              }

              setTxHash(response.hash)
            })
        })
        .catch(error => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    } else {
      return
    }
  }

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew, chainId)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      } else {
        // prevent weth + eth
        const isETHOrWETHNew = currencyNew.isNative || (chainId && currencyIdNew === WETH[chainId]?.address)
        const isETHOrWETHOther =
          !!currencyIdOther &&
          ((chainId && currencyIdOther === nativeOnChain(chainId).symbol) ||
            (chainId && currencyIdOther === WETH[chainId]?.address))

        if (isETHOrWETHNew && isETHOrWETHOther) {
          return [currencyIdNew, undefined]
        } else {
          return [currencyIdNew, currencyIdOther]
        }
      }
    },
    [chainId],
  )

  const handleCurrencyASelect = (idA: any) => {
    setRewardTokenAddress(idA)
  }

  // const handleCurrencyASelect = useCallback(
  //   (currencyANew: Currency) => {
  //     const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
  //     setRewardTokenAddress(idA);
  //     if (idB === undefined) {
  //       history.push(`/nft-staking/add/${idA}`)
  //     } else {
  //       history.push(`/nft-staking/add/${idA}/${idB}`)
  //     }
  //   },
  //   [handleCurrencySelect, currencyIdB, history],
  // )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      // dont jump to pool page if creating
      history.push('/myPools')
    }
    setTxHash('')
  }, [history, onFieldAInput, txHash])

  const addIsUnsupported = false

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const leftPrice = isSorted ? priceLower : priceUpper?.invert()
  const rightPrice = isSorted ? priceUpper : priceLower?.invert()

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(
      baseCurrency ?? undefined,
      quoteCurrency ?? undefined,
      feeAmount,
      tickLower,
      tickUpper,
      pool,
      price,
    )

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA = approvalA !== ApprovalState.APPROVED && (noLiquidity ? true : !!parsedAmounts[Field.CURRENCY_A])
  const showApprovalB = approvalB !== ApprovalState.APPROVED && (noLiquidity ? true : !!parsedAmounts[Field.CURRENCY_B])

  const pendingText = `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(10) : ''} ${!depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''
    } ${!depositADisabled && !depositBDisabled ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(10) : ''
    } ${!depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''}`




  return (
    <>
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => (
          <ConfirmationModalContent
            title={!!noLiquidity ? t`Create a new pool` : t`Add Liquidity`}
            onDismiss={handleDismissConfirmation}
            topContent={() =>
              position && (
                <div style={{ marginTop: '1rem' }}>
                  <ProAmmPoolInfo position={position} />
                  <ProAmmPooledTokens
                    liquidityValue0={CurrencyAmount.fromRawAmount(
                      unwrappedToken(position.pool.token0),
                      position.amount0.quotient,
                    )}
                    liquidityValue1={CurrencyAmount.fromRawAmount(
                      unwrappedToken(position.pool.token1),
                      position.amount1.quotient,
                    )}
                    title={'New Liquidity Amount'}
                  />
                  <ProAmmPriceRange position={position} ticksAtLimit={ticksAtLimit} />
                </div>
              )
            }
            bottomContent={() => (
              <ButtonPrimary onClick={onAdd}>
                <Text fontWeight={500}>
                  <Trans>Supply</Trans>
                </Text>
              </ButtonPrimary>
            )}
          />
        )}
        pendingText={pendingText}
      />
      <PageWrapper>
        <BodyWrapper>
          <Container>

            <HeaderTabs
              hideShare
              action={!!noLiquidity ? LiquidityAction.CREATE : LiquidityAction.ADD}
              showTooltip={true}
              onCleared={() => {
                clearForm()
              }}
              onBack={() => {
                history.replace('/nft-staking')
              }}
              tutorialType={TutorialType.ELASTIC_ADD_LIQUIDITY}
            />

            <ResponsiveTwoColumns>

              <FlexLeft>

                <RowBetween style={{ gap: '12px' }}>

                  <BlockDiv >

                    <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                      <Trans>*Required</Trans>
                    </Text>
                    <AddressBox
                      style={{
                        marginBottom: !above1000 ? '24px' : '',
                        border: nftAddressErr && touched ? `1px solid ${theme.red}` : undefined,
                      }}
                    >
                      <Text fontSize={12} color={theme.subText} marginBottom="8px" paddingBottom="15px">
                        <Trans>NFT Collection Address <Span>*</Span></Trans>
                      </Text>
                      <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                        <AddressInput
                          type="text"
                          value={nftAddress}
                          onChange={(e: any) => {
                            setNftAddress(e.target.value)
                          }}
                          disabled={isLoading}
                        />
                      </Text>
                      {nftAddressErr && touched && (
                        <ErrorMessage>
                          <Trans>{nftAddressErr}</Trans>
                        </ErrorMessage>
                      )}
                    </AddressBox>

                    <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                      <Trans>*Required</Trans>
                    </Text>
                    <AddressBox style={{
                      marginBottom: !above1000 ? '24px' : '',
                      border: rewardErr && touched ? `1px solid ${theme.red}` : undefined,
                    }}>

                      <Text fontSize={12} color={theme.subText} marginBottom="8px">
                        <Trans>Rewards/Day <Span>*</Span></Trans>
                      </Text>
                      <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                        <AddressInput
                          type="number"
                          style={{ padding: "0px", borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: "0px" }}
                          onKeyDown={onKeyDownDecimal}
                          min={0}
                          value={numberInputFilter(reward)}
                          onChange={(e: any) => {
                            setReward(e.target.value)
                          }}
                          disabled={isLoading}
                          onWheel={(e: any) => e.target.blur()}
                        />
                      </Text>
                      {rewardErr && touched && (
                        <ErrorMessage>
                          <Trans>{rewardErr}</Trans>
                        </ErrorMessage>
                      )}
                    </AddressBox>

                    <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                      <Trans>*Required</Trans>
                    </Text>
                    <AddressBox style={{
                      marginBottom: !above1000 ? '24px' : '',
                      border: collectionNameErr && touched ? `1px solid ${theme.red}` : undefined,
                    }}>
                      <Text fontSize={12} color={theme.subText} marginBottom="8px">
                        <Trans>Collection Name <Span>*</Span></Trans>
                      </Text>
                      <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                        <AddressInput
                          type="text"
                          value={collectionName}
                          onChange={(e: any) => {
                            setCollectionName(e.target.value)
                          }}
                          disabled={isLoading}
                        />
                      </Text>
                      {collectionNameErr && touched && (
                        <ErrorMessage>
                          <Trans>{collectionNameErr}</Trans>
                        </ErrorMessage>
                      )}
                    </AddressBox>

                  </BlockDiv>

                </RowBetween>

              </FlexLeft>


              <RightContainer >

                <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                  <Trans>*Required</Trans>
                </Text>

                <AddressBox style={{
                  marginBottom: !above1000 ? '24px' : '',
                  border: rewardTokenAddressErr && touched ? `1px solid ${theme.red}` : undefined,
                }}>

                  <Text fontSize={12} color={theme.subText} marginBottom="8px">
                    <Trans>Reward Token Address <Span>*</Span></Trans>
                  </Text>

                  <CurrencySelector
                    clear={clearCurrency}
                    selectedCurrency={(val: any) => { handleCurrencyASelect(val) }}
                    disabled={isLoading}
                  />

                  {/* <CurrencyInputPanel
                    hideBalance
                    value={formattedAmounts[Field.CURRENCY_A]}
                    onUserInput={onFieldAInput}
                    hideInput={true}
                    showMaxButton={false}
                    onCurrencySelect={handleCurrencyASelect}
                    currency={currencies[Field.CURRENCY_A] ?? null}
                    id="add-input-tokena"
                    showCommonBases
                    estimatedUsd={formattedNum(estimatedUsdCurrencyA.toString(), true) || undefined}
                    maxCurrencySymbolLength={6}
                  /> */}

                  {rewardTokenAddressErr && touched && (
                    <ErrorMessage>
                      <Trans>{rewardTokenAddressErr}</Trans>
                    </ErrorMessage>
                  )}
                </AddressBox>


                <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                  <Trans>*Required</Trans>
                </Text>
                <AddressBox style={{
                  marginBottom: !above1000 ? '24px' : '',
                  border: lockTimeErr && touched ? `1px solid ${theme.red}` : undefined,
                }}>
                  <Text fontSize={12} color={theme.subText} marginBottom="8px">
                    <Trans>Min Lock Time In Seconds <Span>*</Span></Trans>
                  </Text>
                  <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                    <AddressInput
                      style={{ padding: "0px", borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: "0px" }}
                      type="number"
                      onKeyDown={onKeyDownDecimal}
                      min={0}
                      value={numberInputFilter(lockTime)}
                      onChange={(e: any) => {
                        setLockTime(e.target.value)
                      }}
                      disabled={isLoading}
                      onWheel={(e: any) => e.target.blur()}
                    />
                  </Text>
                  {lockTimeErr && touched && (
                    <ErrorMessage>
                      <Trans>{lockTimeErr}</Trans>
                    </ErrorMessage>
                  )}
                </AddressBox>


                <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                  <Trans>*Required</Trans>
                </Text>
                <AddressBox style={{
                  marginBottom: !above1000 ? '24px' : '',
                  border: collectionLogoErr && touched ? `1px solid ${theme.red}` : undefined,
                }}>
                  <Text fontSize={12} color={theme.subText} marginBottom="8px">
                    <Trans>Collection Logo URL <Span>*</Span></Trans>
                  </Text>
                  <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                    <AddressInput
                      type="text"
                      value={collectionLogo}
                      onChange={(e: any) => {
                        setCollectionLogo(e.target.value)
                      }}
                      disabled={isLoading}
                    />
                  </Text>
                  {collectionLogoErr && touched && (
                    <ErrorMessage>
                      <Trans>{collectionLogoErr}</Trans>
                    </ErrorMessage>
                  )}
                </AddressBox>
              </RightContainer>

            </ResponsiveTwoColumns>

            <ButtonPrimary disabled={isLoading} onClick={handleSubmit} style={{ marginTop: 'auto' }}>
              {isLoading
                ?
                <Trans>Create&nbsp;<Loader /></Trans>
                :
                <Trans>Create</Trans>
              }
            </ButtonPrimary>


          </Container>
        </BodyWrapper>
      </PageWrapper>
    </>
  )
}