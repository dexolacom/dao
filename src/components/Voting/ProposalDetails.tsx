// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import Web3 from 'web3'
import styled from 'styled-components'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertFromRaw } from 'draft-js'

import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { ButtonLight } from '../../components/Button'

import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'

import GOVERNOR_V1_ABI from '../../constants/proposals/governorV1ABI.json'
import GNBU from '../../constants/proposals/gnbu.json'

import { ProposalStatus } from './ProposalStatus'
import { normalizeValue, calculatePercent } from './helpers'
import Loader from '../../components/Loader'

const ProposalDetails = () => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()

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
  const [viewVote, setViewVote] = useState(false)
  const [data, setData] = useState({
    proposer: null,
    forVotes: null,
    againstVotes: null,
    userVoted: false,
    forVotesPercent: 0,
    againstVotesPercent: 0,
    description: undefined,
    viewVote,
    title: '',
    decodeCallData: []
  })
  const [isVisible, setIsVisible] = useState(false)
  const [accessForEditProposal, setAccessForEditProposal] = useState(true)
  const [error, setError] = useState(null)
  // const [loading, setLoading] = useState(false)
  const [loadingVoteFor, setLoadingVoteFor] = useState(false)
  const [loadingVoteAgainst, setLoadingVoteAgainst] = useState(false)
  const match = useRouteMatch()

  const init = async () => {
    const proposal = await PROPOSALS_TOKEN_CONTRACT.methods.proposals(match.params.idProposal).call()
    const priorVotes = await GNBU_TOKEN_CONTRACT.methods.getPriorVotes(account, proposal.startBlock).call()
    const state = await PROPOSALS_TOKEN_CONTRACT.methods.state(match.params.idProposal).call()
    const getReceipt = await PROPOSALS_TOKEN_CONTRACT.methods.getReceipt(match.params.idProposal, account).call()
    const getActions = await PROPOSALS_TOKEN_CONTRACT.methods.getActions(match.params.idProposal).call()
    const currentVotes = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(account).call()
    const participationToken = await PROPOSALS_TOKEN_CONTRACT.methods.participationThreshold().call()
    if (normalizeValue(participationToken) < normalizeValue(currentVotes)) setAccessForEditProposal(false)
    // const proposals = await PROPOSALS_TOKEN_CONTRACT.methods.proposals(i).call()
    const createBlock = await web3.eth.getBlock(proposal.startBlock)
    const dateCreate = new Date(createBlock?.timestamp * 1000)

    const freeCirculation = await DELEGATIES_TOKEN_CONTRACT.methods.freeCirculation().call()

    if (priorVotes < (freeCirculation * 1) / 100) {
      setViewVote(false)
    } else {
      if (sum < normalizeValue(freeCirculation) / 1000) warningStaking = true
    }

    const block = await web3.eth.getBlock(proposal.endBlock)
    const diffBlock = proposal.startBlock - proposal.endBlock
    const daysLeft = new Date(block?.timestamp * 1000).getDay() - new Date().getDay()
    const daysEnd = (diffBlock * 15) / 60 / 60 / 24

    const ms = (proposal.endBlock - (await web3.eth.getBlockNumber())) * 15 * 1000
    const timeEnd = new Date()

    const signaturValue = []
    const callDataValue = getActions.calldatas
    const length = getActions.calldatas.length
    const regex = /\((.*?)\)/
    getActions.signatures.map(el => {
      const val = regex.exec(el)
      signaturValue.push(val[1].split(','))
    })

    const decode = []
    for (let i = 0; i < length; i++) {
      const lengthSub = signaturValue[i].length
      const typesArray = []
      const hexString = callDataValue[i]
      for (let r = 0; r < lengthSub; r++) {
        typesArray.push(signaturValue[i][r])
      }
      decode.push(web3.eth.abi.decodeParameters(typesArray, hexString))
    }

    timeEnd.setMilliseconds(timeEnd.getMilliseconds() + ms)

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    const date = `
      ${monthNames[timeEnd.getUTCMonth()]} ${timeEnd.getUTCDate()}, ${timeEnd.getUTCFullYear()}, 
      ${timeEnd.getHours()}:${timeEnd.getUTCMinutes()}`

    const item = {
      proposer: proposal.proposer,
      forVotes: proposal.forVotes,
      againstVotes: proposal.againstVotes,
      forVotesPercent: calculatePercent(proposal.forVotes, proposal.againstVotes, 'left'),
      againstVotesPercent: calculatePercent(proposal.forVotes, proposal.againstVotes, 'right'),
      userVoted: getReceipt.hasVoted,
      status: state,
      viewVote: getReceipt.hasVoted == false && state == 1 ? true : false,
      date,
      getActions,
      timeEnd,
      decodeCallData: decode
    }

    const requestOptions = {
      method: 'GET'
    }
    await fetch(
      `https://api.nimbus.mng.ninja/api/v3/voting?votingId=${match.params.idProposal}&chainId=${chainId}`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        const a = JSON.parse(result)?.data?.text
        const title = JSON.parse(result)?.data?.title
        try {
          item.description = EditorState.createWithContent(convertFromRaw(JSON.parse(a)))
          item.title = title
        } catch (error) {
          console.error(error)
          item.description = EditorState.createEmpty()
          item.title = title
        }
        setData({ ...item })
      })
      .catch(err => {
        setData({ ...item })
        console.error(err)
      })
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (data.status == 1 && data.userVoted == false) {
      setIsVisible(false)
    } else if (data.status !== 1) {
      setIsVisible(true)
    }
  }, [data])

  const castVote = async bool => {
    !bool && setLoadingVoteAgainst(true)
    bool && setLoadingVoteFor(true)
    await PROPOSALS_TOKEN_CONTRACT.methods
      .castVote(match.params.idProposal, bool)
      .send({
        from: account
      })
      .on('transactionHash', function() {
        !bool && setLoadingVoteAgainst(true)
        bool && setLoadingVoteFor(true)
      })
      .on('receipt', function() {
        setLoadingVoteFor(false)
        setLoadingVoteAgainst(false)
        init()
      })
      .on('error', function(error, receipt) {
        setLoadingVoteFor(false)
        setLoadingVoteAgainst(false)
        console.error('error', error, 'receipt', receipt)
      })
  }

  // const execute = async () => {
  //   await PROPOSALS_TOKEN_CONTRACT.methods
  //     .execute(match.params.idProposal)
  //     .send({
  //       from: account
  //     })
  //     .on('receipt', function(receipt) {
  //     })
  //     .on('error', function(error, receipt) {
  //       console.error('error', error, 'receipt', receipt)
  //     })
  // }

  const {
    proposer,
    forVotesPercent,
    againstVotesPercent,
    status,
    userVoted,
    description,
    // viewVote,
    forVotes,
    againstVotes,
    date,
    getActions,
    timeEnd,
    title,
    decodeCallData
  } = data

  const DecodeCallDataView = () => {
    return (
      <div>
        Calldatas:
        {decodeCallData?.map(obj => {
          return (
            <span key={obj}>
              {' '}
              {obj[0] && obj[0]}, {obj[1] && obj[1]}
              <br />
            </span>
          )
          // return <span>{el[0]}<br /></span>
        })}
      </div>
    )
  }

  return (
    <Container>
      <BackButton className={'at-click at-pp-proposal-btn-back'} as={Link} to="/voting">
        <ArrowLeft size="18" />
      </BackButton>
      <LightCardResponsive>
        <AutoColumn gap={'20px'}>
          <RowBetweenResponsive>
            <AutoColumn gap={'80px'}>
              <TYPE.white fontSize={20}>{title}</TYPE.white>
            </AutoColumn>
            <div style={{ display: 'flex' }}>
              {/* {+status === 4 && (
                <AutoColumn gap={'50px'}>
                  <ButtonContainer>
                    <VoteLightButton
                      onClick={execute}
                      style={{
                        width: '93px',
                        height: '24px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        margin: '0 0 0 100px'

                        // display: flex;
                        // justify-content: center;
                        // align-items: center;
                      }}
                    >
                      Execute
                    </VoteLightButton>
                  </ButtonContainer>
                </AutoColumn>
              )} */}
              <AutoColumn gap={'50px'}>
                <ProposalStatus status={status} />
              </AutoColumn>
            </div>
          </RowBetweenResponsive>
          <RowBetween>
            {timeEnd < new Date() ? t('voting.votingIsEnd') : t('voting.votinIsEndApproximately')} {date ? date : ''}
          </RowBetween>
          <StyledRowBetween>
            {viewVote && (
              <VoteLightButton
                onClick={() => castVote(true)}
                style={{ backgroundColor: '#3DD598', marginRight: '20px' }}
              >
                <TYPE.white fontWeight={600} fontSize={14}>
                  {loadingVoteFor ? (
                    <>
                      <Loader stroke="white" style={{ marginRight: '10px' }} />
                      {t('voting.voteFor')}
                    </>
                  ) : (
                    t('voting.voteFor')
                  )}
                </TYPE.white>
              </VoteLightButton>
            )}

            {+status === 4 ? (
              <ProposalVoteCard>
                <VoteResultWrapper>
                  <TYPE.white fontWeight={600} fontSize={14}>
                    <span style={{ float: 'left' }}>{t('voting.for')}</span>
                    <span style={{ float: 'right' }}>{normalizeValue(forVotes)}</span>
                  </TYPE.white>
                  <VoteProgressBar progress={forVotesPercent} color={'#3DD598'} />
                </VoteResultWrapper>

                {/* <TYPE.main fontSize={16} color={'#8E8E8E'} fontWeight={400}>
                  {normalizeValue(forVotes)} GNBU
                </TYPE.main> */}
              </ProposalVoteCard>
            ) : isVisible ? (
              <ProposalVoteCard>
                <VoteResultWrapper>
                  <TYPE.white fontWeight={600} fontSize={14}>
                    <span style={{ float: 'left' }}>{t('voting.for')}</span>
                    <span style={{ float: 'right' }}>{normalizeValue(forVotes)}</span>
                  </TYPE.white>
                  <VoteProgressBar progress={forVotesPercent} color={'#3DD598'} />
                </VoteResultWrapper>
              </ProposalVoteCard>
            ) : null}

            {viewVote && (
              <VoteLightButton onClick={() => castVote(false)}>
                <TYPE.white fontWeight={600} fontSize={14}>
                  {loadingVoteAgainst ? (
                    <>
                      <Loader stroke="white" style={{ marginRight: '10px' }} />
                      {t('voting.voteAgainst')}
                    </>
                  ) : (
                    t('voting.voteAgainst')
                  )}
                </TYPE.white>
              </VoteLightButton>
            )}
            {+status === 4 ? (
              <ProposalVoteCard>
                <VoteResultWrapper>
                  <TYPE.white fontWeight={600} fontSize={14}>
                    <span style={{ float: 'left' }}>{t('voting.against')}</span>
                    <span style={{ float: 'right' }}>{normalizeValue(againstVotes)}</span>
                  </TYPE.white>
                  <VoteProgressBar progress={againstVotesPercent} color={'#E44B05'} />
                </VoteResultWrapper>

                {/* <TYPE.main fontSize={16} color={'#8E8E8E'} fontWeight={400}>
                  {normalizeValue(againstVotes)} GNBU
                </TYPE.main> */}
              </ProposalVoteCard>
            ) : isVisible ? (
              <ProposalVoteCard>
                <VoteResultWrapper>
                  <TYPE.white fontWeight={600} fontSize={14}>
                    <span style={{ float: 'left' }}>{t('voting.against')}</span>
                    <span style={{ float: 'right' }}>{normalizeValue(againstVotes)}</span>
                  </TYPE.white>
                  <VoteProgressBar progress={againstVotesPercent} color={'#E44B05'} />
                </VoteResultWrapper>
              </ProposalVoteCard>
            ) : null}
          </StyledRowBetween>

          <Break />

          <AutoColumn gap={'32px'}>
            <AutoColumn gap={'16px'}>
              <TYPE.mediumHeader>{t('Details')}</TYPE.mediumHeader>
              <TYPE.body style={{ wordBreak: 'break-all' }}>
                {t('voting.address')}: {getActions?.targets.join(', ')}
              </TYPE.body>
              <TYPE.body>
                {t('voting.signatures')}: {getActions?.signatures.join(', ')}
              </TYPE.body>
              <TYPE.body style={{ wordBreak: 'break-all' }}>
                {/* Calldatas: {getActions?.calldatas && */}
                {/*  getActions?.calldatas[0].slice(0, 19) + '...' + getActions?.calldatas[0].slice(-19)}*/}
                {/* {getActions?.calldatas.join(', ')} */}
                <DecodeCallDataView />
              </TYPE.body>
            </AutoColumn>

            <AutoColumn gap={'16px'}>
              <TYPE.mediumHeader>{t('voting.description')}</TYPE.mediumHeader>
              <StyledEditor
                editorState={description}
                toolbarClassName={{ display: 'none' }}
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                toolbarHidden={true}
                editorStyle={{
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}
              />
            </AutoColumn>

            <AutoColumn gap={'16px'}>
              <TYPE.mediumHeader>{t('voting.proposer')}</TYPE.mediumHeader>
              <TYPE.body style={{ wordBreak: 'break-all' }}>{proposer}</TYPE.body>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </LightCardResponsive>
    </Container>
  )
}

