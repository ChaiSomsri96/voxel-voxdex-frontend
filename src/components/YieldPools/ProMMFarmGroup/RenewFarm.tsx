import { useState } from "react"
import { Trans } from '@lingui/macro'
import { X } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import Modal from 'components/Modal'
import { Z_INDEXS } from 'constants/styles'
import { ButtonPrimary } from 'components/Button'
import useTheme from 'hooks/useTheme'
import Loader from "components/Loader"
import { useFarmAction } from "state/farms/promm/hooks"
import { FARM_CONTRACTS as PROMM_FARM_CONTRACTS } from 'constants/v2'
import { useActiveWeb3React } from "hooks"
import { ethers } from "ethers"

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
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

const Span = styled.span`
color: #f01d64;
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red};
  font-size: 12px;
  margin-top: 8px;
`

const WarningMessage = styled.div`
  color: ${({ theme }) => theme.yellow1};
  font-size: 12px;
  margin-top: 8px;
`

const AddressBox: any = styled.div`
  border-radius: 8px;
  background: ${({ theme }) => theme.buttonBlack};
  padding: 12px;
  overflow: hidden;
  margin-bottom:5px;
`

const selectBox = {
    width: "100%",
    height: "35px",
    background: "black",
    color: "white",
    outline: "none",
    border: "none",
    fontFamily: "unset",
}

const address = {
    height: "35px",
    padding: "0px",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderRadius: "0px"
}

const dateInput = {
    filter: "invert(1)",
    border: "none",
    width: "100%",
    padding: "10px",
    outline: "none",
    fontWeight: "bold"
}

