import React, { useState } from 'react'
import ProposalList from './ProposalList'
import DelegationModal from './DelegationModal'

const Voting = () => {
  const [isOpenDelefationModal, setIsOpenDelefationModal] = useState(false)
  return (
    <>
      <ProposalList isOpenDelefationModal={isOpenDelefationModal} setIsOpenDelefationModal={setIsOpenDelefationModal} />
      <DelegationModal
        isOpenDelefationModal={isOpenDelefationModal}
        setIsOpenDelefationModal={setIsOpenDelefationModal}
      />
    </>
  )
}

export default Voting
