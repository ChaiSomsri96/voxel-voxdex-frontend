import { useEffect, useState } from 'react'
import { Aligner, CurrencySelect, StyledTokenName } from 'components/CurrencyInputPanel'
import { RowFixed } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { Trans } from '@lingui/macro'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { ChainId, Currency, WETH } from '@kyberswap/ks-sdk-core'
import { ReactComponent as DropdownSVG } from 'assets/svg/down.svg'

const CurrencySelector = (props: any) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [currencyIn, setCurrency] = useState<Currency>()

    const onCurrencySelect = (token: any) => {
        try {
            setCurrency(token);

            const wethWrapped = WETH[token?.chainId as ChainId];
            const currency: any = (token?.isNative) ? wethWrapped : token

            props?.selectedCurrency(currency?.address);
        }
        catch (e) {
            console.log(e);
        }
    }

    //For Clearing The Form.
    useEffect(() => {
        const reset = (token: any) => {
            setCurrency(token)
            props?.selectedCurrency("")
        }
        reset(null)
    }, [props?.clear])

    return (
        <>
            <div style={{ width: '100%' }}>

                <CurrencySelect
                    style={{ width: "-webkit-fill-available" }}
                    hideInput={false}
                    selected={!!currencyIn}
                    className="open-currency-select-button"
                    onClick={() => {
                        if (!props?.disabled) {
                            setModalOpen(true)
                        }
                    }}
                >
                    <Aligner>
                        <RowFixed>

                            {currencyIn ? <CurrencyLogo currency={currencyIn} size={'20px'} /> : null}

                            <StyledTokenName
                                className="token-symbol-container"
                                active={Boolean(currencyIn && currencyIn.symbol)}
                                fontSize={'14px'}
                            >
                                {(currencyIn?.symbol)
                                    ? currencyIn?.symbol
                                    : <Trans>Select a token</Trans>
                                }

                            </StyledTokenName>
                        </RowFixed>

                        <DropdownSVG />
                    </Aligner>
                </CurrencySelect>

                <CurrencySearchModal
                    isOpen={modalOpen}
                    onDismiss={function (): void { setModalOpen(false) }}
                    onCurrencySelect={function (currency: Currency): void { onCurrencySelect(currency) }}
                />
            </div>
        </>
    )
}

export default CurrencySelector;