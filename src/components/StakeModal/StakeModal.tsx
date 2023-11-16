import { Trans } from '@lingui/macro'
import { X } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import { useState, useEffect } from 'react'

import { ButtonEmpty, ButtonPrimary } from 'components/Button'
import Modal from 'components/Modal'
import { formatBalance } from 'utils/formatBalance'
import Loader from 'components/Loader'

export const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
`

export const NetworkList = styled.div`
  display: grid;
  grid-gap: 1.25rem;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  margin-top: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr 1fr;
  `}
`

export const NetworkLabel = styled.span`
  color: ${({ theme }) => theme.text13};
`

export const ListItem = styled.div<{ selected?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 12px;
  border-radius: 999px;
  ${({ theme, selected }) =>
    selected
      ? `
        background-color: ${theme.primary};
        & ${NetworkLabel} {
          color: ${theme.background};
        }
      `
      : `
        background-color : ${theme.buttonBlack};
      `}
`

export const SelectNetworkButton = styled(ButtonEmpty)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  &:focus {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
    border: 1px solid ${({ theme }) => theme.primary};
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: not-allowed;
  }
`

export default function StakeModal(params: any): JSX.Element | null {

  const [tokens, setTokens] = useState(0)
  const [btnDisable, setBtnDisable] = useState(false);

  // On page load
  useEffect(() => {
    setTokens(params.minStakeRequired)
  }, [])

  // Stake function
  const stake = () => {
    params.stake(tokens)
  }

  // Set available max token
  const maxToken = () => {
    setTokens(params.availableTokens);
    setBtnDisable(false);
  }

  // Handle modal view
  const _closeModal = () => {
    params.closeModal();
    setTokens(params.minStakeRequired)
  }

  // Prevent special character
  const inputFilter = (val: any) => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (Number(val) == 0 || !val || Number(val) < Number(params.minStakeRequired)) {
      setBtnDisable(true);
    } else {
      setBtnDisable(false);
    }

    if (Number(val) >= 0 || !format.test(String(val))) {
      setTokens(val);
    }

    if (Number(val) > Number(params.availableTokens)) {
      setTokens(params.availableTokens);
    }
  }

  // Prevent dot, minus and e from input type number
  const onKeyDown = (event: any) => {
    if (
      event.keyCode === 190 || // (.)
      event.keyCode === 189 || // (-)
      event.keyCode === 69     // (e)
    ) {
      event.preventDefault()
    }
  }

  return (
    <Modal isOpen={params.showModal} onDismiss={_closeModal} maxWidth={400}>
      <Wrapper>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontWeight="500" fontSize={20}>
            <Trans>Stake Tokens</Trans>
          </Text>

          <Flex sx={{ cursor: 'pointer' }} role="button" onClick={_closeModal}>
            <X />
          </Flex>
        </Flex>

        <div className="Divider-sc-y1dis7-0 kvmcBA css-vurnku" style={{ width: "100%", marginTop: "24px" }}></div>

        <Flex flexDirection="column" justifyContent="space-between" marginTop="24px">

          <label>Minimum stake required : {formatBalance(params.minStakeRequired)}</label>

          <Flex justifyContent="space-between" alignItems="center">
            <div>
              <input
                style={{ width: "136%" }}
                value={tokens}
                onKeyDown={onKeyDown}
                type="number"
                min="0"
                step="1"
                onChange={(e) => inputFilter(e.target.value)}
                disabled={params.isStakeLoading}
              />
            </div>

            <ButtonPrimary
              fontSize="14px"
              padding="10px 24px"
              width="fit-content"
              onClick={maxToken}
              disabled={params.isStakeLoading}
            >
              <Trans>Max</Trans>
            </ButtonPrimary>
          </Flex>

          <label>Available Tokens : {formatBalance(params.availableTokens)}</label>

          <div className="Divider-sc-y1dis7-0 kvmcBA css-vurnku" style={{ width: "100%", marginTop: "24px" }}></div>

          <Flex justifyContent="center" marginTop="24px">
            <ButtonPrimary
              fontSize="14px"
              padding="10px 24px"
              width="fit-content"
              onClick={stake}
              disabled={btnDisable || params.isStakeLoading}
            >
              <Trans>{(params.isStakeLoading) ? <>Staking &nbsp; <Loader /></> : "Stake"}</Trans>
            </ButtonPrimary>
          </Flex>
        </Flex>

      </Wrapper>
    </Modal>
  )
}
