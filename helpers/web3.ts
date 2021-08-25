import Web3 from "web3"
import { ETH, PROXY_REGISTRY } from "../blockchain/addresses/kovan.json"
import dsProxyRegistryAbi from "../blockchain/abi/ds-proxy-registry.json"
import erc20Abi from "../blockchain/abi/erc20.json"
import {zero} from "../constants/zero";
import {BigNumber} from "bignumber.js";

export const changeChain = async () => {
  // console.log(fromToken);
  // const params = [
  //   {
  //     chainId: "0xB",
  //     chainName: "PolkaFoundry",
  //     nativeCurrency: {
  //       name: "HLB",
  //       symbol: "HLB",
  //       decimals: 18,
  //     },
  //     rpcUrls: ["https://rpc-halongbay.polkafoundry.com"],
  //     // blockExplorerUrls:
  //   },
  // ]

  const params = [
    {
      chainId: "0x507",
      chainName: "Moonbase Alpha",
      nativeCurrency: {
        name: "DEV",
        symbol: "DEV",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.testnet.moonbeam.network"],
      blockExplorerUrls: ["https://moonbase-blockscout.testnet.moonbeam.network/"]
    },
  ]

  try {
    return await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x2a" }],
      // params: [{ chainId: '0x2a' }],
    })
  } catch (switchError) {
    console.log("switchError", switchError)
    if (switchError.code === 4902) {
      try {
        return await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params,
        })
      } catch (addError) {
        // console.log(addError);
        return -1
      }
    } else {
      // console.log(switchError);
      return -1
    }
  }
}

export const getProxyAddress = async (address): Promise<string> => {
  const web3 = new Web3(Web3.givenProvider)
  const contract = new web3.eth.Contract(dsProxyRegistryAbi as any, PROXY_REGISTRY)

  return await contract.methods.proxies(address).call()
}

export const getTotalBalance = async (address): Promise<{ balance: string; token: string }> => {
  const web3 = new Web3(Web3.givenProvider)
  const contract = new web3.eth.Contract(erc20Abi as any, ETH)

  const balance = await contract.methods.balanceOf(address).call();
  const symbol = await contract.methods.symbol().call()
  console.log(balance)
  return { balance: Web3.utils.fromWei(balance, "ether"), token: symbol }
}

export const getTotalBalanceByTokenAddress = async (address, tokenAddress): Promise<{ balance: string; token: string }> => {
  const web3 = new Web3(Web3.givenProvider)
  const contract = new web3.eth.Contract(erc20Abi as any, tokenAddress)

  const balance = await contract.methods.balanceOf(address).call();
  const symbol = await contract.methods.symbol().call()
  return { balance: Web3.utils.fromWei(balance, "ether"), token: symbol }
}

export const getETHBalance = async (address): Promise<string> => {
  const web3 = new Web3(Web3.givenProvider)
  const balance = await web3.eth.getBalance(address)
  return web3.utils.fromWei(balance, "ether")
}

export const initialContract = (abi: any, address) => {
  const web3 = new Web3(Web3.givenProvider)
  return new web3.eth.Contract(abi, address)
}

export interface OpenCallData {
  dssProxyActions: any;
  dssCdpManager: string;
  mcdJug: string;
  mcdJoinDai: string;
  joinsIlk: string;
}

export interface Amount {
  ilk: string;
  token: string;
  depositAmount: string;
  borrowAmount: string;
  proxyAddress: string
}

export interface LockAmount extends Amount {
  id: BigNumber
}

export const getOpenCallData = (data: Amount, context: OpenCallData) => {
  const { dssProxyActions, dssCdpManager, mcdJug, mcdJoinDai, joinsIlk } = context;
  const { ilk, token, depositAmount, borrowAmount, proxyAddress } = data;

  if (parseFloat(depositAmount) > 0 && parseFloat(borrowAmount) > 0) {
    console.log('both deposit and borrow')
    console.log(Web3.utils.utf8ToHex(ilk))
    return initialContract(dssProxyActions, proxyAddress).methods.openLockETHAndDraw(
      dssCdpManager,
      mcdJug,
      joinsIlk,
      mcdJoinDai,
      Web3.utils.utf8ToHex(ilk),
      Web3.utils.toWei(borrowAmount, "ether")
    )
  }

  if (parseFloat(depositAmount) > 0 && (!borrowAmount || parseFloat(borrowAmount) === 0)) {
    console.log('only deposit')
    return initialContract(dssProxyActions, proxyAddress).methods.openLockETHAndDraw(
      dssCdpManager,
      mcdJug,
      joinsIlk,
      mcdJoinDai,
      Web3.utils.utf8ToHex(ilk),
      zero.toFixed(0),
    )
  }

  return initialContract(dssProxyActions, proxyAddress).methods.opens(
    dssCdpManager,
    Web3.utils.utf8ToHex(ilk),
    proxyAddress,
  )
}

