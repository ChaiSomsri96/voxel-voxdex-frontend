import { useAllTokens } from "hooks/Tokens"
import { isAddressString } from "utils"
import { ChainId, Token, WETH } from '@kyberswap/ks-sdk-core'
import { useActiveWeb3React } from "hooks"
import { nativeOnChain } from "constants/tokens"


const selectBox = {
    width: "100%",
    height: "35px",
    background: "black",
    color: "white",
    outline: "none",
    border: "none",

}

const CustomSelect = (params: any) => {
    const { chainId } = useActiveWeb3React()
    const allTokens = useAllTokens()

    const selectedPool = (val: any) => {
        params.pool(val)
    }

    const CustomOption = (props: any) => {

        const token0 = allTokens[isAddressString(props?.pair?.token0?.address)] || new Token(chainId as ChainId, props?.pair?.token0?.address, props?.pair?.token0?.decimals, props?.pair?.token0?.symbol)
        const token1 = allTokens[isAddressString(props?.pair?.token1?.address)] || new Token(chainId as ChainId, props?.pair?.token1?.address, props?.pair?.token1?.decimals, props?.pair?.token1?.symbol)

        const isToken0WETH = props?.pair?.token0?.address === WETH[chainId as ChainId]?.address?.toLowerCase()
        const isToken1WETH = props?.pair?.token1?.address === WETH[chainId as ChainId]?.address?.toLowerCase()

        const nativeToken = nativeOnChain(chainId as ChainId)

        const token0Symbol = isToken0WETH ? nativeToken.symbol : token0.symbol
        const token1Symbol = isToken1WETH ? nativeToken.symbol : token1.symbol

        return (
            <option value={props?.pair?.address}>{token0Symbol} - {token1Symbol}</option>
        )
    }

    return (
        <>
            <select value={params?.selectedValue} name="pools" style={selectBox} onChange={(e) => { selectedPool(e.target.value) }} disabled={params?.disabled}>
                <option value="" >---Select---</option>
                {
                    (params?.data?.length > 0)
                    &&
                    params?.data?.map((item: any, index: any) => (
                        <CustomOption key={index} pair={item} />
                    ))
                }
            </select>
        </>
    );
};

export default CustomSelect;