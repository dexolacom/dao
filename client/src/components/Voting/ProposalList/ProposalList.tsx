// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Wrapper, Title } from './styles';
import { Button } from '../../theme';
import { normalizeValue } from '../../constants/helpers'
import {
  DELEGATIES_TOKEN_CONTRACT,
  LOCK_STAKING_GNBU_HARD_BIG_CONTRACT,
  LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT,
  PROPOSALS_TOKEN_CONTRACT,
  web3,
} from '../../constants/constants';


const ProposalList = ({ isOpenDelegationModal, setIsOpenDelegationModal, setIsProposalEditorOpen }) => {
  const { account, chainId } = useWeb3React()

  const [disableDelegation, setDisableDelegation] = useState(true)
  const [accessForEditProposal, setAccessForEditProposal] = useState(true)
  // const [errorBlock, setErrorBlock] = useState(false) // depracated
  // const [voteRights, setVoteRights] = useState(true) // depraceted
  const [showBannerVoting, setShowBannerVoting] = useState(false)
  const [showBannerStaking, setShowBannerStaking] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [showList, setShowList] = useState(true)
  const [disableButtonCreateProposal, setDisableButtonCreateProposal] = useState(false)
  const [data, setData] = useState([])

  // banner warning (voting, staking)
  const accessOrError = async () => {
    let balanceSmall
    let balanceBig
    let latestProposalIds

    if (account) {
      balanceSmall = await LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT.methods.balanceOfRewardEquivalent(account).call()
      balanceBig = await LOCK_STAKING_GNBU_HARD_BIG_CONTRACT.methods.balanceOfRewardEquivalent(account).call()
      latestProposalIds = await PROPOSALS_TOKEN_CONTRACT.methods.latestProposalIds(account).call()
    }

    const sum = normalizeValue(balanceSmall) + normalizeValue(balanceBig)

    // if (latestProposalIds) {
    //   PROPOSALS_TOKEN_CONTRACT.methods
    //     .state(latestProposalIds)
    //     .call()
    //     .then(res => {
    //       if (res == 1) setDisableButtonCreateProposal(true)
    //     })
    //     .catch(err => console.error(err))
    // }
    //
    // const freeCirculation = await DELEGATIES_TOKEN_CONTRACT.methods.freeCirculation().call()
    // const delegated = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(account).call()
    //
    // let warningStaking = false
    // let warningVoting = false
    //
    // if (delegated < (freeCirculation * 1) / 100) {
    //   warningVoting = true
    // } else {
    //   if (sum < normalizeValue(freeCirculation) / 1000) warningStaking = true
    // }
    //
    // setShowBannerStaking(warningStaking)
    // setShowBannerVoting(warningVoting)
  }

  // const initCheckHardStakingValue = async () => {
  //   // нужно разобраться
  //   const balanceSmall = await LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT.methods.balanceOfRewardEquivalent(account).call()
  //   const balanceBig = await LOCK_STAKING_GNBU_HARD_BIG_CONTRACT.methods.balanceOfRewardEquivalent(account).call()
  //   const balanceProposal = await PROPOSALS_TOKEN_CONTRACT.methods.proposalStakeThreshold().call()
  //   const balance = await DELEGATIES_TOKEN_CONTRACT.methods.balanceOf(account).call()
  //   const sum = normalizeValue(balanceSmall) + normalizeValue(balanceBig)
  //   const percent = (sum / normalizeValue(balanceProposal)) * 100
  //   percent > 0.1 && setAccessForEditProposal(false)
  //   // percent < 0.1 && setErrorBlock(true) // depracated
  //   // balance < 0.1 && setErrorBlock(true) // depracated
  //   // percent < 1 && setVoteRights(false) // depracated
  // }

  // const getChangeCancelProposal = async addressProposer => {
  //   const free = await DELEGATIES_TOKEN_CONTRACT.methods.freeCirculation().call()
  //   const current = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(addressProposer).call()
  //   const balance = await DELEGATIES_TOKEN_CONTRACT.methods.balanceOf(addressProposer).call()
  //
  //   const balanceHardSmall = await LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT.methods.balanceOf(addressProposer).call()
  //   const balanceHardBig = await LOCK_STAKING_GNBU_HARD_BIG_CONTRACT.methods.balanceOf(addressProposer).call()
  //   // for test
  //   const balanceSoft = await LOCK_STAKING_CONTRACT_SOFT.methods.balanceOf(addressProposer).call()
  //   const freeCirculationGNBU = await GNBU_TOKEN_CONTRACT.methods.freeCirculation().call()
  //   const calculateProcent = (sum, num) => {
  //     return ((num / sum) * 100)?.toFixed(2)
  //   }
  //
  //   const isDelegate =
  //     +calculateProcent(free, balance) +
  //     (current == 0 ? 0 : +calculateProcent(free, current)) -
  //     (current == 0 ? 0 : +calculateProcent(free, balance)) >
  //     1
  //   // for test
  //   const sum = +normalizeValue(balanceHardSmall) + +normalizeValue(balanceHardBig) + +normalizeValue(balanceSoft)
  //   // for product
  //   // const sum = +normalizeValue(balanceHardSmall) + +normalizeValue(balanceHardBig)
  //   const minFree = normalizeValue(freeCirculationGNBU) / 1000
  //   const isStaking = sum <= minFree
  //
  //   return isDelegate && isStaking
  // }

  // const init = async () => {
  //   const arr = []
  //   const proposalCount = await PROPOSALS_TOKEN_CONTRACT.methods.proposalCount().call()
  //   const freeCirculation = await DELEGATIES_TOKEN_CONTRACT.methods.freeCirculation().call()
  //   for (let i = proposalCount; i > 0; --i) {
  //     const getActions = await PROPOSALS_TOKEN_CONTRACT.methods.getActions(i).call()
  //     const proposals = await PROPOSALS_TOKEN_CONTRACT.methods.proposals(i).call()
  //     const procentSumVotes =
  //       ((normalizeValue(proposals.forVotes) + normalizeValue(proposals.againstVotes)) /
  //         normalizeValue(freeCirculation)) *
  //       100
  //     const state = await PROPOSALS_TOKEN_CONTRACT.methods.state(i).call()
  //     const block = await web3.eth.getBlock(proposals.endBlock)
  //     const diffBlock = proposals.startBlock - proposals.endBlock
  //     const daysLeft = new Date(block?.timestamp * 1000).getDay() - new Date().getDay()
  //     const daysEnd = Math.abs((diffBlock * 15) / 60 / 60 / 24)
  //
  //     const ms = (proposals.endBlock - (await web3.eth.getBlockNumber())) * 15 * 1000
  //     const timeEnd = new Date()
  //     timeEnd.setMilliseconds(timeEnd.getMilliseconds() + ms)
  //
  //     const requestOptions = {
  //       method: 'GET'
  //     }
  //
  //     let item = {}
  //     let cancelProposal = false
  //     if (state == 1) {
  //       cancelProposal = await getChangeCancelProposal(proposals.proposer)
  //     }
  //
  //     await fetch(`https://api.nimbus.mng.ninja/api/v3/voting?votingId=${i}&chainId=${chainId}`, requestOptions)
  //       .then(response => response.text())
  //       .then(result => {
  //         const data = JSON.parse(result)
  //         item = {
  //           id: proposals.id,
  //           description: '',
  //           daysLeft: daysLeft == 0 ? '-' : daysLeft < 0 ? '-' : daysLeft,
  //           daysEnd,
  //           votes: normalizeValue(proposals.forVotes) + normalizeValue(proposals.againstVotes),
  //           forVotes: normalizeValue(proposals.forVotes),
  //           againstVotes: normalizeValue(proposals.againstVotes),
  //           status: state,
  //           proposer: proposals.proposer,
  //           procentSumVotes: `${procentSumVotes.toFixed(2)}%`,
  //           timeEnd,
  //           cancelProposal,
  //           title: ''
  //         }
  //         if (data.success) {
  //           const text = data?.data?.text
  //           const title = data?.data?.title
  //           try {
  //             if (JSON.parse(text)) {
  //               const jsontext = JSON.parse(text)
  //               item.description = jsontext.blocks[0].text
  //               item.title = title
  //             }
  //           } catch (error) {
  //             item.description = text
  //             item.title = title
  //           }
  //         } else {
  //           item.description = ''
  //         }
  //       })
  //       .catch(error => {
  //         item = {
  //           id: proposals.id,
  //           description: '',
  //           daysLeft: daysLeft == 0 ? '-' : daysLeft < 0 ? '-' : daysLeft,
  //           daysEnd,
  //           votes: normalizeValue(proposals.forVotes) + normalizeValue(proposals.againstVotes),
  //           forVotes: normalizeValue(proposals.forVotes),
  //           againstVotes: normalizeValue(proposals.againstVotes),
  //           status: state,
  //           proposer: proposals.proposer,
  //           procentSumVotes: `${procentSumVotes.toFixed(2)}%`,
  //           timeEnd,
  //           cancelProposal,
  //           title: ''
  //         }
  //         console.error('error', error)
  //       })
  //     arr.push(item)
  //     setData(arr)
  //   }
  //   setShowLoading(false)
  //   if (!arr.length) {
  //     setShowList(false)
  //   }
  //   const currentVotes = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(account).call()
  //   const participationToken = await PROPOSALS_TOKEN_CONTRACT.methods.participationThreshold().call()
  //
  //   if (normalizeValue(participationToken) < normalizeValue(currentVotes)) setAccessForEditProposal(false)
  //   initCheckHardStakingValue()
  // }

  useEffect(() => {
    if (account) accessOrError()
  }, [account])

  useEffect(() => {
    if (account) init()
  }, [])

  useEffect(() => {
    if (account) {
      setDisableDelegation(false)
      // init()
      setIsOpenDelegationModal(false)
    }
  }, [account])

  return (
    <Wrapper>
      <Title>Proposals list</Title>
      <Button onClick={() => setIsProposalEditorOpen(true)}>
        Create new proposal
      </Button>
    </Wrapper>
  )
}

export default ProposalList