export default function RenewModal(props: any) {
    const theme = useTheme();
    const minDateToday = new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(":"));
    const { chainId, account } = useActiveWeb3React()
    const addr: any = PROMM_FARM_CONTRACTS[chainId ? chainId : 1];
    const { renewPool } = useFarmAction(addr[0])

    const [rewardAmounts, setRewardAmounts] = useState("");
    const [rewardAmountsError, setRewardAmountsError] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [startDateError, setStartDateError] = useState(false);

    const [endDate, setEndDate] = useState("");
    const [endDateError, setEndDateError] = useState(false);

    const [process, setProcess] = useState(false);

    const toggleModalClose = () => {
        props?.setIsOpen(false);

        setRewardAmounts("")
        setStartDate("")
        setEndDate("")
        setProcess(false)
    }

    const setStartDateFunction = (val: any) => {
        const str = String(val).trim();
        setStartDate(val)

        if (str?.length > 0) {
            setStartDateError(false);
        }
    }

    const setEndDateFunction = (val: any) => {
        const str = String(val).trim();
        setEndDate(val)

        if (str?.length > 0) {
            setEndDateError(false);
        }
    }

    const setRewardAmountFunction = (val: any) => {
        const str = String(val).trim();
        setRewardAmounts(val)

        if (str?.length > 0) {
            setRewardAmountsError(false);
        }
        else { setRewardAmountsError(true) }
    }

    const renewProcess = async () => {
        try {

            if (startDate) { setStartDateError(false) }
            else { setStartDateError(true) }
            if (endDate) { setEndDateError(false) }
            else { setEndDateError(true) }
            if (rewardAmounts) { setRewardAmountsError(false) }
            else { setRewardAmountsError(true) }

            if (startDate && endDate && rewardAmounts) {
                setProcess(true);

                const farmData = props?.farm;

                const _startDate: any = new Date(startDate);
                const epochStartDate = Math.round(_startDate.getTime() / 1000.0);

                const _endDate: any = new Date(endDate);
                const epochEndDate = Math.round(_endDate.getTime() / 1000.0);

                const requestData = {
                    pid: farmData?.pid,
                    startTime: epochStartDate,
                    endTime: epochEndDate,
                    vestingDuration: farmData?.vestingDuration,
                    rewardAmounts: ethers.utils.parseUnits(String(rewardAmounts), "ether").toString(),
                    feeTarget: farmData?.feeTier,
                }

                await renewPool(requestData)
                    .then((res: any) => {
                        setProcess(false);
                        toggleModalClose()
                    })
            }
        }
        catch (e) {
            console.log(e);
            setProcess(false);
        }
    }

    // Prevent Plus, minus and a-z from input type number
    const onKeyDownNonDecimal = (event: any) => {
        if (
            event.keyCode === 187 || // (+)
            event.keyCode === 189 || // (-)
            event.keyCode === 69 ||  // (e)
            (event.keyCode >= 65 && event.keyCode <= 90) || // A - Z
            (event.keyCode === 16)   // Shift
        ) {
            event.preventDefault()
        }
    }

    return (
        <>
            <Modal
                zindex={Z_INDEXS.MODAL}
                isOpen={props?.isOpen}
                onDismiss={toggleModalClose}
                maxWidth={500}
            >
                <Wrapper>
                    <Flex alignItems="center" justifyContent="space-between" marginBottom="30px">
                        <Text fontWeight="500" fontSize={20}>
                            <Trans>Renew Farm</Trans>
                        </Text>

                        <Flex sx={{ cursor: 'pointer' }} role="button" onClick={toggleModalClose}>
                            <X />
                        </Flex>
                    </Flex>

                    <AddressBox
                        style={{
                            marginBottom: '15px',
                            width: "-webkit-fill-available",
                            border: startDateError ? `1px solid ${theme.red}` : undefined,
                        }}
                    >
                        <Text fontSize={12} color={theme.subText} marginBottom="4px">
                            <Trans >Start Date</Trans> <Span>*</Span>
                        </Text>

                        <input
                            type="datetime-local"
                            id="start-date"
                            name="start-date"
                            min={minDateToday}
                            max={endDate}
                            style={dateInput}
                            onChange={(e) => { setStartDateFunction(e.target.value) }}
                            disabled={process}
                        />

                        {startDateError &&
                            <ErrorMessage>
                                <Trans>Please Pick Start Date.</Trans>
                            </ErrorMessage>
                        }
                    </AddressBox>

                    <AddressBox
                        style={{
                            marginBottom: '15px',
                            width: "-webkit-fill-available",
                            border: endDateError ? `1px solid ${theme.red}` : undefined,
                        }}
                    >
                        <Text fontSize={12} color={theme.subText} marginBottom="4px">
                            <Trans >End Date</Trans> <Span>*</Span>
                        </Text>

                        <input
                            type="datetime-local"
                            id="closing-in"
                            name="closing-in"
                            min={startDate ? startDate : minDateToday}
                            style={dateInput}
                            onChange={(e) => { setEndDateFunction(e.target.value) }}
                            disabled={process}
                        />

                        {endDateError &&
                            <ErrorMessage>
                                <Trans>Please Pick End Date.</Trans>
                            </ErrorMessage>
                        }
                    </AddressBox>

                    <AddressBox
                        style={{
                            marginBottom: '15px',
                            width: "-webkit-fill-available",
                            border: rewardAmountsError ? `1px solid ${theme.red}` : undefined,
                        }}
                    >
                        <Text fontSize={12} color={theme.subText} marginBottom="4px">
                            <Trans >Add Reward Amount</Trans> <Span>*</Span>
                        </Text>

                        <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                            <AddressInput
                                type="number"
                                style={address}
                                min={0}
                                onChange={(e: any) => { setRewardAmountFunction(e.target.value) }}
                                onKeyDown={onKeyDownNonDecimal}
                                disabled={process}
                            />
                        </Text>

                        {rewardAmountsError &&
                            <ErrorMessage>
                                <Trans>Please Add Reward Amount.</Trans>
                            </ErrorMessage>
                        }
                    </AddressBox>

                    <Flex alignItems="center" justifyContent="space-evenly">
                        <ButtonPrimary onClick={renewProcess} disabled={process} style={{ marginRight: '7px', backgroundColor: `${(process) ? '#292929' : 'rgb(39, 162, 126)'}` }} >
                            {(process)
                                ?
                                <Trans>Renewing&nbsp;<Loader /></Trans>
                                :
                                <Trans>Renew</Trans>
                            }
                        </ButtonPrimary>
                    </Flex>
                </Wrapper>
            </Modal>
        </>
    )
}
