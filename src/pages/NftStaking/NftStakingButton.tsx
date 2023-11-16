import { Trans } from '@lingui/macro'
import React, {
  useState,
  useEffect
} from 'react'
import { Flex } from 'rebass'
import axios from 'axios';

import { ButtonPrimary } from 'components/Button'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { useParams } from 'react-router-dom'
import { useFarmAction } from 'state/nfts/promm/hooks'
import { useActiveWeb3React } from 'hooks'
import Loader from 'components/Loader';

export const NftStakingButton = () => {
  const { account } = useActiveWeb3React()
  const { nftAddress, stakingAddress } = useParams<{ nftAddress: string, stakingAddress: string }>();
  const { isApprovedContract, approve, harvest, fetchPoolInfo } = useFarmAction(stakingAddress, nftAddress)

  const [poolInfo, setPoolInfo] = useState<any>(null)
  const [isApprovedForAll, setApprovedForAll] = useState<boolean>(false)
  const [haveNfts, setHaveNfts] = useState<boolean>(true)
  const [approvalTx, setApprovalTx] = useState('')
  const isApprovalTxPending = useIsTransactionPending(approvalTx);
  const [isApprovedLoading, setIsApprovedLoading] = useState<boolean>(false)
  const [isHarvestLoading, setIsHarvestLoading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {

    awaitedCall()

    if (!isApprovalTxPending) {
      setIsHarvestLoading(false);
      setIsApprovedLoading(false);
    }

  }, [approvalTx, isApprovedForAll, isApprovalTxPending, account])

  const awaitedCall = async () => {
    await checkApproval();
    await getPoolInfo();
    await getWalletNfts();
    setIsLoading(false);
  }

  const harvestRewards = async () => {
    if (isApprovedForAll && poolInfo.totalRewards > 0) {
      setIsHarvestLoading(true);
      const tx = await harvest().catch((e) => { setIsHarvestLoading(false); })
      setApprovalTx(tx)
    }
  }

  const approveContract = async () => {
    if (!isApprovedForAll && !haveNfts) {
      setIsApprovedLoading(true);
      const tx = await approve().catch((e) => { setIsApprovedLoading(false); })
      setApprovalTx(tx)
    }
  }

  const checkApproval = async () => {
    setApprovedForAll(await isApprovedContract());
  }

  const getPoolInfo = async () => {
    const _poolInfo = await fetchPoolInfo();
    setPoolInfo(_poolInfo);
  }

  const getWalletNfts = async () => {
    const options = {
      method: 'GET',
      url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
      params: { chain: 'goerli', format: 'decimal', limit: '100', token_addresses: nftAddress },
      headers: { accept: 'application/json', 'X-API-Key': 'Rv3g3LTZTkWtDKVHmX75V4kddgnOEE4qSboNpNNQemGVnZwOl0sinl3fQJJSgaN0' }
    };

    axios
      .request(options)
      .then(async function (response) {
        const res = response.data.result;

        if (res.length == 0) {
          setHaveNfts(true);
        }
        else if (res.length > 0) {
          setHaveNfts(false);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <>
      <Flex>

        <ButtonPrimary
          fontSize="14px"
          padding="10px 24px"
          width="fit-content"
          disabled={isLoading || isApprovedForAll || haveNfts || isApprovedLoading}
          onClick={approveContract}
        >
          <Trans>{isApprovedLoading ? <>Approving&nbsp;<Loader /></> : (isApprovedForAll ? "Approved" : "Approve Contract")}</Trans>
        </ButtonPrimary>

        &nbsp;

        <ButtonPrimary
          fontSize="14px"
          padding="10px 24px"
          width="fit-content"
          onClick={harvestRewards}
          disabled={isLoading || (poolInfo ? !poolInfo.totalRewards : false) || !isApprovedForAll || isHarvestLoading}
        >
          <Trans>{isHarvestLoading ? <>Harvesting&nbsp;<Loader /></> : "Harvest Rewards"}</Trans>
        </ButtonPrimary>

      </Flex>
    </>
  )
}