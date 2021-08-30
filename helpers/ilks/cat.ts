import { Ilks } from "../model"
import { initialContract } from "../web3"
import mcdCatAbi from "../../blockchain/abi/mcd-cat.json"
import { MCD_CAT } from "../../blockchain/addresses/kovan.json"
import Web3 from "web3"
import { amountFromWei } from "@oasisdex/utils"
import { amountFromRad } from "../common-function"
import { BigNumber } from "bignumber.js"
import { WAD } from "../../constants/variables"

export const catIlks$ = async ({ ilks }: Ilks) => {
  const cat = initialContract(mcdCatAbi, MCD_CAT)
  const { flip, chop, dunk }: any = await cat.methods.ilks(Web3.utils.utf8ToHex(ilks)).call()
  return {
    liquidatorAddress: flip,
    liquidationPenalty: amountFromWei(new BigNumber(chop).minus(WAD)),
    maxAuctionLotSize: amountFromRad(new BigNumber(dunk)),
  }
}
