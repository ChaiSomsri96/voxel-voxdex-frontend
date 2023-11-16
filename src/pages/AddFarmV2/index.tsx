import { Trans } from '@lingui/macro'
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import { LiquidityAction } from 'components/NavigationTabs'
import { RowBetween } from 'components/Row'
import { TutorialType } from 'components/Tutorial'
import { ArrowWrapper as ArrowWrapperVertical } from 'components/swapv2/styleds'
import { FARM_CONTRACTS as PROMM_FARM_CONTRACTS } from 'constants/v2'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { FlexLeft, ResponsiveTwoColumns, RightContainer, } from './styled'
import CustomSelect from './CustomSelect'
import CustomDatePicker from './CustomDatePicker'
import { useMedia } from 'react-use'
import { HeaderTabs } from './HeaderTabs'
import { usePoolDatas, useTopPoolAddresses } from 'state/prommPools/hooks'
import { useFarmAction } from 'state/farms/promm/hooks'
import { ethers } from 'ethers'
import Loader from 'components/Loader'
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


const AddressBox: any = styled.div`
  border-radius: 8px;
  background: ${({ theme }) => theme.buttonBlack};
  padding: 12px;
  overflow: hidden;
  margin-bottom:5px;
`
const AddressBoxFull = styled.div`
  width: 100%;
  border-radius: 8px;
  background: ${({ theme }) => theme.buttonBlack};
  padding: 12px;
  overflow: hidden;
  margin-bottom: 0px;
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


export const ButtonAddInput = styled.div`
  background: none;
  border:1px solid #f01d64;
  color: #fff;
  border-radius: 40px;
  width: 15%;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  margin-bottom:auto;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
  }
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
  const theme = useTheme()
  const routeHistory = useHistory();
  const { account, chainId } = useActiveWeb3React()

  const addr: any = PROMM_FARM_CONTRACTS[chainId ? chainId : 1];
  const { createFarm, checkRole } = useFarmAction(addr[0])

  const [vestingDuration, setVestingDuration] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [selectPool, setSelectPool] = useState('')
  const [touched, setTouched] = useState(false)
  const [poolErr, setPoolErr] = useState('')
  const [addRewardTokenValue, setAddRewardTokenValue] = useState('')
  const [addRewardTokenErr, setAddRewardTokenErr] = useState('')
  const [addRewardTokenValueErr, setAddRewardTokenValueErr] = useState('')
  const [vestingDurationError, setVestingDurationError] = useState('')
  const [startTimeError, setStartTimeError] = useState('')
  const [endTimeError, setEndTimeError] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [rewardTokenAddress, setRewardTokenAddress] = useState(currencyIdA)
  const [clearCurrency, setClearCurrency] = useState(false);
  const above1000 = useMedia('(min-width: 1000px)')

  const { loading, addresses } = useTopPoolAddresses()
  const { loading: poolDataLoading, data: poolDatas } = usePoolDatas(addresses || [])

  const currentTime = new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(":"));

  const pairDatas: any = useMemo(() => {
    const searchValue = "";

    const filteredPools = Object.values(poolDatas || []).filter(
      pool =>
        pool.address.toLowerCase() === searchValue ||
        pool.token0.name.toLowerCase().includes(searchValue) ||
        pool.token0.symbol.toLowerCase().includes(searchValue) ||
        pool.token1.name.toLowerCase().includes(searchValue) ||
        pool.token1.symbol.toLowerCase().includes(searchValue),
    )

    return Object.values(filteredPools)
  }, [
    poolDatas,
  ])

  const [roleCheck, setRoleCheck] = useState(false);
  const checkAuth = async () => {

    if (!account) {
      routeHistory.push('/farms')
    }

    const response = await checkRole(
      { role: "0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c" }
    )
    setRoleCheck(response)

    if (!response) {
      routeHistory.push('/farms')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleSubmit = async () => {
    try {

      const startDate: any = new Date(startDateTime);
      const epochStartDate = Math.round(startDate.getTime() / 1000.0);

      const endDate: any = new Date(endDateTime);
      const epochEndDate = Math.round(endDate.getTime() / 1000.0);

      const data = { vestingDuration, selectPool, epochStartDate, epochEndDate, rewardTokenAddress, addRewardTokenValue };

      const err = validate(data);
      setPoolErr(err.pool!);
      setAddRewardTokenErr(err.addRewardToken!);
      setAddRewardTokenValueErr(err.addRewardTokenValue!);
      setVestingDurationError(err.addVestingDuration!);
      setStartTimeError(err.addStartDate!);
      setEndTimeError(err.addEndDate!);

      if (!touched) {
        setTouched(true)
      }

      if (
        roleCheck &&
        !err.addVestingDuration &&
        !err.addStartDate &&
        !err.addEndDate &&
        !err.pool &&
        !err.addRewardToken &&
        !err.addRewardTokenValue
      ) {

        if (data) {
          setIsLoading(true);

          const reqData = {
            poolAddress: selectPool,
            startTime: epochStartDate,
            endTime: epochEndDate,
            vestingDuration: vestingDuration,
            rewardTokens: rewardTokenAddress,
            rewardAmounts: ethers.utils.parseUnits(String(addRewardTokenValue), "ether").toString(),
            feeTarget: (selectPool != "" ? ((pairDatas.find((o: any) => o.address == selectPool))?.feeTier) : 0)
          }

          await createFarm(reqData)
            .then(res => {
              routeHistory.push('/farms')
              setIsLoading(false);
            })
            .catch(e => {
              console.log(e)
              setIsLoading(false);
            })
        }
      }
    }
    catch (e) {
      console.log(e)
      setIsLoading(false);
    }
  }

  // Input Fields Validations
  const validate = (valu: any) => {
    type obj = {
      addVestingDuration?: string
      addStartDate?: string
      addEndDate?: string
      pool?: string;
      addRewardToken?: string;
      addRewardTokenValue?: string;
    };

    const errors: obj = {};

    if (!valu.selectPool) {
      errors.pool = "Selecting pool is required !";
    }
    if (valu.rewardTokenAddress == undefined) {
      errors.addRewardToken = "Selecting token is required !";
    }
    if (!Number(valu.addRewardTokenValue)) {
      errors.addRewardTokenValue = "Selecting token value is required !";
    }
    if ((valu.vestingDuration).length === 0) {
      errors.addVestingDuration = "Vesting duration is required !";
    }
    if ((startDateTime).length === 0) {
      errors.addStartDate = "Selecting start time is required !";
    }
    if ((endDateTime).length === 0) {
      errors.addEndDate = "Selecting end time is required !";
    }

    return errors;
  };

  const clearForm = () => {
    if (!isLoading) {
      setVestingDuration('')
      setStartDateTime('')
      setEndDateTime('')
      setSelectPool('')
      setTouched(false)
      setPoolErr('')
      setAddRewardTokenValue('')
      setAddRewardTokenErr('')
      setAddRewardTokenValueErr('')
      setVestingDurationError('')
      setStartTimeError('')
      setEndTimeError('')
      setIsLoading(false)
      setClearCurrency(!clearCurrency)
    }
  }

  const handleCurrencyASelect = (idA: any) => {
    setRewardTokenAddress(idA)
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
              customTitle={"Create A New Farm"}
              action={LiquidityAction.CREATE}
              showTooltip={true}
              onCleared={() => { clearForm() }}
              onBack={() => { history.replace('/farms') }}
              tutorialType={TutorialType.ELASTIC_ADD_LIQUIDITY}
            />
            <ResponsiveTwoColumns>
              <FlexLeft>
                <RowBetween style={{ gap: '12px' }}>
                  <BlockDiv >
                    <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                      <Trans>*Required</Trans>
                    </Text>

                    <AddressBoxFull style={{
                      marginBottom: !above1000 ? '24px' : '',
                      border: poolErr && touched ? `1px solid ${theme.red}` : undefined,
                    }}>

                      <Text fontSize={12} color={theme.subText} marginBottom="3px">
                        <Trans>Select Pool <Span>*</Span></Trans>
                      </Text>

                      {(loading || poolDataLoading)
                        ?
                        <Text fontSize={18} color={"#FFF"} marginBottom="6px" marginTop="10px">
                          <Trans>Loading...</Trans>
                        </Text>
                        :
                        <CustomSelect
                          data={pairDatas}
                          selectedValue={selectPool}
                          pool={(val: any) => { setSelectPool(val) }}
                          disabled={isLoading}
                        />
                      }

                      {poolErr && touched && (
                        <ErrorMessage>
                          <Trans>{poolErr}</Trans>
                        </ErrorMessage>
                      )}

                    </AddressBoxFull>


                    <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" marginTop="5px" fontStyle="italic">
                      <Trans>*Required</Trans>
                    </Text>
                    <AddressBoxFull
                      style={{
                        marginBottom: !above1000 ? '24px' : '',
                        border: startTimeError && touched ? `1px solid ${theme.red}` : undefined,
                      }}
                    >
                      <Text fontSize={12} color={theme.subText} >
                        <Trans>Start Time <Span>*</Span></Trans>
                      </Text>

                      <CustomDatePicker
                        value={startDateTime}
                        min={currentTime}
                        max={endDateTime}
                        dateTime={(val: any) => { setStartDateTime(val) }}
                        disabled={isLoading}
                      />

                      {startTimeError && touched && (
                        <ErrorMessage>
                          <Trans>{startTimeError}</Trans>
                        </ErrorMessage>
                      )}
                    </AddressBoxFull>

                    <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginTop="5px" marginBottom="2px" fontStyle="italic">
                      <Trans>*Required</Trans>
                    </Text>
                    <AddressBox style={{
                      marginBottom: !above1000 ? '24px' : '',
                      border: addRewardTokenErr && touched ? `1px solid ${theme.red}` : undefined,
                    }}>
                      <Text fontSize={12} color={theme.subText} marginBottom="8px">
                        <Trans>Reward Tokens <Span>*</Span></Trans>
                      </Text>

                      <CurrencySelector
                        clear={clearCurrency}
                        selectedCurrency={(val: any) => { handleCurrencyASelect(val) }}
                        disabled={isLoading}
                      />

                      {addRewardTokenErr && touched && (
                        <ErrorMessage>
                          <Trans>{addRewardTokenErr}</Trans>
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
                    border: vestingDurationError && touched ? `1px solid ${theme.red}` : undefined,
                  }}
                >
                  <Text fontSize={12} color={theme.subText} marginBottom="2px">
                    <Trans >Vesting Duration in Seconds</Trans> <Span>*</Span>
                  </Text>

                  <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                    <AddressInput
                      type="number"
                      style={{ padding: "0px", borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: "0px" }}
                      onKeyDown={onKeyDownDecimal}
                      min={0}
                      value={numberInputFilter(vestingDuration)}
                      onChange={(e: any) => {
                        setVestingDuration(String(Math.round(e.target.value)))
                      }}
                      disabled={isLoading}
                      onWheel={(e: any) => e.target.blur()}
                    />

                  </Text>
                  {vestingDurationError && touched && (
                    <ErrorMessage>
                      <Trans>{vestingDurationError}</Trans>
                    </ErrorMessage>
                  )}
                </AddressBox>

                <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginBottom="2px" fontStyle="italic">
                  <Trans>*Required</Trans>
                </Text>
                <AddressBoxFull
                  style={{
                    marginBottom: !above1000 ? '24px' : '',
                    border: endTimeError && touched ? `1px solid ${theme.red}` : undefined,
                  }}
                >
                  <Text fontSize={12} color={theme.subText} >
                    <Trans>End Time</Trans> <Span>*</Span>
                  </Text>

                  <CustomDatePicker
                    value={endDateTime}
                    min={startDateTime ? startDateTime : currentTime}
                    dateTime={(val: any) => { setEndDateTime(val) }}
                    disabled={isLoading}
                  />

                  {endTimeError && touched && (
                    <ErrorMessage>
                      <Trans>{endTimeError}</Trans>
                    </ErrorMessage>
                  )}
                </AddressBoxFull>

                <Text fontSize={12} color={"#bfbfbf"} textAlign="right" marginTop="5px" marginBottom="2px" fontStyle="italic">
                  <Trans>*Required</Trans>
                </Text>

                <AddressBox style={{
                  marginBottom: !above1000 ? '24px' : '',
                  border: addRewardTokenValueErr && touched ? `1px solid ${theme.red}` : undefined,
                }}>

                  <Text fontSize={12} color={theme.subText} marginBottom="11px">
                    <Trans>Add Reward Amount <Span>*</Span></Trans>
                  </Text>

                  <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                    <AddressInput
                      type="number"
                      style={{ padding: "0px", borderTop: "none", borderLeft: "none", borderRight: "none", borderRadius: "0px" }}
                      onKeyDown={onKeyDownDecimal}
                      min={0}
                      value={numberInputFilter(addRewardTokenValue)}
                      name="addRewardToken"
                      onChange={(e: any) => {
                        setAddRewardTokenValue(e.target.value)
                      }}
                      disabled={isLoading}
                      onWheel={(e: any) => e.target.blur()}
                    />
                  </Text>
                  {addRewardTokenValueErr && touched && (
                    <ErrorMessage>
                      <Trans>{addRewardTokenValueErr}</Trans>
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