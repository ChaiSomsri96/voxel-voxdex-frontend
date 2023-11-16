import { ChainId } from '@kyberswap/ks-sdk-core'
import { captureException } from '@sentry/react'
import axios from 'axios'
import { useCallback, useMemo } from 'react'
import { mutate } from 'swr'

import { KS_SETTING_API } from 'constants/env'
import { NETWORKS_INFO } from 'constants/networks'
import { useActiveWeb3React } from 'hooks'
import { useBridgeContract, useSwapBTCContract, useSwapETHContract } from 'hooks/useContract'
import { useBridgeOutputValue, useBridgeState } from 'state/bridge/hooks'
import { useAppSelector } from 'state/hooks'
import { tryParseAmount } from 'state/swap/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCurrencyBalance, useETHBalances } from 'state/wallet/hooks'
import { isAddress } from 'utils'

const NOT_APPLICABLE = {
  execute: async () => {
    //
  },
  inputError: false,
}

function useSendTxToKsSettingCallback() {
  const { account } = useActiveWeb3React()
  const historyURL = useAppSelector(state => state.bridge.historyURL)

  const onSuccess = useCallback(() => {
    mutate(historyURL)
  }, [historyURL])

  return useCallback(
    async (
      srcChainId: ChainId,
      dstChainId: ChainId,
      srcTxHash: string,
      srcTokenSymbol: string,
      dstTokenSymbol: string,
      srcAmount: string,
      dstAmount: string,
    ) => {
      const url = `${KS_SETTING_API}/v1/multichain-transfers`
      const data = {
        userAddress: account,
        srcChainId: srcChainId.toString(),
        dstChainId: dstChainId.toString(),
        srcTxHash,
        dstTxHash: '',
        srcTokenSymbol,
        dstTokenSymbol,
        srcAmount,
        dstAmount,
        status: 0,
      }
      try {
        await axios.post(url, data)
        onSuccess()
      } catch (err) {
        console.error(err)
        const errStr = `SendTxToKsSetting fail with payload = ${JSON.stringify(data)}`
        const error = new Error(errStr)
        error.name = 'PostBridge'
        captureException(error, { level: 'fatal' })
      }
    },
    [account, onSuccess],
  )
}

export default function useBridgeCallback(
  inputAmount: string | undefined,
  inputToken: string | undefined,
  routerToken: string | undefined,
  isNative: boolean,
  toAddress: string | undefined | null,
) {
  const { execute: onRouterSwap, inputError: wrapInputErrorBridge } = useRouterSwap(
    routerToken,
    inputToken,
    inputAmount,
    isNative,
  )
  const { execute: onBridgeSwap, inputError: wrapInputErrorCrossBridge } = useBridgeSwap(
    toAddress,
    inputToken,
    inputAmount,
  )
  return useMemo(() => {
    return {
      execute: async (useSwapMethods: string) => {
        const isBridge =
          useSwapMethods.includes('transfer') ||
          useSwapMethods.includes('sendTransaction') ||
          useSwapMethods.includes('Swapout')
        return isBridge ? onBridgeSwap() : onRouterSwap(useSwapMethods)
      },
      inputError: wrapInputErrorBridge || wrapInputErrorCrossBridge,
    }
  }, [onBridgeSwap, onRouterSwap, wrapInputErrorBridge, wrapInputErrorCrossBridge])
}

function useRouterSwap(
  routerToken: string | undefined,
  inputToken: string | undefined,
  typedValue: string | undefined,
  isNative: boolean,
) {
  const [{ tokenInfoIn, chainIdOut, currencyIn, currencyOut }] = useBridgeState()
  const outputInfo = useBridgeOutputValue(typedValue ?? '0')
  const { account, chainId } = useActiveWeb3React()
  const bridgeContract = useBridgeContract(isAddress(routerToken), chainIdOut && isNaN(chainIdOut) ? 'V2' : '')

  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const anyBalance = useCurrencyBalance(account ?? undefined, currencyIn)
  const balance = isNative ? ethBalance : anyBalance

  const inputAmount = useMemo(() => tryParseAmount(typedValue, currencyIn ?? undefined), [currencyIn, typedValue])
  const addTransactionWithType = useTransactionAdder()
  const sendTxToKsSetting = useSendTxToKsSettingCallback()

  return useMemo(() => {
    if (!bridgeContract || !chainId || !tokenInfoIn || !account || !chainIdOut) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    return {
      execute: async (useSwapMethods: string) => {
        let txHash = ''
        try {
          if (!sufficientBalance || !inputAmount) return Promise.reject('insufficient Balance')
          let promise
          const params = [inputToken, account, `0x${inputAmount.quotient.toString(16)}`, currencyOut?.chainId]
          if (useSwapMethods.includes('anySwapOutNative')) {
            promise = bridgeContract.anySwapOutNative(inputToken, account, currencyOut?.chainId, {
              value: `0x${inputAmount.quotient.toString(16)}`,
            })
          } else if (useSwapMethods.includes('anySwapOutUnderlying')) {
            promise = bridgeContract.anySwapOutUnderlying(...params)
          } else if (useSwapMethods.includes('anySwapOut')) {
            promise = bridgeContract.anySwapOut(...params)
          }

          let txReceipt
          if (promise) {
            txReceipt = await promise
          } else {
            return Promise.reject('router wrong method')
          }

          txHash = txReceipt?.hash
          if (txHash) {
            const from_network = NETWORKS_INFO[chainId].name
            const to_network = NETWORKS_INFO[chainIdOut].name
            const inputAmountStr = inputAmount.toSignificant(6)
            const outputAmountStr = tryParseAmount(
              outputInfo.outputAmount.toString(),
              currencyOut ?? undefined,
            )?.toSignificant(6)
            const from_token = currencyIn?.symbol ?? ''
            const to_token = currencyOut?.symbol ?? ''
            addTransactionWithType(txReceipt, {
              type: 'Bridge',
              summary: `${inputAmountStr} ${from_token} (${from_network}) to ${outputAmountStr} ${to_token} (${to_network})`,
              arbitrary: {
                from_token,
                to_token,
                bridge_fee: outputInfo.fee,
                from_network,
                to_network,
                trade_qty: typedValue,
              },
            })
            sendTxToKsSetting(chainId, chainIdOut, txHash, from_token, to_token, inputAmountStr, outputAmountStr ?? '')
          }
          return txHash ?? ''
        } catch (error) {
          console.error('Could not swap', error)
          return Promise.reject(error || 'router unknown error')
        }
      },
      inputError: !sufficientBalance,
    }
  }, [
    bridgeContract,
    chainId,
    tokenInfoIn,
    account,
    chainIdOut,
    currencyIn?.symbol,
    inputAmount,
    balance,
    inputToken,
    outputInfo.outputAmount,
    outputInfo.fee,
    currencyOut,
    sendTxToKsSetting,
    addTransactionWithType,
    typedValue,
  ])
}

