import Web3 from "web3"
import { ETH, PROXY_REGISTRY } from "../blockchain/addresses/moonbeam.json"
import dsProxyRegistryAbi from "../blockchain/abi/ds-proxy-registry.json"
import erc20Abi from "../blockchain/abi/erc20.json"
import {zero} from "../constants/zero";

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
      params: [{ chainId: "0x507" }],
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