export default ProposalDetails

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  text-align: center;
`

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const BackButton = styled.div`
  position: absolute;
  top: 0;
  left: -72px;
  width: 48px;
  height: 48px;
  border-radius: 100%;
  background: #343434;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const ProposalVoteCard = styled(LightCard)`
  width: 261px;
  border-radius: 24px;
  padding: 0px;
  text-align: center;
  border: none;
  margin: 0px;
`

export const VoteLightButton = styled(ButtonLight)`
  width: 100%;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  margin-bottom: 20px;
`

const VoteResultWrapper = styled.div`
  width: 100%;
  padding: 12px 12px 14px;
  background: #282828;
  border-radius: 8px;
  margin-bottom: 20px;
`

const VoteProgressBar = styled.div<{ progress; color }>`
  width: 100%;
  height: 7px;
  background: #343434;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 35px;
  &:after {
    content: '';
    display: block;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background: ${({ color }) => color};
  }
`

export const Break = styled.div`
  width: 100%;
  background-color: #282828;
  height: 1px;
`

const StyledEditor = styled(Editor)`
  &.rdw-editor-toolbar {
    display: none !important;
  }
`

const LightCardResponsive = styled(LightCard)`
  width: 590px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 500px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 370px;
  `};
`

const RowBetweenResponsive = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: row;
  `};
`

const StyledRowBetween = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`
