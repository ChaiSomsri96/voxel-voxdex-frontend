import { Flex, Text } from 'rebass'
import { Trans } from '@lingui/macro'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import Divider from 'components/Divider'
import { Info } from 'react-feather'
import { ButtonSecondary } from 'components/Button'
import Loader from 'components/Loader'
import { useState } from 'react'

const TableHeader = styled.div<{ fade?: boolean; oddRow?: boolean }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1.5fr 1fr 0.75fr 1fr 1.5fr 1fr 140px;
  grid-template-areas: 'pools liq apy vesting_duration reward staked_balance action';
  padding: 16px 24px;
  font-size: 12px;
  align-items: center;
  height: fit-content;
  position: relative;
  opacity: ${({ fade }) => (fade ? '0.6' : '1')};
  background-color: ${({ theme }) => theme.tableHeader};
  border-top-left-radius: 1.25rem;
  border-top-right-radius: 1.25rem;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04);

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-gap: 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-gap: 1.5rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-gap: 1.5rem;
  `};
`

const ProMMFarmTableHeader = styled(TableHeader)`
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: 'walletAddress authType action';
  grid-gap: 2rem;

  border-top-left-radius: 0;
  border-top-right-radius: 0;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
  `}
`
const FarmContent = styled.div`
  width: -webkit-fill-available;
  background: ${({ theme }) => theme.background};
  border-radius: 20px;
  overflow: hidden;
`

const TransactionRow = styled.div`
 width: -webkit-fill-available;
 display:flex;
 gap: 10px;
 align-items: baseline;
 ${({ theme }) => theme.mediaWidth.upToLarge`
    display:block;
    grid-gap: 0px;
 `};
`

const TransactionWrapper = styled.div<{ isShowTutorial?: boolean }>`
  width: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-bottom:10px;
     margin-right:0px;
  `}
`

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

interface TableProps {
    inProcess: (val: boolean) => void
}

export default function TableNFTStaking({ inProcess }: TableProps) {
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState("");

    const remove = async (walletAddress: any) => {
        if (isLoading?.length == 0) {
            inProcess(true)
            setIsLoading(walletAddress)

            await new Promise(f => setTimeout(f, 5000));

            inProcess(false)
            setIsLoading("")
        }
    }

    const authData = [
        {
            walletAddress: "0x9283fh9qhnc293nc92hq923c7ryqb28yr8",
            authType: "Admin",
        },
        {
            walletAddress: "0xdjshfabc8937yr83729yr32rb230b8r923",
            authType: "Admin",
        },
        {
            walletAddress: "0x1iu2n3iuqr983nq293nyrq2n3crnqo2nrq",
            authType: "Admin",
        },
    ]

    const renderAuthHistoryGroupHeaderOnDesktop = () => {
        return (
            <Flex
                sx={{
                    alignItems: 'center',
                    padding: '0 1rem',
                    justifyContent: 'space-between',
                    height: '72px',
                }}
            >
                <Text
                    sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '20px',
                        color: theme.subText,
                    }}
                >
                    <Trans>NFT Staking Auth</Trans>
                </Text>
            </Flex>
        )

    }

    const renderAuthTableRowOnDesktop = (data: any) => {

        return (
            <ProMMFarmTableHeader>

                <Flex grid-area="walletAddress" alignItems="center" justifyContent="flex-start">
                    <Trans>{data?.walletAddress}</Trans>
                </Flex>

                <Flex grid-area="authType" alignItems="center" justifyContent="flex-start">
                    <Trans>{data?.authType}</Trans>
                </Flex>

                <Flex grid-area="action" alignItems="center" justifyContent="flex-end" style={{ 'textTransform': 'capitalize' }}>

                    <ButtonSecondary disabled={(isLoading?.length > 0)} width="auto" onClick={() => remove(data?.walletAddress)}>
                        {(isLoading == data?.walletAddress)
                            ?
                            <Trans><Loader /></Trans>
                            :
                            <Trans>Remove</Trans>
                        }
                    </ButtonSecondary>

                </Flex>
            </ProMMFarmTableHeader>
        )
    }

    const renderAuthTableHeaderOnDesktop = () => {
        return (
            <ProMMFarmTableHeader>
                <Flex grid-area="walletAddress" alignItems="center" justifyContent="flex-start">
                    <Trans>Wallet Address</Trans>
                </Flex>

                <Flex grid-area="authType" alignItems="center" justifyContent="flex-start">
                    <Trans>Auth Type</Trans>
                </Flex>

                <Flex grid-area="action" alignItems="center" justifyContent="flex-end">
                    {/* <Trans>Action</Trans> */}
                </Flex>
            </ProMMFarmTableHeader>
        )
    }

    return (
        <>
            <TransactionRow>
                <TransactionWrapper>
                    <FarmContent>
                        <>
                            {renderAuthHistoryGroupHeaderOnDesktop()}
                            {renderAuthTableHeaderOnDesktop()}
                        </>

                        <Divider />
                        <div className="  ">

                            {(authData?.length < 1)
                                &&
                                <Flex flexDirection="column" alignItems="center"
                                    justifyContent="center" paddingTop="50px">
                                    <Info size={48} color={theme.subText} />
                                    <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                                        <Trans>
                                            No User Found.
                                        </Trans>
                                    </Text>
                                </Flex>
                            }

                            {authData?.map((swap: any, index: any) => {
                                return (
                                    renderAuthTableRowOnDesktop(swap)
                                )
                            })}
                        </div>
                    </FarmContent>
                </TransactionWrapper>
            </TransactionRow>
        </>
    )
}

