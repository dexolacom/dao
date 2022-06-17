import { Wrapper } from "./styles";
import React from 'react'
import { BackdropProps } from '../constants/types';


const Backdrop = ({children, setIsProposalEditorOpen}:BackdropProps) => {
  return (
    <Wrapper onClick={() => setIsProposalEditorOpen(false)}>
      {children}
    </Wrapper>
  );
};

export default Backdrop;