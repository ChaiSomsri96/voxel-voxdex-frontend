import { useState, useEffect } from "react"
import { Trans } from '@lingui/macro'
import { X } from 'react-feather'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import Modal from 'components/Modal'
import { Z_INDEXS } from 'constants/styles'
import { ButtonPrimary } from 'components/Button'
import useTheme from 'hooks/useTheme'
import Loader from "components/Loader"
import { USER_ALREADY_HAVE_ROLE, USER_DONT_HAVE_ROLE } from "constants/messages"
import { useTokenStakingAction } from "state/nfts/promm/hooks"

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

export default function ManageAuth() {
    const walletAddressRegex = /0x[a-fA-F0-9]{40}/g;
    const theme = useTheme();
    const { manageRole, checkRole } = useTokenStakingAction();

    const [isOpen, setIsOpen] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [process, setProcess] = useState("");
    const [addressError, setAddressError] = useState("");
    const [authType, setAuthType] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [accountMsg, setAccountMsg] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const callData = async () => {
            const adminRole = await checkRole({ role: "0x0000000000000000000000000000000000000000000000000000000000000000" })
            setIsAdmin(adminRole)
        }

        callData()

    }, [])

    const addAuth = async () => {
        try {

            setAccountMsg("");
            if (authType.length > 0) { setAuthError(false); }
            else { setAuthError(true); }
            if (walletAddress.length > 0) { setAddressError(""); }
            else { setAddressError("Please Enter Wallet Address."); }

            if (
                !authError &&
                (authType.length > 0) &&
                (walletAddress.length > 0) &&
                (addressError.length == 0) &&
                (process.length == 0)
            ) {

                setProcess("add");

                const reqData = {
                    type: "add",
                    role: authType,
                    account: walletAddress,
                }

                await manageRole(reqData)
                    .then(res => {
                        toggleModalClose();
                        setProcess("");
                    })
            }
        }
        catch (e) {
            console.log(e);
            setProcess("");

            if (String(e).includes(USER_ALREADY_HAVE_ROLE)) {
                setAccountMsg(USER_ALREADY_HAVE_ROLE);
            }
        }
    }

    const removeAuth = async () => {
        try {

            setAccountMsg("");
            if (authType.length > 0) { setAuthError(false); }
            else { setAuthError(true); }
            if (walletAddress.length > 0) { setAddressError(""); }
            else { setAddressError("Please Enter Wallet Address."); }

            if (
                !authError &&
                (authType.length > 0) &&
                (walletAddress.length > 0) &&
                (addressError.length == 0) &&
                (process.length == 0)
            ) {

                setProcess("remove");

                const reqData = {
                    type: "remove",
                    role: authType,
                    account: walletAddress,
                }

                await manageRole(reqData)
                    .then(res => {
                        toggleModalClose();
                        setProcess("");
                    })
            }
        }
        catch (e) {
            console.log(e);
            setProcess("");

            if (String(e).includes(USER_DONT_HAVE_ROLE)) {
                setAccountMsg(USER_DONT_HAVE_ROLE);
            }
        }
    }

    const selectedAuth = (val: any) => {
        const str = String(val).trim();

        setAuthType(str);
        setAccountMsg("");

        if (str.length > 0) {
            setAuthError(false);
        } else {
            setAuthError(true);
        }
    }

    const walletAddressInput = (val: any) => {
        const str = String(val).trim();

        setWalletAddress(str);
        setAccountMsg("");

        const validAddress = str.match(walletAddressRegex);

        if (str.length > 0) {
            setAddressError("");

            if (!validAddress) {
                setAddressError("Invalide Wallet Address.");
            } else {
                setAddressError("");
            }
        } else {
            setAddressError("Please Enter Wallet Address.");
        }

    }

    const toggleModalOpen = () => {
        setIsOpen(true);
    }

    const toggleModalClose = () => {
        setIsOpen(false);
        setAuthError(false);
        setProcess("");
        setAddressError("");
        setAuthType("");
        setWalletAddress("");
        setAccountMsg("");
    }

    return (
        <>
            {isAdmin
                &&
                <ButtonPrimary width={"none"} onClick={toggleModalOpen} height={"38px"}>
                    <Trans>Manage Authorization</Trans>
                </ButtonPrimary>
            }

            <Modal
                zindex={Z_INDEXS.MODAL}
                isOpen={isOpen}
                onDismiss={toggleModalClose}
                maxWidth={500}
            >
                <Wrapper>
                    <Flex alignItems="center" justifyContent="space-between" marginBottom="30px">
                        <Text fontWeight="500" fontSize={20}>
                            <Trans>Manage Authorization</Trans>
                        </Text>

                        <Flex sx={{ cursor: 'pointer' }} role="button" onClick={toggleModalClose}>
                            <X />
                        </Flex>
                    </Flex>

                    <AddressBox
                        style={{
                            marginBottom: '15px',
                            width: "-webkit-fill-available",
                            border: authError ? `1px solid ${theme.red}` : undefined,
                        }}
                    >
                        <Text fontSize={12} color={theme.subText} marginBottom="2px">
                            <Trans >Authorization Type</Trans> <Span>*</Span>
                        </Text>

                        <select disabled={(process.length > 0)} style={selectBox} value={authType} onChange={(e) => { selectedAuth(e.target.value) }}>
                            <option value="" >---Select---</option>
                            <option value="0x0000000000000000000000000000000000000000000000000000000000000000" >Admin</option>
                            <option value="0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c" >Operator</option>
                        </select>

                        {authError &&
                            <ErrorMessage>
                                <Trans>Please Select Authorization Type.</Trans>
                            </ErrorMessage>
                        }
                    </AddressBox>

                    <AddressBox
                        style={{
                            marginBottom: '15px',
                            border: (addressError?.length > 0 || accountMsg?.length > 0) ? `1px solid ${accountMsg?.length > 0 ? theme.yellow1 : theme.red}` : undefined,
                        }}
                    >
                        <Text fontSize={12} color={theme.subText} marginBottom="2px">
                            <Trans >Wallet Address</Trans> <Span>*</Span>
                        </Text>
                        <Text fontSize={20} lineHeight={'24px'} color={theme.text}>
                            <AddressInput
                                disabled={(process.length > 0)}
                                value={walletAddress}
                                type="text"
                                style={address}
                                min={0}
                                onChange={(e: any) => {
                                    walletAddressInput(e.target.value)
                                }}
                            />
                        </Text>
                        {(addressError?.length > 0) &&
                            <ErrorMessage>
                                <Trans>{addressError}</Trans>
                            </ErrorMessage>
                        }
                        {(accountMsg.length > 0) &&
                            <WarningMessage>
                                <Trans>{accountMsg}</Trans>
                            </WarningMessage>
                        }
                    </AddressBox>

                    <Flex alignItems="center" justifyContent="space-evenly">
                        <ButtonPrimary onClick={addAuth} disabled={(process.length > 0)} style={{ marginRight: '7px', backgroundColor: `${(process.length > 0) ? '#292929' : 'rgb(39, 162, 126)'}` }} >
                            {(process == "add")
                                ?
                                <Trans>Adding&nbsp;<Loader /></Trans>
                                :
                                <Trans>Add</Trans>
                            }
                        </ButtonPrimary>

                        <ButtonPrimary onClick={removeAuth} disabled={(process.length > 0)} style={{ marginLeft: '7px' }} >
                            {(process == "remove")
                                ?
                                <Trans>Removing&nbsp;<Loader /></Trans>
                                :
                                <Trans>Remove</Trans>
                            }
                        </ButtonPrimary>
                    </Flex>
                </Wrapper>
            </Modal>
        </>
    )
}
