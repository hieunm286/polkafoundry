import { initialContract } from "../web3"
import Web3 from "web3"
import { amountFromRad, amountFromRay } from "../common-function"
import { amountFromWei } from "@oasisdex/utils"
import { Ilks } from "../model"
import { BigNumber } from "bignumber.js"
import vatAbi from "../../blockchain/abi/vat.json"
import { CDP_MANAGER, MCD_VAT } from "../../blockchain/addresses/moonbeam.json"
import cdpManagerAbi from "../../blockchain/abi/dss-cdp-manager.json"

export const vatIlks$ = async ({ ilks }: Ilks) => {
  const vatContract = initialContract(vatAbi, MCD_VAT)
  const vatIlks = await vatContract.methods.ilks(Web3.utils.utf8ToHex(ilks)).call()

  return {
    normalizedIlkDebt: amountFromWei(new BigNumber(vatIlks.Art)),
    debtScalingFactor: amountFromRay(new BigNumber(vatIlks.rate)),
    maxDebtPerUnitCollateral: amountFromRay(new BigNumber(vatIlks.spot)),
    debtCeiling: amountFromRad(new BigNumber(vatIlks.line)),
    debtFloor: amountFromRad(new BigNumber(vatIlks.dust)),
  }
}

export const vatUrns$ = async ({ ilks, urnAddress }: Ilks & { urnAddress: string }) => {
  const vatContract = initialContract(vatAbi, MCD_VAT)
  const urn = await vatContract.methods.urns(Web3.utils.utf8ToHex(ilks), urnAddress).call()
  console.log(urnAddress)
  console.log(urn)
  return {
    collateral: amountFromWei(new BigNumber(urn.ink)),
    normalizedDebt: amountFromWei(new BigNumber(urn.art)),
  }
}

export const vatGem$ = async ({ ilks, urnAddress }: Ilks & { urnAddress: string }) => {
  const vatContract = initialContract(vatAbi, MCD_VAT)

  const gem = await vatContract.methods.gem(Web3.utils.utf8ToHex(ilks), urnAddress).call()

  return amountFromWei(new BigNumber(gem))
}
