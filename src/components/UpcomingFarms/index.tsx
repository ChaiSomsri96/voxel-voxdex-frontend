import { Trans } from '@lingui/macro'
import { useMemo, useEffect } from 'react'
import { Flex, Text } from 'rebass'
import { useGetProMMFarms, useProMMFarms } from 'state/farms/promm/hooks'
import { ProMMFarm } from 'state/farms/promm/types'
import ProMMFarmGroup from 'components/YieldPools/ProMMFarmGroup'
import useTheme from 'hooks/useTheme'
import LocalLoader from 'components/LocalLoader'

const UpcomingFarms = () => {
  const theme = useTheme()
  const { data: farms, loading } = useProMMFarms()

  const search = "";

  const filteredFarms = useMemo(() => {
    const now = (Date.now() / 1000)
    return Object.keys(farms).reduce((acc: { [key: string]: ProMMFarm[] }, address) => {

      const currentFarms = farms[address].filter((farm: any) => {
        const filterActive = farm?.startTime > now;

        const filterSearchText = search
          ? farm.token0.toLowerCase().includes(search) ||
          farm.token1.toLowerCase().includes(search) ||
          farm.poolAddress.toLowerCase() === search ||
          farm?.token0Info?.symbol?.toLowerCase().includes(search) ||
          farm?.token1Info?.symbol?.toLowerCase().includes(search) ||
          farm?.token0Info?.name?.toLowerCase().includes(search) ||
          farm?.token1Info?.name?.toLowerCase().includes(search)
          : true

        const filterStaked = true

        return filterActive && filterSearchText && filterStaked
      })

      if (currentFarms.length) acc[address] = currentFarms
      return acc
    }, {})
  }, [farms])

  const noFarms = !Object.keys(filteredFarms).length

  const getProMMFarms = useGetProMMFarms()

  useEffect(() => {
    getProMMFarms()
  }, [getProMMFarms])



  return (
    <>
      {(loading && noFarms)
        ?
        (
          <Flex
            sx={{
              borderRadius: '16px',
            }}
            backgroundColor={theme.background}
          >
            <LocalLoader />
          </Flex>
        )
        :
        noFarms
          ?
          (
            <Flex
              backgroundColor={theme.background}
              justifyContent="center"
              padding="32px"
              style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}
            >
              <Text color={theme.subText}>
                <Trans>Currently there are no upcoming Farms.</Trans>
              </Text>
            </Flex>
          )
          :
          (
            <Flex
              sx={{
                flexDirection: 'column',
                rowGap: '48px',
              }}
            >
              {Object.keys(filteredFarms).map(fairLaunchAddress => {
                return (
                  <ProMMFarmGroup
                    key={fairLaunchAddress}
                    address={fairLaunchAddress}
                    farms={filteredFarms[fairLaunchAddress]}
                    onOpenModal={function (modalType: 'forcedWithdraw' | 'harvest' | 'deposit' | 'withdraw' | 'stake' | 'unstake', pid?: number | undefined): void {
                      throw new Error('Function not implemented.')
                    }}
                  />
                )
              })}
            </Flex>
          )}
    </>
  )
}

export default UpcomingFarms
