import { useEffect, useState } from 'react'
import { Text, Flex } from 'rebass'
import useTheme from 'hooks/useTheme'
import { useBlockNumber } from 'state/application/hooks'
import { useFarmAction } from 'state/nfts/promm/hooks'
import { useIsTransactionPending } from 'state/transactions/hooks'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import ContentLoader from 'pages/TokenAmmPool/ContentLoader'
import { Trans } from '@lingui/macro'
import { TYPE } from 'theme'
import { LightCard } from 'components/Card'
import { useActiveWeb3React } from 'hooks'
import Loader from 'components/Loader'
import axios from 'axios';
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
function StakedNftCards({ stakingAddress, nftAddress }: { stakingAddress: string, nftAddress: string }) {
  const theme = useTheme()

  const { approve, withdraw, fetchNfts } = useFarmAction(stakingAddress, nftAddress)
  const [approvalTx, setApprovalTx] = useState('')
  const isApprovalTxPending = useIsTransactionPending(approvalTx)
  const { chainId, account } = useActiveWeb3React()
  const isApprovedForAll = true;
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isUnstaking, setIsUnstaking] = useState<boolean>(false)
  const [nftIdCheck, setNftIdCheck] = useState<string>('')

  const handleApprove = async (nftId: string) => {

    setNftIdCheck(nftId)
    setIsUnstaking(true);

    if (!isApprovedForAll) {

      const tx = await approve().catch((e) => { setIsUnstaking(false); })
      setApprovalTx(tx)

    } else {

      const tx = await withdraw(nftId).catch((e) => { setIsUnstaking(false); })
      setApprovalTx(tx)

    }
  }

  const blockNumber = useBlockNumber()

  const getNfts = async () => {
    const nftList = await fetchNfts();

    console.log({ nftList })

    const newItems: any = await Promise.all(
      nftList.map(async (data: any) => {

        const fileType = await getUrlFileType(data?.image)
        data.fileType = fileType;

        return data;
      })
    ).catch((err) => {
      console.log("error1", err);
    });

    setNfts(newItems);
    setLoading(false);
  };

  const getUrlFileType = async (url: string) => {
    try {
      const res = await axios.get(url, { responseType: 'blob' }).then((response) => {
        return JSON.stringify(response?.headers['content-type'])
      });

      return res;
    }
    catch (e) {
      return "image";
    }
  }

  useEffect(() => {

    getNfts();

    if (!isApprovalTxPending) {
      setIsUnstaking(false);
    }

  }, [loading, isApprovalTxPending, account])



  return (
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
          {loading && <>
            <PositionCardGrid>
              <ContentLoader />
              <ContentLoader />
              <ContentLoader />
              <ContentLoader />
            </PositionCardGrid>
          </>}

          {(!loading && nfts.length == 0) && <>
            <Flex flexDirection="column" alignItems="center" justifyContent="center" marginTop="60px">
              <Info size={48} color={theme.subText} />
              <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                <Trans>
                  No NFTs Staked. Please stake one.
                </Trans>
              </Text>
            </Flex>
          </>}

          <PositionCardGrid>
            {!loading &&
              nfts?.map((item, key) => (
                <StyledPositionCard key={key}>

                  <div className="product-card-body">

                    <Flex alignItems='center' justifyContent='center' width='100%' height={300}>

                      {(item?.fileType).includes("image")
                        &&
                        <img height={300} width={300} src={item?.image} className="nft-image" />
                      }

                      {(item?.fileType).includes("video")
                        &&
                        <>
                          <video height={300} width={300} className="nft-image" controls>
                            <source src={item?.image} type="video/mp4" />
                          </video>
                        </>
                      }
                    </Flex>

                    <h4 className="capitalize" style={{ textTransform: "capitalize" }}>
                      {item?.name}
                    </h4>
                    <p>Token Id: #{item?.tokenId}</p>
                  </div>

                  <div className="product-card-footer">

                    <ButtonPrimary style={{ margin: '4px 0 0 0', padding: '16px' }} onClick={() => handleApprove(item?.tokenId)} disabled={isUnstaking}>
                      <Text fontWeight={500} fontSize={18} >
                        {
                          (isUnstaking && (nftIdCheck == item?.tokenId))
                            ?
                            <Flex alignItems="center" justifyContent="center">Unstaking&nbsp;<Loader /></Flex>
                            :
                            "Unstake"
                        }
                      </Text>
                    </ButtonPrimary>
                  </div>
                </StyledPositionCard>


              ))
            }
          </PositionCardGrid>
        </>
      }
    </AutoColumn >
  )
}

export default StakedNftCards
