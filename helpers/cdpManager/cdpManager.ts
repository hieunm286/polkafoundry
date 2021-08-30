import { initialContract } from "../web3"
import cdpManagerAbi from "../../blockchain/abi/dss-cdp-manager.json"
import { CDP_MANAGER } from "../../blockchain/addresses/kovan.json"
import { BigNumber } from "bignumber.js"
import Web3 from "web3";

export const cdpManagerUrns$ = async (loanId: BigNumber | number) => {
  try {
    const dssCdpManager = initialContract(cdpManagerAbi, CDP_MANAGER)
    return await dssCdpManager.methods.urns(loanId).call()
  } catch (err) {
    console.log('cdpManagerUrn', err.message)
  }

}

export const cdpManagerOwner$ = async (loanId: BigNumber | number) => {
  const dssCdpManager = initialContract(cdpManagerAbi, CDP_MANAGER)
  return await dssCdpManager.methods.owns(loanId).call()
}

export const cdpManagerIlks$ = async (loanId: BigNumber | number) => {
  const dssCdpManager = initialContract(cdpManagerAbi, CDP_MANAGER)
  const ilk = await dssCdpManager.methods.ilks(loanId).call()
  return Web3.utils.hexToUtf8(ilk)
}

export const cdpManagerCount$ = async (cdpManagerOwner: string) => {
  const dssCdpManager = initialContract(cdpManagerAbi, CDP_MANAGER)
  return await dssCdpManager.methods.count(cdpManagerOwner).call()
}
