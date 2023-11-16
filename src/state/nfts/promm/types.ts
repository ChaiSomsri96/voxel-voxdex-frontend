import { BigNumber } from 'ethers'

import { PositionDetails } from 'types/position'

export interface UserPositionFarm extends PositionDetails {
  stakedLiquidity: BigNumber
  rewardPendings: []
}

export interface ProMMFarm {
  pid:number
  nft: string
  token: string
  name: string
  logoURI: string
  rewardPerDay: number
  openedAt: number
  openedTill:number
  userDepositedNFTs:string []
}

export interface ProMMFarmResponse {
  pid:number
  nft: string
  token: string
  name: string
  logoURI: string
  rewardPerDay: number
  openedAt: number
  openedTill:number
  userDepositedNFTs: string []
}
