import React, { useState } from 'react'
import ProposalList from '../ProposalList/ProposalList'
import { ConnectButton } from 'tech-web3-connector';
import ProposalEditor from '../ProposalEditor/ProposalEditor';
// import DelegationModal from './DelegationModal'

const Voting = () => {
  const [isOpenDelegationModal, setIsOpenDelegationModal] = useState(false)
  const [isProposalEditorOpen, setIsProposalEditorOpen] = useState(false)
  return (
    <>
      <ProposalList isOpenDelegationModal={isOpenDelegationModal} setIsOpenDelegationModal={setIsOpenDelegationModal} setIsProposalEditorOpen={setIsProposalEditorOpen}/>
      {isProposalEditorOpen && <ProposalEditor setIsProposalEditorOpen={setIsProposalEditorOpen}/>}
      {/*<DelegationModal*/}
      {/*  isOpenDelegationModal={isOpenDelegationModal}*/}
      {/*  setIsOpenDelegationModal={setIsOpenDelegationModal}*/}
      {/*/>*/}
    </>
  )
}

export default Voting
