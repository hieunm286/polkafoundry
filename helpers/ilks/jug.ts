import { Ilks } from "../model"
import { initialContract } from "../web3"
import mcdJugAbi from "../../blockchain/abi/mcd-jug.json"
import { MCD_JUG } from "../../blockchain/addresses/moonbeam.json"
import Web3 from "web3"
import { BigNumber } from "bignumber.js"
import { RAY, SECONDS_PER_YEAR } from "../../constants/variables"

export const jugIlks$ = async ({ ilks }: Ilks) => {
  const jug = initialContract(mcdJugAbi, MCD_JUG)
  const { 0: rawFee, 1: rawLastLevied }: any = await jug.methods
    .ilks(Web3.utils.utf8ToHex(ilks))
    .call()
  const v = new BigNumber(rawFee).dividedBy(RAY)
  BigNumber.config({ POW_PRECISION: 100 })
  const stabilityFee = v.pow(SECONDS_PER_YEAR).minus(1)
  const feeLastLevied = new Date(rawLastLevied * 1000)
  return { stabilityFee, feeLastLevied }
}
