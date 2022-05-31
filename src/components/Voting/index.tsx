import React, { useState } from 'react'
import ProposalList from './ProposalList/ProposalList'
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
