import { cdpManagerOwner$ } from "../cdpManager/cdpManager"
import { createProxyOwner$ } from "./proxy"
import { BigNumber } from "bignumber.js"

export const createController$ = async (loanId: BigNumber) => {
  const cdpOwner = await cdpManagerOwner$(loanId)
  return await createProxyOwner$(cdpOwner)
}
