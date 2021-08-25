import { initialContract } from "../web3"
import getCdpsAbi from "../../blockchain/abi/get-cdps.json"
import { CDP_MANAGER, GET_CDPS } from "../../blockchain/addresses/kovan.json"
import _ from "lodash";

interface CDP {
  id: string
  urn: string
  ilk: string
}

export const getAllLoans = async (proxy: string) => {
  const contract = initialContract(getCdpsAbi, GET_CDPS)
  return await contract.methods.getCdpsAsc(CDP_MANAGER, proxy).call()
}

export const getLastCdp = async (proxy: string): Promise<CDP> => {
  const { ids, urns, ilks } = await getAllLoans(proxy)
  const cdp: CDP | undefined = _.last(
    _.map((_.zip(ids, urns, ilks) as any) as [string, string, string][], (cdp) => ({
      id: cdp[0],
      urn: cdp[1],
      ilk: cdp[2],
    })),
  )
  if (_.isUndefined(cdp)) {
    throw new Error('No CDP available')
  }
  return cdp
}
