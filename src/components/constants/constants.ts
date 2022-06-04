// @ts-ignore
import Web3 from 'web3'
import GOVERNOR_V1_ABI from '../constants/abis/governorV1ABI.json'
import GNBU_ABI from '../constants/abis/GNBU.json'
import LOCK_STAKING_ABI_GNBU from '../constants/abis/lockStackingRewardFixedAPY.json'

export const web3 = new Web3(Web3.givenProvider)

const getChainId = async () => {
 return await web3.eth.getChainId()
};

const chainId = getChainId()

export const PROPOSALS_TOKEN_CONTRACT = new web3.eth.Contract(
  GOVERNOR_V1_ABI as any,
  // @ts-ignore
  chainId == 97 || chainId == 56
    ? '0x285432B4679c8Cd6E96E4214fC49aEeD1108B77b'
    : process.env.REACT_APP_PROPOSALS_TOKEN_CONTRACT
)
export const DELEGATIES_TOKEN_CONTRACT = new web3.eth.Contract(
  GNBU_ABI as any,
  // @ts-ignore
  chainId == 97 || chainId == 56
    ? '0xA4d872235dde5694AF92a1d0df20d723E8e9E5fC'
    : process.env.REACT_APP_DELEGATIES_TOKEN_CONTRACT
)
export const GNBU_TOKEN_CONTRACT = new web3.eth.Contract(
  GNBU_ABI as any,
  // @ts-ignore
  chainId == 97 || chainId == 56
    ? '0xA4d872235dde5694AF92a1d0df20d723E8e9E5fC'
    : process.env.REACT_APP_GNBU_TOKEN_CONTRACT
)
export const LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT = new web3.eth.Contract(
  LOCK_STAKING_ABI_GNBU as any,
  // @ts-ignore
  chainId == 97 || chainId == 56
    ? '0x0AfFD0632cf705aEdF6218AE3CA5Bd7D10a58272'
    : process.env.REACT_APP_LOCK_STAKING_GNBU_HARD_SMALL_CONTRACT
)
export const LOCK_STAKING_GNBU_HARD_BIG_CONTRACT = new web3.eth.Contract(
  LOCK_STAKING_ABI_GNBU as any,
  // @ts-ignore
  chainId == 97 || chainId == 56
    ? '0x15603Ed5dBBA604d965064e3C4f14C4E2189a012'
    : process.env.REACT_APP_LOCK_STAKING_GNBU_HARD_BIG_CONTRACT
)
export const LOCK_STAKING_CONTRACT_SOFT = new web3.eth.Contract(
  LOCK_STAKING_ABI_GNBU as any,
  // @ts-ignore
  chainId == 97 || chainId == 56
    ? '0x31557dB0c6F614116Fe48Cb5f5CB5E3d8Aa20379'
    : process.env.REACT_APP_LOCK_STAKING_GNBU_SOFT_CONTRACT
)

export const RPC = {
 1: "https://mainnet.infura.io/v3/....",
 3: "https://ropsten.infura.io/v3/....",
 4: "https://rinkeby.infura.io/v3/....",
 5: "https://goerly.infura.io/v3/....",
 42: "https://kovan.infura.io/v3/....",
 56: "https://bsc-dataseed.binance.org/",
 97: "https://data-seed-prebsc-2-s3.binance.org:8545",
 250: "https://rpc.ftm.tools",
};
