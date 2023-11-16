import { Trans } from '@lingui/macro'
import { X } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import Modal from 'components/Modal'
import { Z_INDEXS } from 'constants/styles'

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
`

interface ModalProps {
    toggleModal: (val: boolean) => void
    isOpen: boolean,
}

export default function ModalAddAuth({ isOpen, toggleModal }: ModalProps) {

    const toggleAuthModalClose = () => {
        toggleModal(false)
    }

    return (
        <Modal
            zindex={Z_INDEXS.MODAL}
            isOpen={isOpen}
            onDismiss={toggleAuthModalClose}
            maxWidth={624}
        >
            <Wrapper>
                <Flex alignItems="center" justifyContent="space-between">
                    <Text fontWeight="500" fontSize={20}>
                        <Trans>Add Auth</Trans>
                    </Text>

                    <Flex sx={{ cursor: 'pointer' }} role="button" onClick={toggleAuthModalClose}>
                        <X />
                    </Flex>
                </Flex>

                Form
            </Wrapper>
        </Modal>
    )
}
