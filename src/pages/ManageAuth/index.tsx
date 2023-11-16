import { Flex, Text } from 'rebass'
import { Trans } from '@lingui/macro'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { useState } from 'react'
import { Tab, TabRow } from './Tab'
import { InstructionText } from 'pages/Pool'
import { AutoColumn } from 'components/Column'
import TableFarming from './TableFarming'
import TableTokenStaking from './TableTokenStaking'
import TableNFTStaking from './TableNFTStaking'
import { ButtonPrimary } from 'components/Button'
import ModalAddAuth from './ModalAddAuth'

const PageWrapper = styled.div`
  padding: 32px 24px 50px;
  width: 100%;
  max-width: 1500px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 24px 16px 100px;
  `}

  display: flex;
  flex-direction: column;
  gap: 20px;
`

export default function ManageAuth() {
    const theme = useTheme()
    const [currentTab, setCurrentTab] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false)

    const toggleAddAuthModalOpen = () => {
        setIsOpen(true)
    }

    const tabSelect = (val: any) => {
        if (!isLoading) {
            setCurrentTab(val);
        }
    }

    const tabs = [
        {
            id: 1,
            name: "Farming"
        },
        {
            id: 2,
            name: "Token Staking"
        },
        {
            id: 3,
            name: "NFT Staking"
        }
    ]

    return (
        <>
            <PageWrapper>

                <Flex justifyContent="space-between" flex={1} alignItems="center" width="100%">
                    <Text
                        fontWeight={500}
                        fontSize={[18, 20, 24]}
                        color={theme.primary}
                        width={'auto'}
                        marginRight={'5px'}
                        role="button"
                        style={{
                            cursor: "default",
                        }}
                    >
                        <Trans>Manage Auth</Trans>
                    </Text>

                    <ButtonPrimary width={"none"} onClick={toggleAddAuthModalOpen}>
                        <Trans>Add Auth</Trans>
                    </ButtonPrimary>
                </Flex>

                <AutoColumn gap="lg" style={{ width: '100%' }}>
                    <InstructionText>
                        <Trans>Here you can manage user&apos;s authentication.</Trans>
                    </InstructionText>
                </AutoColumn>

                <TabRow>
                    <Flex justifyContent="space-between" flex={1} alignItems="center" width="100%">
                        <Flex sx={{ gap: '1rem' }} alignItems="center">

                            {tabs?.map((obj: any, index: any) => (
                                <Tab
                                    key={index}
                                    active={(obj?.id == currentTab)}
                                    role="button"
                                    onClick={() => { tabSelect(obj?.id) }}
                                >
                                    <Trans>{obj?.name}</Trans>
                                </Tab>
                            ))}

                        </Flex>
                    </Flex>
                </TabRow>

                {currentTab == 1 && <TableFarming inProcess={(val) => setIsLoading(val)} />}
                {currentTab == 2 && <TableTokenStaking inProcess={(val) => setIsLoading(val)} />}
                {currentTab == 3 && <TableNFTStaking inProcess={(val) => setIsLoading(val)} />}

            </PageWrapper>
            <ModalAddAuth isOpen={isOpen} toggleModal={(val) => setIsOpen(val)} />
        </>
    )
}

