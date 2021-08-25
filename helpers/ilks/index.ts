import { vatIlks$ } from "./vat"
import { spotIlks$ } from "./spot"
import { jugIlks$ } from "./jug"
import { catIlks$ } from "./cat"
import { BigNumber } from "bignumber.js"
import { one, zero } from "../../constants/zero"
import { ilkToToken } from "../common-function"
import { IlkWithBalance, TagFilter } from "../model"
import { CoinTag } from "../../constants/variables"
import { getToken } from "../../blockchain/tokensMetadata"

export const COLLATERALIZATION_DANGER_OFFSET = new BigNumber("0.2") // 150% * 1.2 = 180%
export const COLLATERALIZATION_WARNING_OFFSET = new BigNumber("0.5") // 150% * 1.5 = 225%

export const createIlkData$ = async (ilk: string) => {
  const ilks = {
    ilks: ilk,
  }

  console.log(ilk)

  const res = Promise.all([
    await vatIlks$(ilks),
    await spotIlks$(ilks),
    await jugIlks$(ilks),
    await catIlks$(ilks),
  ]).then(
    ([
      { normalizedIlkDebt, debtScalingFactor, maxDebtPerUnitCollateral, debtCeiling, debtFloor },
      { priceFeedAddress, liquidationRatio },
      { stabilityFee, feeLastLevied },
      { liquidatorAddress, liquidationPenalty, maxAuctionLotSize },
    ]) => {
      const collateralizationDangerThreshold = liquidationRatio.times(
        COLLATERALIZATION_DANGER_OFFSET.plus(one),
      )
      const collateralizationWarningThreshold = liquidationRatio.times(
        COLLATERALIZATION_WARNING_OFFSET.plus(one),
      )

      return {
        collateralizationDangerThreshold,
        collateralizationWarningThreshold,
        normalizedIlkDebt,
        debtScalingFactor,
        maxDebtPerUnitCollateral,
        debtCeiling,
        debtFloor,
        priceFeedAddress,
        liquidationRatio,
        stabilityFee,
        feeLastLevied,
        liquidatorAddress,
        liquidationPenalty,
        maxAuctionLotSize,
        token: ilkToToken(ilk),
        ilk,
        ilkDebt: normalizedIlkDebt.times(debtScalingFactor).decimalPlaces(18, BigNumber.ROUND_DOWN),
        ilkDebtAvailable: BigNumber.max(
          debtCeiling
            .minus(debtScalingFactor.times(normalizedIlkDebt))
            .decimalPlaces(18, BigNumber.ROUND_DOWN),
          zero,
        ),
      }
    },
  )

  return res
}

export function filterByTag(ilks: IlkWithBalance[], tag: TagFilter | undefined) {
  if (tag === undefined) {
    return ilks
  }
  return ilks.filter((ilk) => {
    const tokenMeta = getToken(ilk.token)

    return (tokenMeta.tags as CoinTag[]).includes(tag)
  })
}
