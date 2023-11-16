import { useMedia } from 'react-use'
import { Flex, Text } from 'rebass'
import { AutoColumn } from 'components/Column'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import useTheme from 'hooks/useTheme'
import { MEDIA_WIDTHS } from 'theme'

export default function ProAmmStakeInfo({
  stakedToken,
  rewardToken
}: {
  stakedToken?: any
  rewardToken?: any
}) {
  const upToSmall = useMedia(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`)
  const theme = useTheme()
  const token0Shown = stakedToken
  const token1Shown = rewardToken


  return (
    <>
      {stakedToken && (
        <AutoColumn>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex>
              <DoubleCurrencyLogo currency0={token0Shown} currency1={token1Shown} size={24} />
              <Text fontSize="20px" fontWeight="500">
                {token0Shown.symbol} - {token1Shown.symbol}
              </Text>
            </Flex>

          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex>

              <Text fontSize="12px" fontWeight="400" marginTop={'6px'} marginLeft={'6px'}>
                Stake {token0Shown.symbol} to Earn {token1Shown.symbol}
              </Text>
            </Flex>
          </Flex>


        </AutoColumn>
      )}
    </>
  )
}
