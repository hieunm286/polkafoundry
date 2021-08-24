import { initialContract } from "../web3"
import mcdOsmAbi from "../../blockchain/abi/mcd-osm.json"
import { MCD_SPOT } from "../../blockchain/addresses/kovan.json"
import { mcdData } from "../../constants/variables"
import { BigNumber } from "bignumber.js"
import Web3 from "web3"

export const pipZzz$ = async (token: string) => {
  const address = mcdData()[token]?.address
  const contract = initialContract(mcdOsmAbi, address)
  const result = await contract.methods.zzz().call()
  return new BigNumber(result).times(1000)
}

export const pipHop$ = async (token: string) => {
  const address = mcdData()[token]?.address
  const contract = initialContract(mcdOsmAbi, address)
  const result = await contract.methods.hop().call()
  return new BigNumber(result).times(1000)
}

export const pipPeek$ = async (token: string) => {
  const address = mcdData()[token]?.address
  console.log(address)
  const contract = initialContract(mcdOsmAbi, address)
  const result = await contract.methods.peek().call({ from: MCD_SPOT })
  console.log(result)
  return [Web3.utils.hexToNumberString(result[0] as string), result[1]]
}

export const pipPeep$ = async (token: string) => {
  const address = mcdData()[token]?.address
  const contract = initialContract(mcdOsmAbi, address)
  const result = await contract.methods.peep().call({ from: MCD_SPOT })
  return [Web3.utils.hexToNumberString(result[0] as string), result[1]]
}
