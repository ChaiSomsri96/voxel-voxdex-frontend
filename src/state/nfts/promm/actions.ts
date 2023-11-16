import { createAction } from '@reduxjs/toolkit'

import { ProMMFarm } from './types'

export const updatePrommNfts = createAction<{ [address: string]: ProMMFarm[] }>('prommNfts/updatePrommNfts')
export const setLoading = createAction<boolean>('prommNfts/setLoading')
export const setShowConfirm = createAction<boolean>('prommVesting/setShowConfirm')
export const setAttemptingTxn = createAction<boolean>('prommVesting/setAttemptingTxn')
export const setVestingTxHash = createAction<string>('prommVesting/setVestingTxHash')
export const setError = createAction<string>('prommVesting/setError')
export const addFailedNFTs = createAction<string[]>('elasticFarm/addFailedNFTs')
export const resetErrorNFTs = createAction<undefined>('elasticFarm/resetErrorNFTs')
