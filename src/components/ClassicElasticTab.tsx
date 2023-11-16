import { ChainId } from '@kyberswap/ks-sdk-core'
import { Trans } from '@lingui/macro'
import { stringify } from 'qs'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { ELASTIC_NOT_SUPPORTED, VERSION } from 'constants/v2'
import { useActiveWeb3React } from 'hooks'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import useParsedQueryString from 'hooks/useParsedQueryString'
import useTheme from 'hooks/useTheme'
import { isInEnum } from 'utils/string'

import { MouseoverTooltip } from './Tooltip'

function ClassicElasticTab() {
  const qs = useParsedQueryString()
  const tab = qs.tab && typeof qs.tab === 'string' && isInEnum(qs.tab, VERSION) ? qs.tab : VERSION.ELASTIC
  const { mixpanelHandler } = useMixpanel()

  const { chainId } = useActiveWeb3React()
  const notSupportedMsg = ELASTIC_NOT_SUPPORTED[chainId as ChainId]

  const theme = useTheme()
  const history = useHistory()

  const isFarmpage = history.location.pathname === '/farms'
  const isNftStakePage= history.location.pathname === '/nft-staking'
  const isTokenStakePage= history.location.pathname === '/token-staking'
  const isMyPools= history.location.pathname === '/myPools'
  return (
    <Flex>
      <MouseoverTooltip text={notSupportedMsg || ''}>
        <Flex
          alignItems={'center'}
          onClick={() => {
            if (!!notSupportedMsg) return
            const newQs = { ...qs, tab: VERSION.ELASTIC }
            let type: MIXPANEL_TYPE | '' = ''
            switch (history.location.pathname) {
              case '/pools':
                type = MIXPANEL_TYPE.ELASTIC_POOLS_ELASTIC_POOLS_CLICKED
                break
              case '/myPools':
                type = MIXPANEL_TYPE.ELASTIC_MYPOOLS_ELASTIC_POOLS_CLICKED
                break

              default:
                break
            }
            if (type) mixpanelHandler(type)
            history.replace({ search: stringify(newQs) })
          }}
        >
          <Text
            fontWeight={500}
            fontSize={[18, 20, 24]}
            color={tab === VERSION.ELASTIC ? (!!notSupportedMsg ? theme.disableText : theme.primary) : theme.subText}
            width={'auto'}
            marginRight={'5px'}
            role="button"
            style={{
              cursor: !!notSupportedMsg ? 'not-allowed' : 'pointer',
            }}
          >
            {isFarmpage ? <Trans>Voxel Farms</Trans>: isTokenStakePage? <Trans>Voxel Token Staking</Trans> : isNftStakePage ? <Trans>Voxel NFT Staking</Trans> :isMyPools? <Trans>My Pools</Trans>  :<Trans>All Pools</Trans>}
          </Text>
          
        </Flex>
      </MouseoverTooltip>
    </Flex>
  )
}

export default ClassicElasticTab
