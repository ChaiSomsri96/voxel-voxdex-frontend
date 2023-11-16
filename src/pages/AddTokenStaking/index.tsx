import { Trans, t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import { ethers } from 'ethers'
import InfoHelper from 'components/InfoHelper'
import { LiquidityAction } from 'components/NavigationTabs'
import { RowBetween } from 'components/Row'
import { TutorialType } from 'components/Tutorial'
import { ArrowWrapper as ArrowWrapperVertical } from 'components/swapv2/styleds'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { FlexLeft, ResponsiveTwoColumns, RightContainer, } from './styled'
import CustomDatePicker from './CustomDatePicker'
import { useMedia } from 'react-use'
import { HeaderTabs } from './HeaderTabs'
import { useTokenStakingAction } from 'state/nfts/promm/hooks'
import Loader from 'components/Loader'
import CurrencySelector from './CurrencySelector'

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
const AddressBoxFull = styled.div`
  width: 100%;
  border-radius: 8px;
  background: ${({ theme }) => theme.buttonBlack};
  padding: 12px;
  overflow: hidden;
  margin-bottom: 10px;
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

  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()

  const [rewardToken, setRewardToken] = useState('')
  const [tokenStake, setTokenStake] = useState('')
  const [apy, setApy] = useState('')
  const [lockPeriod, setLockPeriod] = useState('')
  const [mintStake, setMintStake] = useState('')
  const [touched, setTouched] = useState(false)
  const [closingInDateTime, setClosingInDateTime] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const [lockPeriodErr, setLockPeriodErr] = useState('')
  const [mintStakeErr, setMintStakeErr] = useState('')
  const [tokenStakeErr, setSetTokenStakeErr] = useState('')
  const [rewardTokenErr, setRewardTokenErr] = useState('')
  const [apyErr, setApyErr] = useState('')
  const [closingTimeErr, setClosingTimeErr] = useState('')
  const above1000 = useMedia('(min-width: 1000px)')
  const [clearCurrency, setClearCurrency] = useState(false);

  const { createTokenStake, checkRole } = useTokenStakingAction();

  const [roleCheck, setRoleCheck] = useState(false);
  const checkAuth = async () => {

    if (!account) {
      routeHistory.push('/token-staking')
    }

    const response = await checkRole(
      { role: "0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c" }
    )
    setRoleCheck(response)

    if (!response) {
      routeHistory.push('/token-staking')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleCurrencyASelect = (idA: any) => {
    setTokenStake(idA)
  }

  const handleCurrencyBSelect = (idB: any) => {
    setRewardToken(idB)
  }

  const handleSubmit = async () => {

    const a: any = new Date();
    const b: any = new Date(closingInDateTime);
    const differenceDate = Math.round(Math.abs(a - b) / 1000);

    const data = { rewardToken, tokenStake, apy, lockPeriod, mintStake, differenceDate };

    const err = validate(data);

    setLockPeriodErr(err.lockPeriod!);
    setMintStakeErr(err.mintStake!);
    setSetTokenStakeErr(err.tokenStake!);
    setRewardTokenErr(err.rewardToken!);
    setApyErr(err.apy!);
    setClosingTimeErr(err.closingIn!);

    if (!touched) {
      setTouched(true)
    }

    if (
      roleCheck &&
      !err.lockPeriod &&
      !err.mintStake &&
      !err.tokenStake &&
      !err.rewardToken &&
      !err.apy &&
      !err.closingIn
    ) {
      if (data) {
        setIsLoading(true);

        const _data = {
          tokenStake: tokenStake,
          rewardToken: rewardToken,
          lockPeriod: lockPeriod,
          mintStake: ethers.utils.parseUnits(String(mintStake), "ether").toString(),
          apy: String(Math.round(Number(apy) * 100)),
          differenceDate: String(differenceDate),
        }

        const res = await createTokenStake(_data).catch((e) => { console.log(e); setIsLoading(false); })

        if (res) {
          setIsLoading(false);
          routeHistory.push('/token-staking')
        }
      }
    }
  }


  // Input Fields Validations
  const validate = (valu: any) => {

    type obj = {
      lockPeriod?: string;
      mintStake?: string;
      tokenStake?: string;
      rewardToken?: string;
      apy?: string;
      closingIn?: string;
    };

    const errors: obj = {};

    if (!valu.lockPeriod) {
      errors.lockPeriod = "Lock Period is Required!";
    }

    if (!Number(valu.mintStake)) {
      errors.mintStake = "Minimum Stake is Required!";
    }

    if (!valu.tokenStake) {
      errors.tokenStake = "Token To Stake is Required!";
    }

    if (!valu.rewardToken) {
      errors.rewardToken = "Reward Token is Required!";
    }

    if (!valu.apy) {
      errors.apy = "APY is Required!";
    }

    if ((closingInDateTime).length === 0) {
      errors.closingIn = "Closing Time is Required!";
    }

    return errors;
  };

  const clearForm = () => {
    if (!isLoading) {
      setRewardToken('')
      setTokenStake('')
      setApy('')
      setLockPeriod('')
      setMintStake('')
      setTouched(false)
      setClosingInDateTime('')
      setLockPeriodErr('')
      setMintStakeErr('')
      setSetTokenStakeErr('')
      setRewardTokenErr('')
      setApyErr('')
      setClosingTimeErr('')
      setIsLoading(false)
      setClearCurrency(!clearCurrency)
    }
  }

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

  return (
    <>
      <PageWrapper>
        <BodyWrapper>
          <Container>

            <HeaderTabs
              hideShare
              customTitle={"Create Token Staking"}
              action={LiquidityAction.CREATE}
              showTooltip={true}
              onCleared={() => {
                clearForm();
              }}
              onBack={() => {
                history.replace('/token-staking')
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
                        border: tokenStakeErr && touched ? `1px solid ${theme.red}` : undefined,
                      }}
                    >
                      <Text fontSize={12} color={theme.subText} marginBottom="8px">
                        <Trans>Token to Stake </Trans>
                      </Text>

                      <CurrencySelector
                        clear={clearCurrency}
                        selectedCurrency={(val: any) => { handleCurrencyASelect(val) }}
                        disabled={isLoading}
                      />

                      {tokenStakeErr && touched && (
                        <ErrorMessage>
                          <Trans>{tokenStakeErr}</Trans>
                        </ErrorMessage>
                      )}
                    </AddressBox>


                    <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="4px" fontStyle="italic">
                      <Trans>*Required</Trans>
                    </Text>
                    <AddressBox
                      style={{
                        marginBottom: !above1000 ? '24px' : '',
                        border: lockPeriodErr && touched ? `1px solid ${theme.red}` : undefined,
                      }} >
                      <Text fontSize={12} color={theme.subText} marginBottom="8px">
                        <Trans>Lock Period in Seconds <Span>*</Span></Trans>
                        <InfoHelper
                          size={12}
                          text={t`Any tool tips here`}
                          placement="top"
                        />
                      </Text>
                      <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                        <AddressInput
                          type="number"
                          style={{ padding: "0px", borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: "0px" }}
                          onKeyDown={onKeyDownDecimal}
                          min={0}
                          value={numberInputFilter(lockPeriod)}
                          onChange={(e: any) => {
                            setLockPeriod(e.target.value)
                          }}
                          disabled={isLoading}
                        />
                      </Text>
                      {lockPeriodErr && touched && (
                        <ErrorMessage>
                          <Trans>{lockPeriodErr}</Trans>
                        </ErrorMessage>
                      )}
                    </AddressBox>


                    <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="4px" fontStyle="italic">
                      <Trans>*Required</Trans>
                    </Text>
                    <AddressBox
                      style={{
                        marginBottom: !above1000 ? '24px' : '',
                        border: apyErr && touched ? `1px solid ${theme.red}` : undefined,
                      }}
                    >
                      <Text fontSize={12} color={theme.subText} marginBottom="8px">
                        <Trans>APY</Trans>
                      </Text>

                      <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                        <AddressInput
                          type="number"
                          style={{ padding: "0px", borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: "0px" }}
                          onKeyDown={onKeyDownDecimal}
                          min={0}
                          value={numberInputFilter(apy)}
                          onChange={(e: any) => {
                            setApy(e.target.value)
                          }}
                          disabled={isLoading}
                        />
                      </Text>

                      {apyErr && touched && (
                        <ErrorMessage>
                          <Trans>{apyErr}</Trans>
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
                <AddressBox
                  style={{
                    marginBottom: !above1000 ? '24px' : '',
                    border: rewardTokenErr && touched ? `1px solid ${theme.red}` : undefined,
                  }}
                >

                  <Text fontSize={12} color={theme.subText} marginBottom="8px">
                    <Trans>Reward Token</Trans>
                  </Text>

                  <CurrencySelector
                    clear={clearCurrency}
                    selectedCurrency={(val: any) => { handleCurrencyBSelect(val) }}
                    disabled={isLoading}
                  />

                  {rewardTokenErr && touched && (
                    <ErrorMessage>
                      <Trans>{rewardTokenErr}</Trans>
                    </ErrorMessage>
                  )}
                </AddressBox>


                <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                  <Trans>*Required</Trans>
                </Text>
                <AddressBoxFull style={{
                  marginBottom: !above1000 ? '24px' : '',
                  border: mintStakeErr && touched ? `1px solid ${theme.red}` : undefined,
                }}>
                  <Text fontSize={12} color={theme.subText} marginBottom="9px">
                    <Trans>Min to Stake <Span>*</Span></Trans>
                  </Text>

                  <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                    <AddressInput
                      type="number"
                      style={{ padding: "0px", borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: "0px" }}
                      onKeyDown={onKeyDownDecimal}
                      min={0}
                      value={numberInputFilter(mintStake)}
                      onChange={(e: any) => {
                        setMintStake(e.target.value)
                      }}
                      disabled={isLoading}
                    />
                  </Text>
                  {mintStakeErr && touched && (
                    <ErrorMessage>
                      <Trans>{mintStakeErr}</Trans>
                    </ErrorMessage>
                  )}
                </AddressBoxFull>


                <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                  <Trans>*Required</Trans>
                </Text>
                <AddressBoxFull
                  style={{
                    marginBottom: !above1000 ? '24px' : '',
                    border: closingTimeErr && touched ? `1px solid ${theme.red}` : undefined,
                  }}
                >
                  <Text fontSize={12} color={theme.subText} marginBottom="10px">
                    <Trans>Closing In</Trans>
                  </Text>

                  <CustomDatePicker
                    value={closingInDateTime}
                    dateTime={(val: any) => { setClosingInDateTime(val) }}
                    disabled={isLoading}
                  />

                  {closingTimeErr && touched && (
                    <ErrorMessage>
                      <Trans>{closingTimeErr}</Trans>
                    </ErrorMessage>
                  )}
                </AddressBoxFull>

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