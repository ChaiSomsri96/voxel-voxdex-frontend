import { Fraction } from '@kyberswap/ks-sdk-core'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { useStakingAction } from 'state/nfts/promm/hooks'
import styled from 'styled-components'
import { BigNumber } from 'ethers'
import JSBI from 'jsbi'
import { AutoColumn } from 'components/Column'
import { LightCard } from 'components/Card'
import { Trans } from '@lingui/macro'
import { TYPE } from 'theme'
import ContentLoader from 'pages/TokenAmmPool/ContentLoader'
import { Flex, Text } from 'rebass'
import { Info } from 'react-feather'

export const PositionCardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px,auto) minmax(320px,auto) minmax(320px,auto) minmax(320px,auto);
  gap: 24px;
  max-width: 1392px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 1fr 1fr;
    max-width: 832px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
    max-width: 392px;
  `};
`
const StyledPositionCard = styled(LightCard)`
  border: none;
  background: ${({ theme }) => theme.background};
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 16px;
  `}
`
const getFullDisplayBalance = (balance: BigNumber, decimals = 18, significant = 6): string => {
  const amount = new Fraction(balance.toString(), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals)))
  if (amount.lessThan(new Fraction('1'))) {
    return amount.toSignificant(significant)
  }

  return amount.toFixed(0)
}

function ProMMFarms({ active }: { active: boolean }) {

  const theme = useTheme()
  const { chainId, account } = useActiveWeb3React()
  const { fetchPools } = useStakingAction();
  const activeTab = active ? 'active' : 'ended'
  const [farms, setFarms] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getPools = async () => {
    const allPools: any[] = await fetchPools().catch((e) => { setFarms([]); setLoading(false); });

    if (allPools) {
      setFarms(allPools);
    }

    setLoading(false);
  };

  useEffect(() => {

    getPools();

  }, [chainId, account])



  return (
    <>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        {!account
          ?
          <TYPE.body color={theme.text3} textAlign="center">
            <Flex flexDirection="column" alignItems="center" justifyContent="center" marginTop="60px">
              <Info size={48} color={theme.subText} />
              <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                <Trans>
                  Connect to a wallet to view staking Pools.
                </Trans>
              </Text>
            </Flex>
          </TYPE.body>
          :
          <>
            <PositionCardGrid>
              {(farms.length > 0 && !loading)
                &&
                (farms?.map((item, key) => (
                  <StyledPositionCard key={key}>
                    <div >
                      <Link to={`nft-staking/${item.stakingContract}/${item.nft}`}>
                        <img src={item.logoURI} alt={item.name} width="300px" height="320px" className="nft-image" />
                      </Link>
                    </div>

                    <h4 className="capitalize">
                      {item.name}
                    </h4>
                  </StyledPositionCard>
                )))
              }
            </PositionCardGrid>

            {loading
              &&
              <PositionCardGrid>
                <ContentLoader />
                <ContentLoader />
                <ContentLoader />
                <ContentLoader />
              </PositionCardGrid>
            }

            {(farms.length == 0 && !loading)
              &&
              <Flex flexDirection="column" alignItems="center" justifyContent="center" marginTop="60px">
                <Info size={48} color={theme.subText} />
                <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                  <Trans>
                    No Nft Contract available for Staking.
                  </Trans>
                </Text>
              </Flex>
            }
          </>
        }
      </AutoColumn>
    </>
  )
}

export default ProMMFarms
