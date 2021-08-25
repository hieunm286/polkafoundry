import { cdpManagerOwner$ } from "../cdpManager/cdpManager"
import { createProxyOwner$ } from "./proxy"
import { BigNumber } from "bignumber.js"

export const createController$ = async (loanId: BigNumber | number) => {
  const cdpOwner = await cdpManagerOwner$(loanId)
  return await createProxyOwner$(cdpOwner)
}
