import { ChainId } from '@kyberswap/ks-sdk-core'

import EthereumLogo from 'assets/images/ethereum-logo.png'
import Mainnet from 'assets/networks/mainnet-network.svg'
import { KS_SETTING_API } from 'constants/env'
import { createClient } from 'utils/client'

import { NetworkInfo } from '../type'

const EMPTY = ''
const EMPTY_ARRAY: any[] = []
const NOT_SUPPORT = null

const kovanInfo: NetworkInfo = {
  chainId: ChainId.KOVAN,
  route: 'kovan',
  name: 'Kovan',
  icon: Mainnet,
  classicClient: createClient('https://api.thegraph.com/subgraphs/name/nguyenhuudungz/dmm-exchange-ropsten'), //todo: not exits yet
  elasticClient: createClient('https://api.thegraph.com/subgraphs/name/viet-nv/promm-rinkeby'), //todo: not exits yet
  blockClient: createClient('https://api.thegraph.com/subgraphs/name/edwardevans094/ropsten-blocks'), //todo: not exits yet
  etherscanUrl: 'https://kovan.etherscan.io',
  etherscanName: 'Kovan Explorer',
  tokenListUrl: `${KS_SETTING_API}/v1/tokens?chainIds=${ChainId.ROPSTEN}&isWhitelisted=${true}`,
  bridgeURL: EMPTY,
  nativeToken: {
    symbol: 'ETH',
    name: 'ETH (Wrapped)',
    address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    logo: EthereumLogo,
    decimal: 18,
  },
  marketToken: {
    symbol: 'VXL',
    name: 'Voxel X Network',
    address: '0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31',
    logo: "",
    decimal: 18,
  },
  rpcUrl: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  routerUri: EMPTY,
  nftStaker: EMPTY_ARRAY,
  classic: {
    static: {
      zap: EMPTY,
      router: EMPTY,
      factory: EMPTY,
    },
    oldStatic: NOT_SUPPORT,
    dynamic: NOT_SUPPORT,
    claimReward: EMPTY,
    fairlaunch: EMPTY_ARRAY,
    fairlaunchV2: EMPTY_ARRAY,
  },
  elastic: {
    coreFactory: '0x5F1dddbf348aC2fbe22a163e30F99F9ECE3DD50a',
    nonfungiblePositionManager: '0x2B1c7b41f6A8F2b2bc45C3233a5d5FB3cD6dC9A8',
    tickReader: '0xe3AC3fd66EB31cAf4EE0831b262D837c479FFCe5',
    initCodeHash: '0xc597aba1bb02db42ba24a8878837965718c032f8b46be94a6e46452a9f89ca01',
    quoter: '0x0D125c15D54cA1F8a813C74A81aEe34ebB508C1f',
    routers: '0xC1e7dFE73E1598E3910EF4C7845B68A9Ab6F4c83',
  },
  staking: {
    nftFactory: '0x1a91f5ADc7cB5763d35A26e98A18520CB9b67e70',
    tokenFactory: '0x7EDF6fC10D13996C36422ca915310E0B3876b993'
  },
  ROLES: {
    NFTStaking: {
      operator: "",
      admin: ""
    },
    TokenStaking: {
      operator: "",
      admin: ""
    }
  },
  averageBlockTimeInSeconds: 13.13,
  coingeckoNetworkId: EMPTY,
  coingeckoNativeTokenId: EMPTY,
  deBankSlug: EMPTY,
}

export default kovanInfo
