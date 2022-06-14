import React, {useEffect, useState} from 'react'
import { web3, PROPOSALS_TOKEN_CONTRACT } from '../constants/constants';
import {Button} from '../theme';
import governorV1ABI from '../constants/abis/governorV1ABI.json'
import { useWeb3React } from '@web3-react/core';
import { Content, ContentRow, Input, Wrapper } from './styles';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg';
import { useHttp } from '../constants/hooks/useHTTP';
import axios from 'axios';
import {createProposal} from '../constants/requests';

const ProposalEditor = ({setIsProposalEditorOpen}:{setIsProposalEditorOpen: (b: boolean) => void}) => {
  const {loading, request} = useHttp()
  const { chainId, account } = useWeb3React()
  const [inputs, setInputs] = useState({
    title: '',
    address: '',
    methodName: '',
    signatures: '',
    calldatas: ''
  })

  const inputHandler = (event:React.ChangeEvent<HTMLInputElement>) => {
    setInputs({...inputs, [event.target.name]: event.target.value})
  };


  // const send = async (address: string, values: string, signature: string, calldata: string, desc: string) => {
  //   console.log(PROPOSALS_TOKEN_CONTRACT);
  //   setIsLoading(true)
  //   await PROPOSALS_TOKEN_CONTRACT.methods
  //     .propose([address], [values], [signature], [calldata], desc)
  //     .send({
  //       from: account
  //     })
  //     .on('receipt', function() {
  //       console.log('success');
  //       setIsLoading(false)
  //     })
  //     .on('error', function(error: any) {
  //       console.error('error', error)
  //     })
  // }

  // const createPropose = async () => {
  //   if (!checkForValidation()) return false
  //   setIsLoading(true)
  //   const addressFormat = `${inputs.address}`
  //   const valueFormat = '0'
  //   const signaturesFormat = `${inputs.methodName}(${inputs.signatures})`
  //   const args = inputs.signatures.split(/,/g)
  //   const values = inputs.calldatas.split(/,/g)
  //   const calldatasFormat = web3.eth.abi.encodeParameters([args[0], args[1]], [values[0], values[1]])
  //   const title = `${inputs.title}`
  //
  //   const proposalCount = await PROPOSALS_TOKEN_CONTRACT.methods.proposalCount().call()
  //   const votingId = +proposalCount + 1
  //
  //   await send(addressFormat, valueFormat, signaturesFormat, calldatasFormat)
  // }

  return (
    <Wrapper>
      <CrossIcon onClick={() => setIsProposalEditorOpen(false)} color={'grey'} heigth={'20px'} width={'20px'}/>
      <Content>
        <ContentRow>
          <Input placeholder='Title' name='title' onChange={inputHandler}/>
        </ContentRow>
        <ContentRow>
          <Input placeholder='Target contract address' name='address' onChange={inputHandler}/>
        </ContentRow>
        <ContentRow>
          <Input placeholder='Method name' name='methodName' onChange={inputHandler}/>
        </ContentRow>
        <ContentRow>
          <Input placeholder='Parameters types' name='signatures' onChange={inputHandler} />
        </ContentRow>
        <ContentRow>
          <Input placeholder='Parameters value' name='calldatas' onChange={inputHandler}/>
        </ContentRow>
        <ContentRow marginBottom={'0'}>
          <Button onClick={() => createProposal(inputs)}>
            Create new proposal
          </Button>
        </ContentRow>
      </Content>
    </Wrapper>
  )
}

export default ProposalEditor