export const getDepositAndGenerateCallData = (data: LockAmount, context: OpenCallData) => {
  const { dssProxyActions, dssCdpManager, mcdJoinDai, mcdJug, joinsIlk } = context
  const { id, depositAmount, borrowAmount, ilk, proxyAddress } = data

  if (parseFloat(depositAmount) > 0 && parseFloat(borrowAmount) > 0) {
    console.log('both deposit and borrow')
    console.log(Web3.utils.utf8ToHex(ilk))
    return initialContract(dssProxyActions, proxyAddress).methods.lockETHAndDraw(
      dssCdpManager,
      mcdJug,
      joinsIlk,
      mcdJoinDai,
      id.toString(),
      Web3.utils.toWei(borrowAmount, "ether")
    )
  }

  if (parseFloat(depositAmount) > 0) {
    console.log('only deposit')
    return initialContract(dssProxyActions, proxyAddress).methods.lockETH(
      dssCdpManager,
      joinsIlk,
      id.toString(),
    )
  }

  return initialContract(dssProxyActions, proxyAddress).methods.draw(
    dssCdpManager,
    mcdJug,
    mcdJoinDai,
    id.toString(),
    Web3.utils.toWei(borrowAmount, "ether")
  )
}

export const checkApprove = async (abi: any, contract: string, owner: string, spender: string): Promise<boolean> => {
  try {
    const checkContract = initialContract(abi, contract)
    const approve = await checkContract.methods.allowance(
      owner,
      spender
    ).call()

    if (!approve) {
      return false
    }
    return approve > 0
  } catch (err) {
    console.log(err)
    return false
  }

}

export interface WithdrawAndPaybackData {
  id: BigNumber
  token: string
  ilk: string
  withdrawAmount: string
  paybackAmount: string
  proxyAddress: string
  shouldPaybackAll: boolean
}

export const getWithdrawAndPaybackCallData = (data: WithdrawAndPaybackData, context: OpenCallData) => {
  const { dssProxyActions, dssCdpManager, mcdJoinDai, joinsIlk } = context;
  const { id, token, withdrawAmount, paybackAmount, ilk, shouldPaybackAll, proxyAddress } = data

  if (parseFloat(withdrawAmount) > 0 && parseFloat(paybackAmount) > 0) {
    console.log('both deposit and borrow')
    console.log(withdrawAmount)
    if (shouldPaybackAll) {
      return initialContract(dssProxyActions, proxyAddress).methods.wipeAllAndFreeETH(
        dssCdpManager,
        joinsIlk,
        mcdJoinDai,
        id.toString(),
        Web3.utils.toWei(withdrawAmount, "ether")
      )
    }
    return initialContract(dssProxyActions, proxyAddress).methods.wipeAndFreeETH(
      dssCdpManager,
      joinsIlk,
      mcdJoinDai,
      id.toString(),
      Web3.utils.toWei(withdrawAmount, "ether"),
      Web3.utils.toWei(paybackAmount, "ether")
    )
  }

  if (parseFloat(withdrawAmount) > 0) {
    console.log('only deposit')
    return initialContract(dssProxyActions, proxyAddress).methods.freeETH(
      dssCdpManager,
      joinsIlk,
      id.toString(),
      Web3.utils.toWei(withdrawAmount, "ether"),
    )
  }

  if (parseFloat(paybackAmount) > 0) {
    console.log('only payback')
    if (shouldPaybackAll) {
      return initialContract(dssProxyActions, proxyAddress).methods.wipeAll(
        dssCdpManager,
        mcdJoinDai,
        id.toString(),
      )
    }
    return initialContract(dssProxyActions, proxyAddress).methods.wipe(
      dssCdpManager,
      mcdJoinDai,
      id.toString(),
      Web3.utils.toWei(paybackAmount, "ether"),
    )
  }

  return false;
}