function useBridgeSwap(
  toAddress: string | undefined | null,
  inputToken: string | undefined,
  typedValue: string | undefined,
) {
  const [{ tokenInfoOut, chainIdOut, tokenInfoIn, currencyIn, currencyOut }] = useBridgeState()
  const addTransactionWithType = useTransactionAdder()
  const outputInfo = useBridgeOutputValue(typedValue ?? '0')
  const { chainId, account, library } = useActiveWeb3React()

  const tokenBalance = useCurrencyBalance(account ?? undefined, currencyIn)
  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const balance = tokenInfoIn && tokenInfoIn?.tokenType !== 'NATIVE' ? tokenBalance : ethBalance

  const inputAmount = useMemo(() => tryParseAmount(typedValue, currencyIn), [currencyIn, typedValue])
  const contractBTC = useSwapBTCContract(isAddress(inputToken) ? inputToken : undefined)
  const contractETH = useSwapETHContract(isAddress(inputToken) ? inputToken : undefined)
  const sendTxToKsSetting = useSendTxToKsSettingCallback()

  return useMemo(() => {
    if (!chainId || !toAddress || !chainIdOut || !library || !account) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    return {
      execute: async () => {
        try {
          if (!sufficientBalance || !inputAmount) return Promise.reject('insufficient balance')
          let txReceipt
          if (tokenInfoOut?.type === 'swapin') {
            if (isAddress(inputToken) && tokenInfoIn?.tokenType !== 'NATIVE') {
              if (contractETH) {
                txReceipt = await contractETH.transfer(toAddress, `0x${inputAmount.quotient.toString(16)}`)
              } else {
                return Promise.reject('not found contractETH')
              }
            } else {
              const data = {
                from: account,
                to: toAddress,
                value: `0x${inputAmount.quotient.toString(16)}`,
              }
              const hash = await library.send('eth_sendTransaction', [data])
              txReceipt = hash && hash.toString().indexOf('0x') === 0 ? { hash } : ''
            }
          } else {
            if (chainIdOut && isNaN(chainIdOut)) {
              if (contractBTC) {
                txReceipt = await contractBTC.Swapout(`0x${inputAmount.quotient.toString(16)}`, toAddress)
              } else {
                return Promise.reject('not found contractBTC')
              }
            } else {
              if (contractETH) {
                txReceipt = await contractETH.Swapout(`0x${inputAmount.quotient.toString(16)}`, toAddress)
              } else {
                Promise.reject('not found contractETH')
              }
            }
          }
          const txHash = txReceipt?.hash
          if (txHash) {
            const from_network = NETWORKS_INFO[chainId].name
            const to_network = NETWORKS_INFO[chainIdOut].name
            const inputAmountStr = inputAmount.toSignificant(6)
            const outputAmountStr = tryParseAmount(
              outputInfo.outputAmount.toString(),
              currencyOut ?? undefined,
            )?.toSignificant(6)
            const from_token = currencyIn?.symbol ?? ''
            const to_token = currencyOut?.symbol ?? ''
            addTransactionWithType(txReceipt, {
              type: 'Bridge',
              summary: `${inputAmountStr} ${from_token} (${from_network}) to ${outputAmountStr} ${to_token} (${to_network})`,
              arbitrary: {
                from_token,
                to_token,
                bridge_fee: outputInfo.fee,
                from_network,
                to_network,
                trade_qty: typedValue,
              },
            })
            sendTxToKsSetting(chainId, chainIdOut, txHash, from_token, to_token, inputAmountStr, outputAmountStr ?? '')
          }
          return txHash ?? ''
        } catch (error) {
          console.log('Could not swapout', error)
          return Promise.reject(error || 'bridge unknown error')
        }
      },
      inputError: !sufficientBalance,
    }
  }, [
    chainId,
    toAddress,
    chainIdOut,
    library,
    account,
    inputAmount,
    balance,
    tokenInfoOut?.type,
    inputToken,
    tokenInfoIn?.tokenType,
    currencyIn?.symbol,
    contractETH,
    contractBTC,
    outputInfo.outputAmount,
    outputInfo.fee,
    currencyOut,
    sendTxToKsSetting,
    addTransactionWithType,
    typedValue,
  ])
}
