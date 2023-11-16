import {useTokenContract } from 'hooks/useContract'
import {  useEffect,useState} from 'react'
function TokenInfo({ address, logo }: {address:string, logo: boolean } ) {

const	contract=useTokenContract(address);

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
