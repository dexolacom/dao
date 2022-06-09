import { InjectedConnector } from '@web3-react/injected-connector'

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97]
})

//Patch networkChanged error
//@ts-ignore
injected.handleNetworkChanged = (networkId: string | number) => {
  if (networkId === '0xNaN') return //Ignore loading, networkId as causes errors
  //@ts-ignore
  injected.emitUpdate({ chainId: networkId, provider: window.ethereum })
}