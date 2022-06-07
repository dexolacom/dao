import React, { useState, useEffect } from 'react'
import { web3 } from '../../constants/constants';
import {Button} from '../../theme';
import governorV1ABI from '../../constants/abis/governorV1ABI.json'
// import { EditorState, convertFromRaw, convertToRaw, convertFromHTML } from 'draft-js'
// import './style.css'
// import Dropzone from 'react-dropzone'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core';
import { Content, ContentRow, Input, Wrapper } from './styles';
import {ReactComponent as CrossIcon} from '../../../assets/icons/cross.svg';

const ProposalEditor = ({setIsProposalEditorOpen}:{setIsProposalEditorOpen: (b: boolean) => void}) => {
  const { chainId, account } = useWeb3React()
  const [inputs, setInputs] = useState({
    title: '',
    methodName: '',
    address: '',
    signatures: '',
    calldatas: ''
  })
  console.log(inputs);
  const [isLoading, setIsLoading] = useState(false)

  // // const history = useHistory()
  // const [editorState, setEditorState] = useState(
  //   localStorage.getItem('editorState')
  //     ? EditorState.createWithContent(convertFromRaw(JSON.parse(localStorage.getItem('editorState'))))
  //     : () => EditorState.createEmpty()
  // )
  const PROPOSALS_TOKEN_CONTRACT = new web3.eth.Contract(
    governorV1ABI as any,
    chainId === 97 || chainId === 56
      ? '0x285432B4679c8Cd6E96E4214fC49aEeD1108B77b'
      : '0x79D754cDC8b579F73bdB32a97A12fabC7662e658'
  )
  //
  // const [value, setValue] = useState(0)
  // const [error, setError] = useState(null)
  // const [validated, setValidated] = useState({
  //   title: true,
  //   methodName: true,
  //   address: true,
  //   signatures: true,
  //   calldatas: true
  // })

  // const [description, setDescription] = useState()
  // const [file, setFile] = useState(null)
  // const [loading, setIsLoading] = useState(false)
  // const bytesToSize = bytes => {
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  //   if (bytes == 0) return '0 Byte'
  //   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  //   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  // }
  //
  // const fileReader = files => {
  //   const f = files[0]
  //
  //   if (!f.type.match('application/json')) {
  //     alert('Not a JSON file!')
  //   } else {
  //     const reader = new FileReader()
  //     reader.onloadend = function(e) {
  //       const result = JSON.parse(this.result)
  //       setFile({ name: f.name, data: result, size: bytesToSize(f.size) })
  //     }
  //     reader.readAsText(f)
  //   }
  // }
  //
  // useEffect(() => {
  //   localStorage.setItem('editorState', JSON.stringify(convertToRaw(editorState.getCurrentContent())))
  // }, [editorState])
  //

  const send = async (address: string, values: string, signature: string, calldata: string) => {
    setIsLoading(true)
    await PROPOSALS_TOKEN_CONTRACT.methods
      .propose([address], [values], [signature], [calldata])
      .send({
        from: account
      })
      .on('receipt', function() {
        setIsLoading(false)
      })
      .on('error', function(error: any) {
        // если сделать отмену или ошибка
        console.error('error', error) //error.message
      })
  }
  //
  // const checkForValidation = () => {
  //   const newValidated = {}
  //   let validForm = true
  //   for (const key in inputs) {
  //     if (inputs[key] === '') {
  //       newValidated[key] = false
  //       validForm = false
  //     } else newValidated[key] = true
  //   }
  //   setValidated(newValidated)
  //   return validForm
  // }
  //

  const createPropose = async () => {
    // if (!checkForValidation()) return false
    setIsLoading(true)
    const addressFormat = `${inputs.address}`
    const valueFormat = '0'
    const signaturesFormat = `${inputs.methodName}(${inputs.signatures})`
    const args = inputs.signatures.split(/,/g)
    const values = inputs.calldatas.split(/,/g)

    const calldatasFormat = web3.eth.abi.encodeParameters([args[0], args[1]], [values[0], values[1]])
    const title = `${inputs.title}`

    const proposalCount = await PROPOSALS_TOKEN_CONTRACT.methods.proposalCount().call()
    const votingId = +proposalCount + 1

    // const raw = JSON.stringify({
    //   votingId: votingId.toString(),
    //   title,
    //   chainId: chainId,
    //   text: localStorage.getItem('editorState')
    // })
    //
    // const requestOptions = {
    //   method: 'POST',
    //   headers: {},
    //   body: raw,
    //   redirect: 'follow'
    // }

    await send(addressFormat, valueFormat, signaturesFormat, calldatasFormat)
  }

  return (
    <Wrapper>
      <CrossIcon onClick={() => setIsProposalEditorOpen(false)} color={'grey'} heigth={'20px'} width={'20px'}/>
      <Content>
        <ContentRow>
          <Input placeholder='Title' onChange={e => setInputs({ ...inputs, title: e.target.value })}/>
        </ContentRow>
        <ContentRow>
          <Input placeholder='Target contract address' onChange={e => setInputs({ ...inputs, address: e.target.value })}/>
        </ContentRow>
        <ContentRow>
          <Input placeholder='Method name' onChange={e => setInputs({ ...inputs, methodName: e.target.value })}/>
        </ContentRow>
        <ContentRow>
          <Input placeholder='Parameters types' onChange={e => setInputs({ ...inputs, signatures: e.target.value })}/>
        </ContentRow>
        <ContentRow>
          <Input placeholder='Parameters value' onChange={e => setInputs({ ...inputs, calldatas: e.target.value })}/>
        </ContentRow>
        <ContentRow marginBottom={'0'}>
          <Button onClick={() => createPropose()}>
            Create new proposal
          </Button>
        </ContentRow>
      </Content>
    </Wrapper>
  )
}

export default ProposalEditor