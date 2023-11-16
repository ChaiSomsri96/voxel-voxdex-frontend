import { ChainId } from '@kyberswap/ks-sdk-core'

import EthereumLogo from 'assets/images/ethereum-logo.png'
import Mainnet from 'assets/networks/mainnet-network.svg'
//import { KS_SETTING_API } from 'constants/env'
import { createClient } from 'utils/client'

import { NetworkInfo } from '../type'

const EMPTY = ''
const EMPTY_ARRAY: any[] = []
const NOT_SUPPORT = null

const görliInfo: NetworkInfo = {
  chainId: ChainId.GÖRLI,
  route: 'goerli',
  name: 'Görli',
  icon: Mainnet,
  classicClient: createClient(
    'https://ethereum-graph.dev.kyberengineering.io/subgraphs/name/kybernetwork/kyberswap-classic-goerli',
  ),
  elasticClient: createClient(
    'https://api.thegraph.com/subgraphs/name/sharadjaiswal1411/voxelswap-elastic-gorli',
  ),
  blockClient: createClient('https://api.thegraph.com/subgraphs/name/blocklytics/goerli-blocks'),
  etherscanUrl: 'https://goerli.etherscan.io',
  etherscanName: 'Goerli Explorer',
  tokenListUrl: `https://test.voxdex.io/tokens/5.json?`,
  // tokenListUrl: `http://localhost:3000/5.json?`,
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
  // rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // old
  rpcUrl: 'https://bitter-powerful-spree.ethereum-goerli.quiknode.pro/ff59c04d314b7fa51ca4ebfbb2a52506a5882f3d',
  routerUri: EMPTY,
  nftStaker: EMPTY_ARRAY,
  classic: {
    static: {
      zap: EMPTY,
      router: '0x4F4994415B72FE87E01345f522D0A62A584D19b4',
      factory: '0xE612668FbE2CfDb71A4b6cD422d611E63585D33A',
    },
    oldStatic: NOT_SUPPORT,
    dynamic: NOT_SUPPORT,
    claimReward: EMPTY,
    fairlaunch: EMPTY_ARRAY,
    fairlaunchV2: EMPTY_ARRAY,
  },
  // elastic: {
  //   coreFactory: '0x1a91f5ADc7cB5763d35A26e98A18520CB9b67e70',
  //   nonfungiblePositionManager: '0x8B76f8e008570686aD5933e5669045c5B01DB7bE',
  //   tickReader: '0x24F40B8a021d5442B97459A336D1363E4D0f1388',
  //   initCodeHash: '0xc597aba1bb02db42ba24a8878837965718c032f8b46be94a6e46452a9f89ca01',
  //   quoter: '0x032c677619f72c670e4DA64126B48d906dfa952F',
  //   routers: '0x45a5B8Cf524EC574b40e80274F0F3856A679C5c4',
  //   descriptor: '0x671654F28F9ef9F3B289F53d6ECb29992a82b9E9',
  //   weth:'0x48f6D7dAE56623Dde5a0D56B283165cAE1753D70',
  //   rewardLocker:'0x871bE7bCFC545F4e99fc8aA1EAF8187aB7313547',
  //farming:'0xcBeb32E9AeDCa7F82913F21003Ac2C44Ad3f2385',
  // multicall: '0xD9bfE9979e9CA4b2fe84bA5d4Cf963bBcB376974'
  // },


  elastic: {
    coreFactory: '0x1A642f8bd7a9835Df8d64F9fA0291e5CC0Cfe7c4',
    nonfungiblePositionManager: '0x87bD6F3435638eB2760FBd01FF1BBd1Ca918e749',
    tickReader: '0x777fd0C0a99bFEa20b3066B5Ab74ecD47aE141aa',
    initCodeHash: '0x5c878a9c1f788b21f73866aafd7454d090020eb38cda2d676bd4b07d9a35deb9',
    quoter: '0x9eb194244b591c5F9555eaaef38fB66fafD3c405',
    routers: '0x93F98f44C6d05d6Fd7B030124F508aE6038a4107',
    //  rewardLocker:'0x99908d55Bf782a323c853DcDf113Cf0564fAE385'
    // farming:'0x206a4b628B8bb3c920Fc7C11CCB133Dd97C4F453'
    // descriptor: '0x4880C819F4C2249e23655866bA48e29CC5153901'
    // PERMISSIONADMIN: 0x9c2e6d70758C1BAe3314d4291cBdBF03f085e191
    // VOXELVAULT: 0x0b1081f8818eA025247100AaE2024a5D0b9577a8
    // sha1:"0x8Af882BDcfC7cbF19E0930E609dc9D16663841e1"
  },
  // elastic: {
  //AntiSnipAttackPositionManager: 0xF5a98977213B3CF67A041A45b29E8ED389D7B0D2
  //   coreFactory: '0x32ff4D05236E95FF60299E9b7BaB351179138389',
  //   nonfungiblePositionManager: '0xCf6c82016F1781aa26C60e9432c1E8f2A192c6b0',
  //   tickReader: '0x777fd0C0a99bFEa20b3066B5Ab74ecD47aE141aa',
  //   initCodeHash: '0x080521b821ffe6f72ff78232bd25a0a2b65610261e006e50558215bee082ab73',
  //   quoter: '0xA7cA99e835f3DB274289742f154BfA5E45459F0A',
  //   routers: '0x510875C6eDAE8Ad25AD38AA741D82E2b33bc32fe',
  //   abhitoken 0x12a3b86d4f8947997882aae73cb041e2d325caac
  // },
  staking: {
    nftFactory: '0xe6336C2f375E9199CA1515167ab1da4dE43D9E6c',
    tokenFactory: '0x115f934264f4d5347185f386C1b4A979bB40610d',
  },
  ROLES: {
    NFTStaking: {
      operator: "",
      admin: ""
    },
    TokenStaking: {
      operator: "0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c",
      admin: "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  },

  averageBlockTimeInSeconds: 13.13,
  coingeckoNetworkId: EMPTY,
  coingeckoNativeTokenId: EMPTY,
  deBankSlug: EMPTY,
}

export default görliInfo
