import { initialContract } from "../web3"
import spotAbi from "../../blockchain/abi/mcd-spot.json"
import { MCD_SPOT } from "../../blockchain/addresses/kovan.json"
import Web3 from "web3"
import { Ilks } from "../model"
import { amountFromRay } from "../common-function"
import { BigNumber } from "bignumber.js"

export const spotIlks$ = async ({ ilks }: Ilks) => {
  const spot = initialContract(spotAbi, MCD_SPOT)
  const { pip, mat } = await spot.methods.ilks(Web3.utils.utf8ToHex(ilks)).call()

  return {
    priceFeedAddress: pip,
    liquidationRatio: amountFromRay(new BigNumber(mat)),
  }
}
