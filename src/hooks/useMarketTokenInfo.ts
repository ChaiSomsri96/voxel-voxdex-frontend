import { ChainId } from '@kyberswap/ks-sdk-core'
import useSWR from 'swr'

import { COINGECKO_API_URL } from 'constants/index'
import { NETWORKS_INFO } from 'constants/networks'

export interface TokenInfo {
  price: number
  marketCap: number
  marketCapRank: number
  circulatingSupply: number
  totalSupply: number
  allTimeHigh: number
  allTimeLow: number
  tradingVolume: number
  description: { en: string }
  name: string,
  logo: string
}

export default function useMarketTokenInfo(tokenAddress: string | undefined): { data: TokenInfo; loading: boolean; error: any } {
  
  const fetcher = (url: string) => (url ? fetch(url).then(r => r.json()) : Promise.reject({ data: {}, error: '' }))


  const url =`${COINGECKO_API_URL}/coins/${NETWORKS_INFO[ChainId.MAINNET].coingeckoNetworkId
      }/contract/${tokenAddress}`

  const { data, error } = useSWR(url, fetcher, {
    refreshInterval: 60000,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return

      // Only retry up to 10 times.
      if (retryCount >= 10) return

      if (error.status === 403) {
        // If API return 403, retry after 30 seconds.
        setTimeout(() => revalidate({ retryCount }), 30000)
        return
      }

      // Retry after 20 seconds.
      setTimeout(() => revalidate({ retryCount }), 20000)
    },
  })

  if (error && process.env.NODE_ENV === 'development') {
    console.error(error)
  }

  const loading = !data

  const result = {
    price: data?.market_data?.current_price?.usd || 0,
    marketCap: data?.market_data?.market_cap?.usd || 0,
    marketCapRank: data?.market_data?.market_cap_rank || 0,
    circulatingSupply: data?.market_data?.circulating_supply || 0,
    totalSupply: data?.market_data?.total_supply || 0,
    allTimeHigh: data?.market_data?.ath?.usd || 0,
    allTimeLow: data?.market_data?.atl?.usd || 0,
    tradingVolume: data?.market_data?.total_volume?.usd || 0,
    description: data?.description || { en: '' },
    name: data?.name || '',
    logo: NETWORKS_INFO[ChainId.MAINNET]?.marketToken?.logo || ''
  }

  return { data: result, loading, error }
}

