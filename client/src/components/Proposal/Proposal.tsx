import React from 'react';
import { Content, Wrapper, TextContainer, TextContainerName, Text} from './styles';
import {ProposalProps} from '../constants/types';

const Proposal = ({title, address, methodName}:ProposalProps) => {

  return (
    <Wrapper>
      <Content>
        <TextContainer>
          <TextContainerName>Title</TextContainerName>
          <Text>{title}</Text>
        </TextContainer>
        <TextContainer>
          <TextContainerName>Address</TextContainerName>
          <Text>{address}</Text>
        </TextContainer>
        <TextContainer>
          <TextContainerName>Method</TextContainerName>
          <Text>{methodName}</Text>
        </TextContainer>
      </Content>
    </Wrapper>
  );
};

export default Proposal;