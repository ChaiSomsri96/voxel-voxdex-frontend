import styled from 'styled-components'
import ClassicElasticTab from 'components/ClassicElasticTab'
import { AutoColumn } from 'components/Column'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { VERSION } from 'constants/v2'
import useParsedQueryString from 'hooks/useParsedQueryString'
import TokenAmmPool from '../TokenAmmPool'
import CreateTokenStakingBtn from 'pages/AddTokenStaking/CreateTokenStakingBtn'
import { useEffect, useState } from 'react'
import { useTokenStakingAction } from 'state/nfts/promm/hooks'
import ManageAuth from './ManageAuth'
import { Flex } from 'rebass'

export const Tab = styled.div<{ active: boolean }>`
  padding: 4px 0;
  color: ${({ active, theme }) => (active ? theme.primary : theme.subText)};
  font-weight: 500;
  cursor: pointer;
  :hover {
    color: ${props => props.theme.primary};
  }
`
export const PageWrapper = styled.div`
  padding: 32px 24px 50px;
  width: 100%;
  max-width: 1500px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 24px 16px 100px;
  `}

  display: flex;
  flex-direction: column;
  gap: 20px;
`
export const HeadingRight = styled.div`
  display: flex;
  gap: 20px;
  justify-content: right;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: flex;
    flex-direction: column-reverse;
    gap: 0;
  `}
`

export default function PoolCombination() {
  const qs = useParsedQueryString()
  const tab = (qs.tab as string) || VERSION.ELASTIC
  const { checkRole } = useTokenStakingAction();

  const [roleCheck, setRoleCheck] = useState(false);
  const checkAuth = async () => {
    const response = await checkRole(
      { role: "0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c" }
    )
    setRoleCheck(response)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <>
      <PageWrapper>
        <Flex alignItems="center" justifyContent="space-between" >
          <AutoColumn>
            <ClassicElasticTab />
          </AutoColumn>
          <HeadingRight >
            <ManageAuth />
            {roleCheck && <CreateTokenStakingBtn />}
          </HeadingRight>
        </Flex>
        <TokenAmmPool />
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}


