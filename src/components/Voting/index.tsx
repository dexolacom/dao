import React, { useState } from 'react'
import ProposalList from './ProposalList/ProposalList'
import { ConnectButton } from 'tech-web3-connector';
import { RPC } from '../constants/constants';
// import DelegationModal from './DelegationModal'

const Voting = () => {
  const [isOpenDelegationModal, setIsOpenDelegationModal] = useState(false)
  return (
    <>
      <ProposalList isOpenDelegationModal={isOpenDelegationModal} setIsOpenDelegationModal={setIsOpenDelegationModal} />
      {/*<DelegationModal*/}
      {/*  isOpenDelegationModal={isOpenDelegationModal}*/}
      {/*  setIsOpenDelegationModal={setIsOpenDelegationModal}*/}
      {/*/>*/}
    </>
  )
}

export default Voting
