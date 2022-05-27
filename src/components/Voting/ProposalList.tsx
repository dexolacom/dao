// @ts-nocheck
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import { Link } from 'react-router-dom'
// import { isMobileOnly } from 'react-device-detect'

// import { RowBetween, RowFlat } from '../../components/Row'
// import { AutoColumn } from '../../components/Column'
// import { ButtonPrimary } from '../../components/Button'
//
// import { TYPE } from '../../theme'
// import ArrowIcon from '../../assets/svg/dropdownArrow.svg'
// import { useActiveWeb3React } from '../../hooks'
//
// import GOVERNOR_V1_ABI from '../../constants/proposals/governorV1ABI.json'
// import GNBU from '../../constants/proposals/gnbu.json'
// import LOCK_STAKING_ABI_GNBU from '../../constants/abis/lockStakingRewardFixedAPY.json'

// import Proposal from './Proposal'
import { normalizeValue } from './helpers'


const ProposalList = ({ isOpenDelegationModal, setIsOpenDelegationModal }) => {
  const { t } = useTranslation()
  const { account, chainId, library, connector } = useActiveWeb3React()

  const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)
  const PROPOSALS_TOKEN_CONTRACT = new web3.eth.Contract(
    GOVERNOR_V1_ABI as any,
    chainId == 97 || chainId == 56
      ? '0x285432B4679c8Cd6E96E4214fC49aEeD1108B77b'
      : process.env.REACT_APP_PROPOSALS_TOKEN_CONTRACT
  )
  const DELEGATIES_TOKEN_CONTRACT = new web3.eth.Contract(
    GNBU as any,
    chainId == 97 || chainId == 56
      ? '0xA4d872235dde5694AF92a1d0df20d723E8e9E5fC'
      : process.env.REACT_APP_DELEGATIES_TOKEN_CONTRACT
  )
  const GNBU_TOKEN_CONTRACT = new web3.eth.Contract(
    GNBU,
    chainId == 97 || chainId == 56
      ? '0xA4d872235dde5694AF92a1d0df20d723E8e9E5fC'
      : process.env.REACT_APP_GNBU_TOKEN_CONTRACT
  )
  const LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT = new web3.eth.Contract(
    LOCK_STAKING_ABI_GNBU as any,
    chainId == 97 || chainId == 56
      ? '0x0AfFD0632cf705aEdF6218AE3CA5Bd7D10a58272'
      : process.env.REACT_APP_LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT
  )
  const LOCK_STAKING_GNBU_HARD_BIG_CONTRACT = new web3.eth.Contract(
    LOCK_STAKING_ABI_GNBU as any,
    chainId == 97 || chainId == 56
      ? '0x15603Ed5dBBA604d965064e3C4f14C4E2189a012'
      : process.env.REACT_APP_LOCK_STAKING_GNBU_HARD_BIG_CONTRACT
  )
  const LOCK_STAKING_CONTRACT_SOFT = new web3.eth.Contract(
    LOCK_STAKING_ABI_GNBU as any,
    chainId == 97 || chainId == 56
      ? '0x31557dB0c6F614116Fe48Cb5f5CB5E3d8Aa20379'
      : process.env.REACT_APP_LOCK_STAKING_GNBU_SOFT_CONTRACT
  )

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
    const balanceSmall = await LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT.methods.balanceOfRewardEquivalent(account).call()
    const balanceBig = await LOCK_STAKING_GNBU_HARD_BIG_CONTRACT.methods.balanceOfRewardEquivalent(account).call()
    const sum = normalizeValue(balanceSmall) + normalizeValue(balanceBig)
    const latestProposalIds = await PROPOSALS_TOKEN_CONTRACT.methods.latestProposalIds(account).call()
    if (latestProposalIds != 0) {
      const stateLatestProposalIds = PROPOSALS_TOKEN_CONTRACT.methods
        .state(latestProposalIds)
        .call()
        .then(res => {
          if (stateLatestProposalIds == 1) {
            setDisableButtonCreateProposal(true)
          }
        })
        .catch(err => console.error(err))
    }

    const freeCirculation = await DELEGATIES_TOKEN_CONTRACT.methods.freeCirculation().call()
    const delegated = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(account).call()

    let warningStaking = false
    let warningVoting = false

    if (delegated < (freeCirculation * 1) / 100) {
      warningVoting = true
    } else {
      if (sum < normalizeValue(freeCirculation) / 1000) warningStaking = true
    }

    setShowBannerStaking(warningStaking)
    setShowBannerVoting(warningVoting)
  }

  useEffect(() => {
    if (account !== null) {
      accessOrError()
    }
  }, [account])

  const initCheckHardStakingValue = async () => {
    // нужно разобраться
    const balanceSmall = await LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT.methods.balanceOfRewardEquivalent(account).call()
    const balanceBig = await LOCK_STAKING_GNBU_HARD_BIG_CONTRACT.methods.balanceOfRewardEquivalent(account).call()
    const balanceProposal = await PROPOSALS_TOKEN_CONTRACT.methods.proposalStakeThreshold().call()
    const balance = await DELEGATIES_TOKEN_CONTRACT.methods.balanceOf(account).call()
    const sum = normalizeValue(balanceSmall) + normalizeValue(balanceBig)
    const percent = (sum / normalizeValue(balanceProposal)) * 100
    percent > 0.1 && setAccessForEditProposal(false)
    // percent < 0.1 && setErrorBlock(true) // depracated
    // balance < 0.1 && setErrorBlock(true) // depracated
    // percent < 1 && setVoteRights(false) // depracated
  }

  const getChangeCancelProposal = async addressProposer => {
    const free = await DELEGATIES_TOKEN_CONTRACT.methods.freeCirculation().call()
    const current = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(addressProposer).call()
    const balance = await DELEGATIES_TOKEN_CONTRACT.methods.balanceOf(addressProposer).call()

    const balanceHardSmall = await LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT.methods.balanceOf(addressProposer).call()
    const balanceHardBig = await LOCK_STAKING_GNBU_HARD_BIG_CONTRACT.methods.balanceOf(addressProposer).call()
    // for test
    const balanceSoft = await LOCK_STAKING_CONTRACT_SOFT.methods.balanceOf(addressProposer).call()
    const freeCirculationGNBU = await GNBU_TOKEN_CONTRACT.methods.freeCirculation().call()
    const calculateProcent = (sum, num) => {
      return ((num / sum) * 100)?.toFixed(2)
    }

    const isDelegate =
      +calculateProcent(free, balance) +
      (current == 0 ? 0 : +calculateProcent(free, current)) -
      (current == 0 ? 0 : +calculateProcent(free, balance)) >
      1
    // for test
    const sum = +normalizeValue(balanceHardSmall) + +normalizeValue(balanceHardBig) + +normalizeValue(balanceSoft)
    // for product
    // const sum = +normalizeValue(balanceHardSmall) + +normalizeValue(balanceHardBig)
    const minFree = normalizeValue(freeCirculationGNBU) / 1000
    const isStaking = sum <= minFree

    return isDelegate && isStaking
  }

  const init = async () => {
    const arr = []
    const proposalCount = await PROPOSALS_TOKEN_CONTRACT.methods.proposalCount().call()
    const freeCirculation = await DELEGATIES_TOKEN_CONTRACT.methods.freeCirculation().call()
    for (let i = proposalCount; i > 0; --i) {
      const getActions = await PROPOSALS_TOKEN_CONTRACT.methods.getActions(i).call()
      const proposals = await PROPOSALS_TOKEN_CONTRACT.methods.proposals(i).call()
      const procentSumVotes =
        ((normalizeValue(proposals.forVotes) + normalizeValue(proposals.againstVotes)) /
          normalizeValue(freeCirculation)) *
        100
      const state = await PROPOSALS_TOKEN_CONTRACT.methods.state(i).call()
      const block = await web3.eth.getBlock(proposals.endBlock)
      const diffBlock = proposals.startBlock - proposals.endBlock
      const daysLeft = new Date(block?.timestamp * 1000).getDay() - new Date().getDay()
      const daysEnd = Math.abs((diffBlock * 15) / 60 / 60 / 24)

      const ms = (proposals.endBlock - (await web3.eth.getBlockNumber())) * 15 * 1000
      const timeEnd = new Date()
      timeEnd.setMilliseconds(timeEnd.getMilliseconds() + ms)

      const requestOptions = {
        method: 'GET'
      }

      let item = {}
      let cancelProposal = false
      if (state == 1) {
        cancelProposal = await getChangeCancelProposal(proposals.proposer)
      }

      await fetch(`https://api.nimbus.mng.ninja/api/v3/voting?votingId=${i}&chainId=${chainId}`, requestOptions)
        .then(response => response.text())
        .then(result => {
          const data = JSON.parse(result)
          item = {
            id: proposals.id,
            description: '',
            daysLeft: daysLeft == 0 ? '-' : daysLeft < 0 ? '-' : daysLeft,
            daysEnd,
            votes: normalizeValue(proposals.forVotes) + normalizeValue(proposals.againstVotes),
            forVotes: normalizeValue(proposals.forVotes),
            againstVotes: normalizeValue(proposals.againstVotes),
            status: state,
            proposer: proposals.proposer,
            procentSumVotes: `${procentSumVotes.toFixed(2)}%`,
            timeEnd,
            cancelProposal,
            title: ''
          }
          if (data.success) {
            const text = data?.data?.text
            const title = data?.data?.title
            try {
              if (JSON.parse(text)) {
                const jsontext = JSON.parse(text)
                item.description = jsontext.blocks[0].text
                item.title = title
              }
            } catch (error) {
              item.description = text
              item.title = title
            }
          } else {
            item.description = ''
          }
        })
        .catch(error => {
          item = {
            id: proposals.id,
            description: '',
            daysLeft: daysLeft == 0 ? '-' : daysLeft < 0 ? '-' : daysLeft,
            daysEnd,
            votes: normalizeValue(proposals.forVotes) + normalizeValue(proposals.againstVotes),
            forVotes: normalizeValue(proposals.forVotes),
            againstVotes: normalizeValue(proposals.againstVotes),
            status: state,
            proposer: proposals.proposer,
            procentSumVotes: `${procentSumVotes.toFixed(2)}%`,
            timeEnd,
            cancelProposal,
            title: ''
          }
          console.error('error', error)
        })
      arr.push(item)
      setData(arr)
    }
    setShowLoading(false)
    if (!arr.length) {
      setShowList(false)
    }
    const currentVotes = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(account).call()
    const participationToken = await PROPOSALS_TOKEN_CONTRACT.methods.participationThreshold().call()

    if (normalizeValue(participationToken) < normalizeValue(currentVotes)) setAccessForEditProposal(false)
    initCheckHardStakingValue()
  }

  useEffect(() => {
    if (account !== null) {
      init()
    }
  }, [])

  useEffect(() => {
    if (account !== null) {
      setDisableDelegation(false)
      // init()
      setIsOpenDelegationModal(false)
    }
  }, [account])

  const TitleBlock = () => (
    <>
      <TitleContainer>{t('voting.nimbusDAO')}</TitleContainer>
      <p style={{ fontSize: 24, marginBottom: 40, lineHeight: '32px', maxWidth: '750px', margin: ' 0 0 35px' }}>
        {t('voting.nimbusDAODescription')}
      </p>
    </>
  )

  const VotingBanner = () => (
    <ErrorContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>{t('voting.notEnoughVotingRights')}</span>
        {/* <Circle>?</Circle> */}
      </div>

      <p>{t('voting.notEnoughVotingRightsDescription')}</p>
    </ErrorContainer>
  )

  const StakingBanner = () => (
    <ErrorContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>{t('voting.notEnoughGNBUInStaking')}</span>
        {/* <Circle>?</Circle> */}
      </div>

      <p>{t('voting.notEnoughGNBUInStakingDescription')}</p>
    </ErrorContainer>
  )

  return (
    <>
      <VotingWrapper gap={'16px'}>
        {!isMobileOnly && <TitleBlock />}
        {showBannerVoting ? <VotingBanner /> : showBannerStaking && <StakingBanner />}
        <StyledRowBetween>
          <SortSelectWrap style={{ visibility: 'visible' }}>
            <SortSelect className={'at-click at-srt-date'} defaultValue="" name="test" id="">
              <option value="" disabled hidden>
                {t('voting.sortByDate')}
              </option>
              <option className={'at-click at-dd-srt-date-votes'} value="1">
                {t('voting.votes')}
              </option>
              <option className={'at-click at-dd-srt-date-name'} value="2">
                {t('voting.name')}
              </option>
              <option className={'at-click at-dd-srt-date-id'} value="3">
                {t('voting.id')}
              </option>
            </SortSelect>
          </SortSelectWrap>
          <ButtonWrapper>
            {/*<ButtonPrimary*/}
            {/*  className={'at-click at-new-delegration'}*/}
            {/*  disabled={disableDelegation}*/}
            {/*  style={{ padding: '13px', width: '148px', marginRight: '20px', backgroundColor: '#616161' }}*/}
            {/*  onClick={() => {*/}
            {/*    setIsOpenDelegationModal(prevState => !prevState)*/}
            {/*    //@ts-ignore */}
            {/*    window.dataLayer.push({ */}
            {/*      'event': `process_start`, */}
            {/*      'process': `Voting New delegation`, */}
            {/*      'step_name': `Create new proposal` */}
            {/*    })*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <TYPE.white fontWeight={600} fontSize={14}>*/}
            {/*    {t('voting.newDelegation')}*/}
            {/*  </TYPE.white>*/}
            {/*</ButtonPrimary>*/}
            <ButtonPrimary
              onClick={() => {
                //@ts-ignore
                window.dataLayer.push({
                  event: `process_start`,
                  process: `Voting create new proposal`,
                  step_name: `Create new proposal`
                })
              }}
              className={'at-click at-crt-proposal'}
              as={Link}
              to="/voting/create"
              style={{ padding: '13px', width: '180px' }}
            >
              <TYPE.white fontWeight={600} fontSize={14}>
                {t('voting.createNewProposal')}
              </TYPE.white>
            </ButtonPrimary>
            {/* {showBannerStaking || showBannerVoting ? (
              <ButtonPrimary
                disabled={true}
                style={{
                  padding: '13px',
                  width: '180px',
                  backgroundColor: 'rgba(97,97,97,1)'
                }}
              >
                <TYPE.white fontWeight={600} fontSize={14}>
                  {t('Create new proposal')}
                </TYPE.white>
              </ButtonPrimary>
            ) : accessForEditProposal ? (
              <ButtonPrimary
                disabled={disableButtonCreateProposal ? true : !accessForEditProposal}
                style={{
                  padding: '13px',
                  width: '180px',
                  backgroundColor: accessForEditProposal && !showBannerStaking && 'rgba(97,97,97,1)'
                }}
              >
                <TYPE.white fontWeight={600} fontSize={14}>
                  {t('Create new proposal')}
                </TYPE.white>
              </ButtonPrimary>
            ) : disableButtonCreateProposal ? (
              <ButtonPrimary
                disabled={true}
                style={{
                  padding: '13px',
                  width: '180px',
                  backgroundColor: 'rgba(97,97,97,1)'
                }}
              >
                <TYPE.white fontWeight={600} fontSize={14}>
                  {t('Create new proposal')}
                </TYPE.white>
              </ButtonPrimary>
            ) : (
              <ButtonPrimary as={Link} to="/voting/create" style={{ padding: '13px', width: '180px' }}>
                <TYPE.white fontWeight={600} fontSize={14}>
                  {t('Create new proposal')}
                </TYPE.white>
              </ButtonPrimary>
            )} */}
          </ButtonWrapper>
        </StyledRowBetween>

        {showLoading ? (
          <Loading>
            {/* <Loader stroke="white" style={{ marginRight: '10px' }} /> */}
            {/* <p>{'Loading'}</p> */}
            <NoWalletMessage>{t('voting.weAreWaitingUntilYouConnectToWallet')}</NoWalletMessage>
          </Loading>
        ) : showList ? (
          <ListHeader>
            <div>ID</div>
            <div>{t('voting.description')}</div>
            <div></div>
            <div>{t('voting.daysLeft')}</div>
            <div>{t('voting.votes')}</div>
            <div>{t('voting.voted')}</div>
            <div>{t('voting.status')}</div>
          </ListHeader>
        ) : (
          <EmptyList>{t('voting.thereAreNoProposalsCreateYouOwn')}</EmptyList>
        )}

        {data.map((el, i) => {
          return <Proposal key={i} data={el} />
        })}
      </VotingWrapper>
    </>
  )
}

