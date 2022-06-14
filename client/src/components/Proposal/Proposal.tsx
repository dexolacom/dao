import React from 'react';
import { Content, Title, Wrapper, Text } from './styles';
import {ProposalProps} from '../constants/types';

const Proposal = ({title, address, methodName}:ProposalProps) => {

  return (
    <Wrapper>
      <Content>
        <Title>{title}</Title>
        <Text>{address}</Text> <br/>
        <Text>{methodName}</Text>
      </Content>
    </Wrapper>
  );
};

export default Proposal;