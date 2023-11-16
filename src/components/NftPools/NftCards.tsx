import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Text, Flex } from 'rebass'
import { AutoColumn } from 'components/Column'
import useTheme from 'hooks/useTheme'
import { useBlockNumber } from 'state/application/hooks'
import { useFarmAction } from 'state/nfts/promm/hooks'
import { useIsTransactionPending } from 'state/transactions/hooks'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import { useActiveWeb3React } from 'hooks'
import axios from 'axios';
import { LightCard } from 'components/Card'
import defaultNftImage from '../../assets/images/default-nft-image.jpg';
import ContentLoader from 'pages/TokenAmmPool/ContentLoader'
import { Trans } from '@lingui/macro'
import { TYPE } from 'theme'
import Loader from 'components/Loader'
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
function NftCards({ stakingAddress, nftAddress }: { stakingAddress: string, nftAddress: string }) {
  const theme = useTheme()
  const { chainId, account } = useActiveWeb3React()
  const { approve, deposit, isApprovedContract } = useFarmAction(stakingAddress, nftAddress)
  const [approvalTx, setApprovalTx] = useState('')
  const [isApprovedForAll, setApprovedForAll] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [isStaking, setIsStaking] = useState<boolean>(false)
  const [nftIdCheck, setNftIdCheck] = useState<string>('')
  const isApprovalTxPending = useIsTransactionPending(approvalTx)

  const handleApprove = async (nftId: string) => {
    setNftIdCheck(nftId);
    setIsStaking(true);
    if (isApprovedForAll) {
      const tx = await deposit(nftId).catch((e) => { setIsStaking(false); })
      setApprovalTx(tx)
    }
  }

  const [nfts, setNfts] = useState<any[]>([])
  const getProMMFarms = async () => {
    // setApprovedForAll(await isApprovedContract());
    const options = {
      method: 'GET',
      url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
      params: { chain: 'goerli', format: 'decimal', limit: '100', token_addresses: nftAddress },
      headers: { accept: 'application/json', 'X-API-Key': 'Rv3g3LTZTkWtDKVHmX75V4kddgnOEE4qSboNpNNQemGVnZwOl0sinl3fQJJSgaN0' }
      //0w8Ivx0tOflZTjQIb9ITjW2LFU1U243aiNXc6Ccqf9eu9qNajB4F4OSYb9xsxEQZ (OLD)
    };

    axios
      .request(options)
      .then(async function (response) {

        const res = response.data.result;

        const newItems: any = await Promise.all(
          res.map(async (data: any) => {

            if (data.metadata) {
              const _image = JSON.parse(data.metadata).image;
              data.srcFile = _image;
              data.nftName = JSON.parse(data.metadata).name;

              const fileType = await getUrlFileType(_image)
              data.fileType = fileType;

            }
            else {
              data.srcFile = defaultNftImage
              data.fileType = "image";
            }

            return data;
          })
        ).catch((err) => {
          console.log("error1", err);
        });

        setNfts(newItems);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

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

  const blockNumber = useBlockNumber()

  const checkAuth = async () => {
    try {
      setApprovedForAll(await isApprovedContract());
    }
    catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getProMMFarms()
    checkAuth()
    if (!isApprovalTxPending) {
      setIsStaking(false);
    }

  }, [approvalTx, isApprovedForAll, isApprovalTxPending, account])

  const history = useHistory()
  const location = useLocation()


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

            {(nfts.length == 0 && !loading)
              &&
              <div>
                <Flex flexDirection="column" alignItems="center" justifyContent="center" marginTop="60px">
                  <Info size={48} color={theme.subText} />
                  <Text fontSize={16} lineHeight={1.5} color={theme.subText} textAlign="center" marginTop="1rem">
                    <Trans>
                      No NFTs owned. Please mint some.
                    </Trans>
                  </Text>
                </Flex>
              </div>
            }

            {loading && <>
              <PositionCardGrid>
                <ContentLoader />
                <ContentLoader />
                <ContentLoader />
                <ContentLoader />
              </PositionCardGrid>
            </>}

            <PositionCardGrid>
              {(nfts.length > 0 && !loading)
                &&
                nfts.map((item, key) => (
                  <StyledPositionCard key={key}>

                    <div className="product-card-body">

                      <Flex flexDirection='column' justifyContent='space-between'>

                        <Flex alignItems='center' justifyContent='center' width='100%' height={300}>
                          {(item?.fileType).includes("image")
                            &&
                            <img height={300} width={300} src={item?.srcFile} className="nft-image" />
                          }

                          {(item?.fileType).includes("video")
                            &&
                            <>
                              <video height={300} width={300} className="nft-image" controls>
                                <source src={item?.srcFile} type="video/mp4" />
                              </video>
                            </>
                          }
                        </Flex>

                        <>
                          <h4 className="capitalize" style={{ textTransform: "capitalize" }}>
                            {item.nftName}
                          </h4>
                          {/* <h5 className="capitalize" style={{ textTransform: "capitalize" }}>
                            {item.name}
                            </h5> */}
                          <p>Token Id: #{item.token_id}</p>
                        </>
                      </Flex>
                    </div>
                    <div className="product-card-footer">
                      <ButtonPrimary style={{ margin: '4px 0 0 0', padding: '16px' }} onClick={() => handleApprove(item.token_id.toString())} disabled={!isApprovedForAll || isStaking}>
                        <Text fontWeight={500} fontSize={18}>
                          {
                            (isStaking && (nftIdCheck == (item?.token_id).toString()))
                              ?
                              <Flex alignItems="center" justifyContent="center">Staking&nbsp;<Loader /></Flex>
                              :
                              "Stake"
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
      </AutoColumn>
    </>
  )
}

export default NftCards
