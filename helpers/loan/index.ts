import { initialContract } from "../web3"
import getCdpsAbi from "../../blockchain/abi/get-cdps.json"
import { CDP_MANAGER, GET_CDPS } from "../../blockchain/addresses/kovan.json"

export const getAllLoans = async (proxy: string) => {
  const contract = initialContract(getCdpsAbi, GET_CDPS)
  return await contract.methods.getCdpsAsc(CDP_MANAGER, proxy).call()
}
