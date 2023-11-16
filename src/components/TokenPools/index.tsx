import {useTokenContract } from 'hooks/useContract'
import {  useEffect,useState} from 'react'

 
function TokenInfo({ rewardToken}: { rewardToken: string } ) {

const contract=useTokenContract(rewardToken);

 const [symbol, setSymbol] = useState<string>("")
const getTokenInfo= async function(){
  if(!contract)
    return
  
  setSymbol(await contract.symbol());


}

useEffect( () => {

  getTokenInfo();


}, ["symbol"])

 return (
    <>
    {symbol}
    </>
    )

}

export default TokenInfo
