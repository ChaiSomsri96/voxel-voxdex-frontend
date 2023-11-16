import { ChainId } from '@kyberswap/ks-sdk-core'
import { t } from '@lingui/macro'
import { useState } from 'react'
import styled from 'styled-components'

import { ReactComponent as DropdownSvg } from 'assets/svg/down.svg'
import { NetworkLogo } from 'components/Logo'
import NetworkModal from 'components/NetworkModal'
import { useActiveWeb3React } from 'hooks'

import { NETWORKS_INFO } from '../../constants/networks'

const NetworkSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 24px;
  height: fit-content;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text};
  padding: 0px;
  &:hover {
    cursor: pointer;
  }
`

const NetworkLabel = styled.div`
  white-space: nowrap;
  font-weight: 500;
  margin-right: 8px;
  font-size: 14px;
`

const DropdownIcon = styled(DropdownSvg)<{ open: boolean }>`
  color: ${({ theme }) => theme.text};
  transform: rotate(${({ open }) => (open ? '180deg' : '0')});
  transition: transform 300ms;
`
function Web3Network({
  chainIds = [],
  onSelectNetwork,
  selectedChainId,
}: {
  chainIds: ChainId[]
  onSelectNetwork: (chain: ChainId) => void
  selectedChainId?: ChainId
}): JSX.Element | null {
  const { chainId } = useActiveWeb3React()

  const [isOpen, setIsOpen] = useState(false)
  const toggleNetworkModal = () => {
    setIsOpen(!isOpen)
  }

  if (!chainId) return null
  const { name } = selectedChainId ? NETWORKS_INFO[selectedChainId] : { name: t`Select a network` }
  return (
    <>
      <NetworkSwitchContainer onClick={() => chainIds.length && toggleNetworkModal()}>
        <NetworkLogo chainId={selectedChainId} style={{ width: 20, height: 20, marginRight: '8px' }} />
        <NetworkLabel>{name}</NetworkLabel>
        <DropdownIcon open={isOpen} />
      </NetworkSwitchContainer>
      <NetworkModal
        disabledMsg={t`The token cannot be bridged to this chain`}
        activeChainIds={chainIds}
        isOpen={isOpen}
        selectedId={selectedChainId}
        customToggleModal={toggleNetworkModal}
        customOnSelectNetwork={onSelectNetwork}
      />
    </>
  )
}

export default Web3Network
