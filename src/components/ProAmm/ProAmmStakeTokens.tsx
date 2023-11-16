import React from 'react'
import useTheme from 'hooks/useTheme'
import { unwrappedToken } from 'utils/wrappedCurrency'

export default function ProAmmStakeTokens({
  poolInfo,
  stakedToken,
  rewardToken
}: {
  poolInfo?: any
  stakedToken?: any
  rewardToken?: any
}) {
  const theme = useTheme()
  const currency0 = unwrappedToken(stakedToken)
  const currency1 = unwrappedToken(rewardToken)



  const render =
    (
      <>

      </>
    )
  return render
}
