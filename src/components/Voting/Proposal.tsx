// @ts-nocheck
import React, { SyntheticEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Web3 from 'web3'
import { useTranslation } from 'react-i18next'

import { LightCard } from '../../components/Card'
import { TYPE } from '../../theme'
import { ProposalStatus } from './ProposalStatus'
import { VoteLightButton } from './ProposalDetails'
import GOVERNOR_V1_ABI from '../../constants/proposals/governorV1ABI.json'
import { useActiveWeb3React } from '../../hooks'

type ProposalType = {
  data: {
    id: number
    votes: number | string
    procentSumVotes: string
    status: number | string
    timeEnd: Date
    cancelProposal: boolean
    title: string
  }
}

const Proposal = ({ data: { id, votes, procentSumVotes, status, timeEnd, cancelProposal, title } }: ProposalType) => {
  const history = useHistory()
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const [windowInnerSize, setWindowInnerSize] = useState('desktop')

  const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)
  const PROPOSALS_TOKEN_CONTRACT = new web3.eth.Contract(
    GOVERNOR_V1_ABI as any,
    chainId == 97 || chainId == 56
      ? '0x285432B4679c8Cd6E96E4214fC49aEeD1108B77b'
      : process.env.REACT_APP_PROPOSALS_TOKEN_CONTRACT
  )

  const handelCancel = async (e: SyntheticEvent) => {
    e.stopPropagation()
    await PROPOSALS_TOKEN_CONTRACT.methods
      .cancel(id)
      .send({
        from: account
      })
      .on('error', (error: any, receipt: any) => {
        console.error('error', error, 'receipt', receipt) //error.message
      })
  }

  const execute = async (e: SyntheticEvent) => {
    e.stopPropagation()
    await PROPOSALS_TOKEN_CONTRACT.methods
      .execute(id)
      .send({
        from: account
      })
      .on('error', (error: any, receipt: any) => {
        console.error('error', error, 'receipt', receipt)
      })
  }

  const linkTo = () => {
    history.push(`/voting/${id}`)
  }

  function SetWindowInnerSize() {
    if (window.innerWidth <= 960) {
      setWindowInnerSize('mobile')
    } else if (window.innerWidth > 960) {
      setWindowInnerSize('desktop')
    }
  }

  useEffect(() => {
    if (window.innerWidth <= 960) {
      setWindowInnerSize('mobile')
    }

    window.addEventListener('resize', SetWindowInnerSize)

    return function deleteResizeHandler() {
      window.removeEventListener('resize', SetWindowInnerSize)
    }
  }, [])

  return windowInnerSize === 'desktop' ? (
    <>
      <HoverLightCard
        className={`at-click at-choose-proposal-${id}`}
        onClick={() => linkTo()}
        style={{ padding: '16px 24px', border: 'none', background: '#343434', cursor: 'pointer' }}
      >
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            /* gridTemplateColumns: '63px 299px 175px 89px 123px 123px 93px', */
            gridTemplateColumns: '6.53% 30.98% 18.13% 9.22% 12.75% 12.75% 9.64%',
            alignItems: 'center'
          }}
        >
          <div>
            <TYPE.white fontWeight={500} fontSize={18}>
              {id}
            </TYPE.white>
          </div>
          <div>
            <TYPE.white fontWeight={500} fontSize={18}>
              {title}
            </TYPE.white>
          </div>
          <div>
            {+status === 4 && (
              <VoteLightButton
                onClick={e => execute(e)}
                style={{
                  width: '75px',
                  height: '24px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  margin: '0 5px 0 0',
                  float: 'left'
                }}
              >
                {t('voting.execute')}
              </VoteLightButton>
            )}
            {cancelProposal && (
              <VoteLightButton
                onClick={e => handelCancel(e)}
                style={{
                  width: '75px',
                  height: '24px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  margin: '0 0 0 0'
                }}
              >
                {t('voting.cancel')}
              </VoteLightButton>
            )}
          </div>
          <div>
            <TYPE.white fontWeight={400} fontSize={14}>
              {timeEnd.getTime() - new Date().getTime() > 0 ? timeEnd.getDate() - new Date().getDate() : '-'}
            </TYPE.white>
          </div>
          <div>
            <TYPE.white fontWeight={400} fontSize={14}>
              {votes}
            </TYPE.white>
          </div>
          <div>
            <TYPE.white fontWeight={400} fontSize={14}>
              {procentSumVotes}
            </TYPE.white>
          </div>
          <div>
            <ProposalStatus status={status} />
          </div>
        </div>
      </HoverLightCard>
    </>
  ) : (
    <>
      <HoverLightCardMobile
        className={`at-click at-choose-proposal-${id}`}
        onClick={() => linkTo()}
        style={{ padding: '16px 24px', border: 'none', background: '#343434', cursor: 'pointer' }}
      >
        <RowInfo>
          <div>
            <TYPE.white fontWeight={500} fontSize={18}>
              {title}
            </TYPE.white>
          </div>
          <div>
            <ProposalStatus status={status} />
          </div>
        </RowInfo>
        <RowInfo style={{ fontSize: '14px' }}>
          <div>
            <TYPE.white fontWeight={400} fontSize={14}>
              <span style={{ color: '#8E8E8E' }}>{t('voting.daysLeft')}:</span>{' '}
              {timeEnd.getTime() - new Date().getTime() > 0 ? timeEnd.getDate() - new Date().getDate() : '-'}
            </TYPE.white>
          </div>
          <div>
            <TYPE.white fontWeight={400} fontSize={14}>
              <span style={{ color: '#8E8E8E' }}>{t('voting.votesL')}</span> {votes}
            </TYPE.white>
          </div>
        </RowInfo>
        <RowInfo style={{ justifyContent: 'center', marginBottom: '0' }}>
          <div>
            {+status === 4 && (
              <VoteLightButton
                onClick={e => execute(e)}
                style={{
                  width: '75px',
                  height: '24px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  margin: '0 5px 0 0',
                  float: 'left'
                }}
              >
                {t('voting.execute')}
              </VoteLightButton>
            )}
            {cancelProposal && (
              <VoteLightButton
                onClick={e => handelCancel(e)}
                style={{
                  width: '75px',
                  height: '24px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  margin: '0 0 0 0'
                }}
              >
                {t('voting.cancel')}
              </VoteLightButton>
            )}
          </div>
        </RowInfo>
      </HoverLightCardMobile>
    </>
  )
}

export default Proposal

const HoverLightCard = styled(LightCard)`
  text-decoration: none;
  :hover {
    transform: scale(1.02);
  }
`

const HoverLightCardMobile = styled(LightCard)`
  text-decoration: none;
  :hover {
    transform: scale(1.02);
  }
`

const RowInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`