export default ProposalList

const VotingWrapper = styled(AutoColumn)`
  /*display: flex;*/
  /*display: grid;*/
  position: relative;
  /* top: 155px; */
  flex-direction: column;
  /*styles above for fixed position*/
  /* width: 1013px; */
  max-width: 931px;
  //margin-top: -40px;
  padding-bottom: 32px;
`

const TitleContainer = styled.h1`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 48px;
  margin: 0 0 16px 0;

  img {
    margin-left: 10px;
  }
`

const SortSelectWrap = styled.div`
  position: relative;
  &:after {
    content: '';
    display: block;
    width: 14px;
    height: 8px;
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    background: url('${ArrowIcon}')
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 20px;
  `};
`

const ButtonWrapper = styled(RowFlat)`
  float: 'right';
  @media (max-width: 721px) {
    width: 100%;
    justify-content: space-between;
  }
`

const SortSelect = styled.select`
  width: 204px;
  height: 46px;
  background: #343434;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  padding: 14px 23px;
  -webkit-appearance:none;
  -moz-appearance:none;
  appearance:none;
  font-family: 'IBM Plex Sans',sans-serif;
  &:after {
    content: '';
    display: block;
    width: 12px;
    height: 6px;
    background: url('${ArrowIcon}')
  }
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  background: #eb491d;
  border-radius: 20px;

  span {
    font-size: 20px;
    font-weight: 600;
  }
`

const Circle = styled.div`
  width: 24px;
  height: 24px;
  background: #000;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  font-size: 15px;
  color: #fff;
  font-weight: 700;
  text-align: center;
`

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  p {
  font-size: 20px;
  line-height: 32px;
  color: #8E8E8E;
  }
`
const NoWalletMessage = styled.p`
  font-weight: 600;
  border: 1px solid #cb4304;
  padding: 10px 20px;
  border-radius: 10px;
`

const ListHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
  /* grid-template-columns: 63px 299px 175px 89px 123px 123px 93px; */
  grid-template-columns: 6.53% 30.98% 18.13% 9.22% 12.75% 12.75% 9.64%;
  align-items: center;
  padding: 0px 24px;
  font-size: 13px;
  color: rgb(142, 142, 142);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

const EmptyList = styled.p`
  font-size: 20px;
  line-height: 32px;
  color: #8e8e8e;
  text-align: center;
`

const StyledRowBetween = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column-reverse;
  `};
`
