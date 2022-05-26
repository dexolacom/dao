// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Web3 from 'web3'
import close from '../../assets/images/close.svg'

import Modal from '../../components/Modal'
import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { ButtonPrimary, ButtonLight } from '../../components/Button'
import AddressInputPanel from '../../components/AddressInputPanel'
import Loader from '../../components/Loader'

import { TYPE } from '../../theme'
import { useActiveWeb3React } from '../../hooks'
import GNBU from '../../constants/proposals/gnbu.json'

import { normalizeValue } from './helpers'
import ArrowIcon from '../../assets/svg/dropdownArrow.svg'

interface Votes {
  totalBalance: number
  freeCirulation: number
  totalBalance: number
  freeCirculation: number
  getCurrentVotes: number
  getCurrentVotesProcent: number
  balanceOf: number
  balanceOfProcent: number
  accessDelegate: boolean
  ownCount: number
  delegatedCount: 0
  delegatesSelf: void
  delegatedToOthers: 0
}

declare type Props = {
  isOpenDelefationModal: boolean
  setIsOpenDelefationModal: (a: boolean) => void
}

const DelegationModal: React.FC<Props> = ({ isOpenDelefationModal, setIsOpenDelefationModal }) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_NETWORK_URL)
  const DELEGATIES_TOKEN_CONTRACT = new web3.eth.Contract(
    GNBU as any,
    chainId == 97 || chainId == 56
      ? '0xA4d872235dde5694AF92a1d0df20d723E8e9E5fC'
      : process.env.REACT_APP_DELEGATIES_TOKEN_CONTRACT
  )

  const isBinance: boolean = chainId === 97 || chainId === 56

  const [addressInput, setAddressInput] = useState<string>('')
  const [showAddDelegate, setShowAddDelegate] = useState<boolean>(false)
  const [votes, setVotes] = useState<Votes>({
    totalBalance: 0,
    freeCirculation: 0,
    getCurrentVotes: 0,
    getCurrentVotesProcent: 0,
    balanceOf: 0,
    balanceOfProcent: 0,
    accessDelegate: false,
    ownCount: 0,
    delegatedCount: 0,
    delegatesSelf: null,
    delegatedToOthers: 0
  })
  const [errorDelegate, setErrorDelegate] = useState<boolean>(false)
  const [completedDelegate, setCompletedDelegate] = useState<boolean>(false)
  const [completedRecipientDelegate, setCompletedRecipientDelegate] = useState<boolean>(false)
  const [isFetchingDelegate, setIsFetchingDelegate] = useState<boolean>(false)
  const [successfulDelegatedAddress, setSuccessfulDelegatedAddress] = useState<boolean>(false)
  const [successfulDelegatedAddressForView, setSuccessfulDelegatedAddressForView] = useState<boolean>(false)
  const [openSubInfo, setOpenSubInfo] = useState<boolean>(false)
  const [errorInput, setErrorInput] = useState<boolean>(true)
  const totalProcent = votes.balanceOfProcent + votes.getCurrentVotesProcent
  // additional functions
  const calculateProcent = (sum, num) => {
    return ((num / sum) * 100)?.toFixed(2)
  }

  // clean initial state
  const closeModal: () => void = () => {
    setIsOpenDelefationModal(false)
    setErrorDelegate(false)
    setShowAddDelegate(false)
    setErrorDelegate(false)
    setCompletedDelegate(false)
    setCompletedRecipientDelegate(false)
    setSuccessfulDelegatedAddress(false)
  }

  // initail data
  const getBalance = async () => {
    let free = await DELEGATIES_TOKEN_CONTRACT.methods.freeCirculation().call()
    let current = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(account).call()
    let balance = await DELEGATIES_TOKEN_CONTRACT.methods.balanceOf(account).call()
    let totalBalance = await DELEGATIES_TOKEN_CONTRACT.methods.availableForTransfer(account).call()
    const delegatesSelf = await DELEGATIES_TOKEN_CONTRACT.methods.delegates(account).call()
    let delegatedToOthers = await DELEGATIES_TOKEN_CONTRACT.methods.getCurrentVotes(delegatesSelf).call()
    free = normalizeValue(free)
    current = normalizeValue(current)
    balance = normalizeValue(balance)
    totalBalance = normalizeValue(totalBalance)
    delegatedToOthers = normalizeValue(delegatedToOthers)

    const accessDelegate: boolean =
      +calculateProcent(free, balance) +
        (current == 0 ? 0 : +calculateProcent(free, current)) -
        (current == 0 ? 0 : +calculateProcent(free, balance)) >
      1

    if (delegatesSelf == account) {
      setVotes({
        totalBalance: totalBalance,
        freeCirculation: free, // sum
        getCurrentVotes: current, // delegated sum (my with delegated)
        balanceOf: current == 0 ? 0 : balance, // only my balance
        ownCount: balance,
        delegatedCount: Math.sign(balance - current) === -1 ? current - balance : balance - current,
        balanceOfProcent: current == 0 ? 0 : +calculateProcent(free, balance),
        getCurrentVotesProcent: current == 0 ? 0 : calculateProcent(free, current) - calculateProcent(free, balance),
        accessDelegate,
        delegatesSelf: delegatesSelf,
        delegatedToOthers: delegatedToOthers
      })
    } else {
      setVotes({
        totalBalance: totalBalance,
        freeCirculation: free,
        getCurrentVotes: current,
        balanceOf: current == 0 ? 0 : balance,
        ownCount: 0,
        delegatedCount: current,
        balanceOfProcent: 0,
        getCurrentVotesProcent: current == 0 ? 0 : calculateProcent(free, current),
        // getCurrentVotesProcent: current == 0 ? 0 : calculateProcent(free, current) - calculateProcent(free, balance),
        accessDelegate,
        delegatesSelf: delegatesSelf,
        delegatedToOthers: delegatedToOthers
      })
    }
  }

  useEffect(() => {
    isOpenDelefationModal && account !== null && getBalance()
  }, [isOpenDelefationModal, errorInput])

  useEffect(() => {
    if (account !== null) getBalance()
  }, [account])

  // delegate functions
  const writeContractDelegate: (a: string, b: string) => void = async (address, flag) => {
    setIsFetchingDelegate(true)
    await DELEGATIES_TOKEN_CONTRACT.methods
      .delegate(address) //0x0000000000000000000000000000000000000000
      .send({
        from: account
      })
      .on('transactionHash', function(hash) {
        // создан хеш для отслеживания события
        setErrorDelegate(false)
        flag === 'yourself' && setCompletedDelegate(true)
        flag === 'yourself' && setCompletedRecipientDelegate(false)
        flag === 'recipient' && setCompletedRecipientDelegate(true)
        flag === 'recipient' && setCompletedDelegate(false)
        // https://ropsten.etherscan.io/tx/0x13bbe37a79a0acf52ad63704b38b11f368421e19ea37fa1e4b17f9a424208444
        //@ts-ignore
        window.dataLayer.push({
          event: `process_complete`,
          process: `Voting New delegation`,
          step_name: `Transaction pending`,
          tx_hash: `${hash}`
        })
      })
      .on('receipt', function() {
        setIsFetchingDelegate(false)
        getBalance()
        flag !== 'yourself' && setSuccessfulDelegatedAddress(true)
        flag !== 'recipient' && setSuccessfulDelegatedAddressForView(true)
        // после выполнения транзакции выводится инфа
      })
      .on('error', function(error, receipt) {
        setIsFetchingDelegate(false)
        // если сделать отмену или ошибка
        console.error('error', error, 'receipt', receipt) //error.message
        setErrorDelegate(error.message)
      })
  }

  const onErrorInput: (a: any) => void = condition => {
    setErrorInput(!condition)
  }

  return (
    <>
      <Modal
        isOpen={isOpenDelefationModal}
        onDismiss={closeModal}
        maxWidth={440}
        windowInnerHeight={window.innerHeight}
        dangerouslyBypassScrollLock={true}
      >
        <LightCard style={{ padding: '24px' }}>
          <AutoColumn>
            <TYPE.white fontSize={20}>
              <TitleContainer>
                {t('voting.votesDelegation')}
                <img src={close} onClick={closeModal} />
              </TitleContainer>
            </TYPE.white>

            <DelegationInfo>
              <TYPE.largeHeader>
                <span style={{ color: '#E44B05', fontSize: 48 }}>{votes.getCurrentVotes}</span>
                <br />
                <span style={{ color: '#bbbbbb', fontSize: 14 }}>{t('voting.currentlyAvailableVotes')}</span>
              </TYPE.largeHeader>

              {/*<TYPE.body fontWeight={500}>
                {t('Own')} - {votes.balanceOfProcent == 0 ? '0.00' : votes.balanceOfProcent?.toFixed(2)}%{' '}
                <TYPE.body fontWeight={300} display="inline">
                  ({votes.ownCount == 0 ? '0.00' : votes.ownCount} GNBU)
                </TYPE.body>
              </TYPE.body>*/}

              {/*<TYPE.body fontWeight={500}>
                {t('Delegated')} -{' '}
                {votes.getCurrentVotesProcent == 0 ? '0.00' : Math.abs(votes.getCurrentVotesProcent)?.toFixed(2)}%{' '}
                <TYPE.body fontWeight={300} display="inline">
                  ({votes.delegatedCount == 0 ? '0.00' : votes.delegatedCount + ' '} GNBU)
                </TYPE.body>
              </TYPE.body>*/}
            </DelegationInfo>

            <TYPE.body>
              <div style={{ marginBottom: 20 }}>
                <DelegationInfoContainer>
                  <DelegationInfoSubtitle>{t('voting.yourGnbuBalance')}</DelegationInfoSubtitle>
                  <DelegationInfoText>
                    <span>{votes.totalBalance}</span>
                  </DelegationInfoText>
                </DelegationInfoContainer>
              </div>

              <hr color={'#4D4D4F'} size={1} style={{ marginBottom: 20 }} />

              <div style={{ marginBottom: 20 }}>
                <DelegationInfoContainer>
                  <DelegationInfoText>{t('voting.votesDelegatesByOthers')}</DelegationInfoText>
                  <DelegationInfoText>
                    <span>{votes.delegatedCount}</span>
                  </DelegationInfoText>
                </DelegationInfoContainer>

                <DelegationInfoContainer>
                  <DelegationInfoText>{t('voting.votesDelegatesToOthers')}</DelegationInfoText>
                  <DelegationInfoText>
                    <span>
                      {Math.sign(votes.delegatedToOthers - votes.ownCount) === -1
                        ? votes.ownCount - votes.delegatedToOthers
                        : votes.delegatedToOthers - votes.ownCount}
                    </span>
                  </DelegationInfoText>
                </DelegationInfoContainer>

                <DelegationInfoContainer>
                  <DelegationInfoText>{t('voting.selfDelegatedVotes')}</DelegationInfoText>
                  <DelegationInfoText>
                    <span>{votes.ownCount}</span>
                  </DelegationInfoText>
                </DelegationInfoContainer>

                <DelegationInfoContainer>
                  <DelegationInfoText>{t('voting.nonDelegatedVotes')}</DelegationInfoText>
                  <DelegationInfoText>
                    <span>
                      {votes.totalBalance - votes.delegatedToOthers - votes.ownCount < 0
                        ? 0
                        : votes.totalBalance - votes.delegatedToOthers - votes.ownCount}
                    </span>
                  </DelegationInfoText>
                </DelegationInfoContainer>
              </div>

              <hr color={'#4D4D4F'} size={1} style={{ marginBottom: 20 }} />

              <div style={{ marginBottom: 20 }}>
                <DelegationInfoContainer>
                  <DelegationInfoSubtitle>{t('voting.maximumPossibleVotes')}</DelegationInfoSubtitle>
                  <DelegationInfoText>
                    <span>10%</span>
                  </DelegationInfoText>
                </DelegationInfoContainer>
              </div>

              <hr color={'#4D4D4F'} size={1} style={{ marginBottom: 20 }} />

              <div>
                <DelegationInfoContainer onClick={() => setOpenSubInfo(!openSubInfo)} style={{ cursor: 'pointer' }}>
                  <DelegationInfoSubtitle>{t('voting.governanceParticipationConditions')}</DelegationInfoSubtitle>
                  <DelegationInfoText>
                    <img
                      src={ArrowIcon}
                      alt="bellow"
                      style={openSubInfo ? { marginLeft: '78px', transform: 'rotate(180deg)' } : { marginLeft: '78px' }}
                    />
                  </DelegationInfoText>
                  <br />
                  <br />
                </DelegationInfoContainer>

                {openSubInfo && (
                  <>
                    <DelegationInfoContainer>
                      <DelegationInfoText>{t('voting.votingRequires')}</DelegationInfoText>
                      <DelegationInfoText>
                        <span> {votes.freeCirculation / 100} GNBU</span>
                      </DelegationInfoText>
                    </DelegationInfoContainer>

                    <DelegationInfoContainer>
                      <DelegationInfoText>{t('voting.proposalCreationRequires')}</DelegationInfoText>
                      <DelegationInfoText>
                        <span>{votes.freeCirculation / 100} GNBU</span>
                      </DelegationInfoText>
                    </DelegationInfoContainer>

                    <DelegationInfoContainer>
                      <DelegationInfoText></DelegationInfoText>
                      <DelegationInfoText>
                        <span> {votes.freeCirculation / 1000} GNBU</span>
                      </DelegationInfoText>
                    </DelegationInfoContainer>
                  </>
                )}
              </div>

              {/*<div style={{ marginBottom: 25 }}>
                <DelegationInfoSubtitle>{t('voting.conditionsForVote')}</DelegationInfoSubtitle>
                <br />
                <br />
                <DelegationInfoContainer>
                  <DelegationInfoText style={completedDelegate && !isFetchingDelegate ? { color: '#3DD598' } : null}>
                  <DelegationInfoText style={totalProcent > 1 ? { color: '#3DD598' } : null}>
                    {t('voting.votingRequire')}
                  </DelegationInfoText>
                  <DelegationInfoText style={completedDelegate && !isFetchingDelegate ? { color: '#3DD598' } : null}>
                  <DelegationInfoText style={totalProcent > 1 ? { color: '#3DD598' } : null}>
                    <span style={completedDelegate && !isFetchingDelegate ? { color: '#3DD598' } : null}>1% : </span>{' '}
                    <span style={totalProcent > 1 ? { color: '#3DD598' } : null}>1% : </span>{' '}
                    {votes.freeCirculation / 100} GNBU
                  </DelegationInfoText>
                </DelegationInfoContainer>
              </div>

              <DelegationInfoSubtitle>{t('voting.conditionForProposals')}</DelegationInfoSubtitle>
              <br />
              <br />
              <DelegationInfoContainer>
                <DelegationInfoText>{t('voting.proposalsRequire')}: </DelegationInfoText>
                <DelegationInfoText>
                  <span>1% : </span>
                  {votes.freeCirculation / 100} GNBU
                </DelegationInfoText>
              </DelegationInfoContainer>
              <DelegationInfoContainer>
                <DelegationInfoText>{t('voting.proposalsRequireStack')}:</DelegationInfoText>
                <DelegationInfoText>
                  <span>0.1% : </span>
                  {votes.freeCirculation / 1000} GNBU
                </DelegationInfoText>
              </DelegationInfoContainer>*/}
            </TYPE.body>

            {/* Delegation */}
            {votes.delegatesSelf === account ? (
              <TYPE.body
                style={{
                  marginTop: '-60px',
                  marginBottom: '70px',
                  textAlign: 'left',
                  position: 'relative',
                  top: 70
                }}
                color={'green1'}
              >
                {t('voting.delegatedToItself')}
              </TYPE.body>
            ) : votes.delegatesSelf === '0x0000000000000000000000000000000000000000' ? null : (
              <TYPE.body color={'green1'}>
                {t('voting.delegatedToRecipient')} <br />
                <span style={{ color: '#fff' }}>
                  {votes?.delegatesSelf?.slice(0, 15) + '...' + votes?.delegatesSelf?.slice(-15)}
                </span>
              </TYPE.body>
            )}
            {!showAddDelegate && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonPrimary
                  className={'at-click at-pp-dlg-btn-dlg-oth'}
                  style={
                    completedDelegate && !isFetchingDelegate
                      ? {
                          position: 'relative',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          marginTop: '20px',
                          backgroundColor: 'rgba(228, 75, 5, 1)'
                        }
                      : {
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          marginTop: '20px',
                          backgroundColor: 'rgba(228, 75, 5, 1)',
                          width: '48%'
                        }
                  }
                  onClick={() => {
                    setShowAddDelegate(true)
                    //@ts-ignore
                    window.dataLayer.push({
                      event: `process_progress`,
                      process: `Voting New delegation`,
                      step_name: `Delegate to others`
                    })
                  }}
                  // disabled={votes.getCurrentVotes === 0 && true}
                >
                  <TYPE.subHeader fontWeight={600}>{t('voting.addDelegate')}</TYPE.subHeader>
                </ButtonPrimary>

                {completedDelegate && !isFetchingDelegate ? null : (
                  <ButtonPrimary
                    className={'at-click at-pp-dlg-btn-dlg-slf'}
                    style={{
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      marginTop: '20px',
                      height: '44px',
                      width: '48%'
                    }}
                    onClick={() => {
                      writeContractDelegate(account, 'yourself')
                      //@ts-ignore
                      window.dataLayer.push({
                        event: `process_confirm`,
                        process: `Voting New delegation`,
                        step_name: `Self-delegate votes`
                      })
                    }}
                    // disabled={votes.accessDelegate ? false : true}
                  >
                    <TYPE.subHeader fontWeight={600}>
                      {isFetchingDelegate && <Loader stroke="white" style={{ margin: '0 5px -3px 0' }} />}
                      {t('voting.selfDelegate')}
                    </TYPE.subHeader>
                  </ButtonPrimary>
                )}
              </div>
            )}
            {/* Update Delegation */}
            {showAddDelegate && (
              <div style={{ marginTop: '24px' }}>
                <AddressInputPanel
                  value={addressInput}
                  onChange={e => {
                    setAddressInput(e)
                    //@ts-ignore
                    window.dataLayer.push({
                      event: `process_progress`,
                      process: `Voting New delegation`,
                      step_name: `Enter Recipient`
                    })
                  }}
                  onError={onErrorInput}
                />
                {/* {votes.delegatesSelf !== account && (
                  <>
                    <TYPE.body style={{ marginTop: '24px' }} color={'green1'}>
                      {votes.delegatesSelf}
                    </TYPE.body>
                    <TYPE.body style={{ marginTop: '16px' }}>
                      {addressInput.slice(0, 15) + '...' + addressInput.slice(-15)}
                    </TYPE.body>
                  </>
                )} */}
                {!successfulDelegatedAddress && (
                  <ButtonLight
                    className={'at-click at-pp-dlg-oth-btn-dlg'}
                    style={{ paddingTop: '12px', paddingBottom: '12px', marginTop: '24px' }}
                    disabled={isFetchingDelegate || errorInput}
                    onClick={() => {
                      //@ts-ignore
                      window.dataLayer.push({
                        event: `process_confirm`,
                        process: `Voting New delegation`,
                        step_name: `Confirm delegate votes`
                      })
                      writeContractDelegate(addressInput, 'recipient')
                    }}
                  >
                    <TYPE.subHeader fontWeight={600}>
                      {isFetchingDelegate && <Loader stroke="white" style={{ margin: '0 5px -3px 0' }} />}
                      {t('voting.delegateVotes')}
                    </TYPE.subHeader>
                  </ButtonLight>
                )}
              </div>
            )}

            {/* Delegated */}
            {errorDelegate && (
              <TYPE.body style={{ marginTop: '24px' }} color={'red2'}>
                {errorDelegate}
              </TYPE.body>
            )}
            {successfulDelegatedAddress && (
              <>
                <ButtonLight
                  onClick={() => writeContractDelegate('0x0000000000000000000000000000000000000000')}
                  style={{ paddingTop: '12px', paddingBottom: '12px', marginTop: '24px' }}
                >
                  <TYPE.subHeader fontWeight={600}>
                    {isFetchingDelegate && <Loader stroke="white" style={{ margin: '0 5px -3px 0' }} />}
                    {t('voting.removeDelegation')}
                  </TYPE.subHeader>
                </ButtonLight>
              </>
            )}
            {/* 0x50732ed7e73Eb365a8A128D05eF6b07f30031103 */}
            {/* <TYPE.body color="#3DD598" style={{ marginTop: '24px' }}>
              {t('Delegated recipient')}
            </TYPE.body>
            <TYPE.body fontSize={'18px'} style={{ marginTop: '16px' }}>
              {t('AUIGuoQEOgQI1q98GQkljQWEG91')}
            </TYPE.body>
            <ButtonLight style={{ paddingTop: '12px', paddingBottom: '12px', marginTop: '24px' }}>
              <TYPE.subHeader fontWeight={600}>{t('Remove delegation')}</TYPE.subHeader>
            </ButtonLight> */}

            {/* Delegated on yourself */}
            {/* <TYPE.body color="#3DD598" style={{ marginTop: '24px' }}>
              {t('Delegated recipient')}
            </TYPE.body>
            <ButtonLight style={{ paddingTop: '12px', paddingBottom: '12px', marginTop: '24px' }}>
              <TYPE.subHeader fontWeight={600}>{t('Add delegate +')}</TYPE.subHeader>
            </ButtonLight> */}
          </AutoColumn>
        </LightCard>
      </Modal>
    </>
  )
}

export default DelegationModal

const DelegationInfo = styled.div`
  margin: 20px 0 24px;
  text-align: center;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: 10px;
    height: 10px;
    cursor: pointer;
  }
`

const DelegationInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

const DelegationInfoSubtitle = styled.span`
  font-weight: 700;
  font-size: 16px;
`

const DelegationInfoText = styled.span`
  font-size: 14px;
  color: #bbbbbb;

  span {
    color: #fff;
  }
`
