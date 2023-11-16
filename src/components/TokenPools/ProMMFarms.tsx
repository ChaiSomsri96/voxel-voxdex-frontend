import { Fraction } from '@kyberswap/ks-sdk-core'
import { useEffect, useState } from 'react'
import { Flex } from 'rebass'
import LocalLoader from 'components/LocalLoader'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { useTokenStakingAction} from 'state/nfts/promm/hooks'
import styled from 'styled-components'
import TokenInfo from 'components/TokenPools'
import { BigNumber } from 'ethers'
import JSBI from 'jsbi'





export const NftCard= styled.div`
    background: #1C1C1C;
    height: auto;
    border-radius: 12px;
    padding: 15px 15px 20px 15px;
    position: relative;
    max-width:320px;
    margin-right:5px;
`

const getFullDisplayBalance = (balance: BigNumber, decimals = 18, significant = 6): string => {
  const amount = new Fraction(balance.toString(), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals)))
  if (amount.lessThan(new Fraction('1'))) {
    return amount.toSignificant(significant)
  }

  return amount.toFixed(0)
}

function ProMMFarms({ active }: { active: boolean } ) {

   const theme = useTheme()
   const { chainId,account } = useActiveWeb3React()
   const { fetchPools } = useTokenStakingAction();
   const activeTab = active ? 'active' : 'ended'
   const [farms, setFarms] = useState<any[]>([])
   const [loading, setLoading] = useState<boolean>(false)


   const getPools = async () => {
      setLoading(true);
      const allPools:any[]= await fetchPools();
      console.log("allPoolsallPools",allPools);
      setFarms(allPools);  
      setLoading(false);    
   };

  useEffect( () => {
      getPools();
  }, ["farms","loading"])

  
  

  return (
    <>
     <Flex>
    
     {(!loading && !farms.length) && <div> No Nft Contract available for Staking. </div>}

    {loading &&  <LocalLoader />} 
    {(!loading &&farms.length >0) &&
        farms?.map((item, key) => (
        <> 
        <TokenInfo rewardToken={item.rewardToken} />
       
        </>
     ))
    }
    
     </Flex>
    </>
  )
}

export default ProMMFarms
