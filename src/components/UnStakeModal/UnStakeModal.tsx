import { Trans } from '@lingui/macro'
import { Info, X } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import { ButtonEmpty, ButtonPrimary } from 'components/Button'
import Modal from 'components/Modal'
import moment from 'moment';
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

export default function UnStakeModal(params: any): JSX.Element | null {

  const lockPeriodUntil = moment(new Date(((params.lockPeriodUntil).toNumber()) * 1000)).format('DD MMM YYYY, hh:mm A');

  // Stake function
  const unStake = () => {
    params.unStake()
  }

  // Handle modal view
  const _closeModal = () => {
    params.closeModal();
  }

  return (
    <Modal isOpen={params.showModal} onDismiss={_closeModal} maxWidth={450}>
      <Wrapper>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontWeight="500" fontSize={20}>
            <Trans>Unstake Tokens</Trans>
          </Text>

          <Flex sx={{ cursor: 'pointer' }} role="button" onClick={_closeModal}>
            <X />
          </Flex>
        </Flex>

        <div className="Divider-sc-y1dis7-0 kvmcBA css-vurnku" style={{ width: "100%", marginTop: "24px" }}></div>

        <Flex
          alignItems="center"
          justifyContent="center"
          padding="16px"
          marginTop="40px"
          flexDirection="column"
        >
          <Info size="48px" />
          <Text fontSize={14} textAlign="center" marginTop="16px" maxWidth="480px" lineHeight={1.5}>
            <Trans>
              <label>Tokens are locked until {lockPeriodUntil}</label>
              <br />
              {(params.unstakeFee > 0) ?
                <label style={{ fontSize: "12px", marginTop: "24px" }}>Emergency unstake fee {params.unstakeFee}%</label>
                : ""
              }
            </Trans>
          </Text>
        </Flex>

        <div className="Divider-sc-y1dis7-0 kvmcBA css-vurnku" style={{ width: "100%", marginTop: "24px" }}></div>

        <Flex justifyContent="center" marginTop="24px">
          <ButtonPrimary
            fontSize="14px"
            padding="10px 24px"
            width="fit-content"
            onClick={unStake}
            disabled={params.isUnStakeLoading}
          >
            <Trans>{(params.isUnStakeLoading) ? <>Unstaking &nbsp; <Loader /></> : "Emergency Unstake"}</Trans>
          </ButtonPrimary>
        </Flex>
      </Wrapper>
    </Modal>
  )
}
