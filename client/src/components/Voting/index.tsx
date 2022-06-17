import React, {useEffect, useState} from 'react'
import ProposalList from '../ProposalList/ProposalList'
import ProposalEditor from '../ProposalEditor/ProposalEditor';
import Backdrop from '../Backdrop/Backdrop';


const Voting = () => {
  const [isProposalEditorOpen, setIsProposalEditorOpen] = useState(false)
  console.log(isProposalEditorOpen)

  useEffect(() => {
    document.body.style.overflow = isProposalEditorOpen ? "hidden" : "unset"
  }, [isProposalEditorOpen]);

  return (
    <>
      <ProposalList setIsProposalEditorOpen={setIsProposalEditorOpen}/>
      {isProposalEditorOpen &&
        <Backdrop setIsProposalEditorOpen={setIsProposalEditorOpen}>
          <ProposalEditor setIsProposalEditorOpen={setIsProposalEditorOpen}/>
        </Backdrop>
      }
    </>
  )
}

export default Voting
