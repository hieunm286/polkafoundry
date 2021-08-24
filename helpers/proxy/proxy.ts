import dsProxy from "../../blockchain/abi/ds-proxy.json"
import Web3 from "web3";

export const createProxyOwner$ = async (proxyAddress: string) => {
  const web3 = new Web3(Web3.givenProvider)
  const contract = new web3.eth.Contract(dsProxy as any, proxyAddress)
  return await contract.methods.owner().call()
}