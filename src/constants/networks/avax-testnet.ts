import { ChainId } from '@kyberswap/ks-sdk-core'

import AVAX from 'assets/networks/avax-network.png'
import { KS_SETTING_API } from 'constants/env'
import { createClient } from 'utils/client'

import { NetworkInfo } from '../type'

const EMPTY = ''
const EMPTY_ARRAY: any[] = []
const NOT_SUPPORT = null

const avaxTestnetInfo: NetworkInfo = {
  chainId: ChainId.AVAXTESTNET,
  route: 'avalanche-testnet',
  name: 'Avalanche Testnet',
  icon: AVAX,
  classicClient: createClient('https://api.thegraph.com/subgraphs/name/ducquangkstn/dmm-exchange-fuij'),
  elasticClient: createClient('https://api.thegraph.com/subgraphs/name/viet-nv/elastic-fuji'),
  blockClient: createClient('https://api.thegraph.com/subgraphs/name/ducquangkstn/ethereum-block-fuji'),
  etherscanUrl: 'https://testnet.snowtrace.io',
  etherscanName: 'Snowtrace',
  tokenListUrl: `${KS_SETTING_API}/v1/tokens?chainIds=${ChainId.AVAXTESTNET}&isWhitelisted=${true}`,
  bridgeURL: 'https://bridge.avax.network',
  nativeToken: {
    symbol: 'AVAX',
    name: 'AVAX (Wrapped)',
    address: EMPTY,
    logo: AVAX,
    decimal: 18,
  },
  marketToken: {
    symbol: 'VXL',
    name: 'Voxel X Network',
    address: '0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31',
    logo: "",
    decimal: 18,
  },
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  routerUri: EMPTY,
  nftStaker: EMPTY_ARRAY,
  classic: {
    static: {
      zap: EMPTY,
      router: EMPTY,
      factory: EMPTY,
    },
    oldStatic: NOT_SUPPORT,
    dynamic: {
      zap: EMPTY,
      router: '0x19395624C030A11f58e820C3AeFb1f5960d9742a',
      factory: '0x7900309d0b1c8D3d665Ae40e712E8ba4FC4F5453',
    },
    claimReward: EMPTY,
    fairlaunch: [],
    fairlaunchV2: EMPTY_ARRAY,
  },
  elastic: {
    coreFactory: '0x6992a3c0613485644a634bfe22ea97b04f0916aa',
    nonfungiblePositionManager: '0x0C1f1B3608C10DD4E95EBca5a776f004B7EDFdb2',
    tickReader: '0xe3AC3fd66EB31cAf4EE0831b262D837c479FFCe5',
    initCodeHash: '0xc597aba1bb02db42ba24a8878837965718c032f8b46be94a6e46452a9f89ca01',
    quoter: '0x9CFf23e05A18b6f8Aff587B7fEf64F9580A6C85E',
    routers: '0xd74134d330FB567abD08675b57dD588a7447b5Ac',
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
  averageBlockTimeInSeconds: 1.85,
  coingeckoNetworkId: EMPTY,
  coingeckoNativeTokenId: EMPTY,
  deBankSlug: EMPTY,
}

export default avaxTestnetInfo
