import { createIlkData$ } from "../../helpers/ilks"
import { createController$ } from "../../helpers/proxy/controller"
import { createOraclePriceData$ } from "../../helpers/pip/oracle"
import {
  cdpManagerIlks$,
  cdpManagerOwner$,
  cdpManagerUrns$,
} from "../../helpers/cdpManager/cdpManager"
import { vatGem$, vatUrns$ } from "../../helpers/ilks/vat"
import { ilkToToken } from "../../helpers/common-function"
import { one, zero } from "../../constants/zero"
import { BigNumber } from "bignumber.js"
import { HOUR, SECONDS_PER_YEAR } from "../../constants/variables"
import { getProxyAddress, initialContract } from "../../helpers/web3"
import getCdpsAbi from "../../blockchain/abi/get-cdps.json"
import { CDP_MANAGER, GET_CDPS } from "../../blockchain/addresses/moonbeam.json"
import { ethers } from "ethers"

export const fetchAllLoansByAddress = async (address: string) => {
  const proxy = await getProxyAddress(address)
  console.log(proxy)
  if (proxy === ethers.constants.AddressZero) {
    return []
  }

  const contract = initialContract(getCdpsAbi, GET_CDPS)
  const cdp = await contract.methods.getCdpsAsc(CDP_MANAGER, proxy).call()

  console.log(cdp)

  const { ids } = cdp
  const _ids = ids.map(
    (id) =>
      new BigNumber({
        s: 1,
        e: 3,
        c: [parseFloat(id)],
        _isBigNumber: true,
      }),
  )

  const allLoans = await Promise.all(
    _ids.map((id) =>
      fetchLoanById(id)
    ),
  )

  console.log(allLoans)

  return allLoans
}

export const fetchLoanById = async (loanId: string) => {
  try {
    const id = parseInt(loanId)

    const loanDetail = await Promise.all([
      cdpManagerUrns$(id),
      cdpManagerIlks$(id),
      cdpManagerOwner$(id),
      createController$(id),
    ])
      .then(([urnAddress, ilk, owner, controller]) => {
        console.log(ilk)
        const token = ilkToToken(ilk)
        return Promise.all([
          vatUrns$({ilks: ilk, urnAddress: urnAddress}),
          vatGem$({ilks: ilk, urnAddress: urnAddress}),
          createOraclePriceData$(token),
          createIlkData$(ilk),
          Promise.resolve(urnAddress),
          Promise.resolve(ilk),
          Promise.resolve(owner),
          Promise.resolve(controller),
          Promise.resolve(token),
        ])
      })
      .then((res) => {
        console.log(res)
        const [
          {collateral, normalizedDebt},
          unlockedCollateral,
          {currentPrice, nextPrice},
          {
            debtScalingFactor,
            liquidationRatio,
            collateralizationDangerThreshold,
            collateralizationWarningThreshold,
            stabilityFee,
            ilkDebtAvailable,
          },
          urnAddress,
          ilk,
          owner,
          controller,
          token,
        ] = res
        const collateralUSD = collateral.times(currentPrice)
        const collateralUSDAtNextPrice = nextPrice ? collateral.times(nextPrice) : currentPrice

        const debt = debtScalingFactor.times(normalizedDebt)

        const debtOffset = !debt.isZero()
          ? debt
            .times(one.plus(stabilityFee.div(SECONDS_PER_YEAR)).pow(HOUR * 5))
            .minus(debt)
            .dp(18, BigNumber.ROUND_DOWN)
          : new BigNumber("1e-18")

        const backingCollateral = debt.times(liquidationRatio).div(currentPrice)

        const backingCollateralAtNextPrice = debt.times(liquidationRatio).div(nextPrice)
        const backingCollateralUSD = backingCollateral.times(currentPrice)
        const backingCollateralUSDAtNextPrice = backingCollateralAtNextPrice.times(nextPrice)

        const freeCollateral = backingCollateral.gte(collateral)
          ? zero
          : collateral.minus(backingCollateral)
        const freeCollateralAtNextPrice = backingCollateralAtNextPrice.gte(collateral)
          ? zero
          : collateral.minus(backingCollateralAtNextPrice)

        const freeCollateralUSD = freeCollateral.times(currentPrice)
        const freeCollateralUSDAtNextPrice = freeCollateralAtNextPrice.times(nextPrice)

        const collateralizationRatio = debt.isZero() ? zero : collateralUSD.div(debt)
        const collateralizationRatioAtNextPrice = debt.isZero()
          ? zero
          : collateralUSDAtNextPrice.div(debt)

        const maxAvailableDebt = collateralUSD.div(liquidationRatio)
        const maxAvailableDebtAtNextPrice = collateralUSDAtNextPrice.div(liquidationRatio)

        const availableDebt = debt.lt(collateralUSD.div(liquidationRatio))
          ? maxAvailableDebt.minus(debt)
          : zero

        const availableDebtAtNextPrice = debt.lt(maxAvailableDebtAtNextPrice)
          ? maxAvailableDebtAtNextPrice.minus(debt)
          : zero

        const liquidationPrice = collateral.eq(zero)
          ? zero
          : debt.times(liquidationRatio).div(collateral)

        const daiYieldFromLockedCollateral = availableDebt.lt(ilkDebtAvailable)
          ? availableDebt
          : ilkDebtAvailable.gt(zero)
            ? ilkDebtAvailable
            : zero
        const atRiskLevelWarning =
          collateralizationRatio.gte(collateralizationDangerThreshold) &&
          collateralizationRatio.lt(collateralizationWarningThreshold)

        const atRiskLevelDanger =
          collateralizationRatio.gte(liquidationRatio) &&
          collateralizationRatio.lt(collateralizationDangerThreshold)

        const underCollateralized =
          !collateralizationRatio.isZero() && collateralizationRatio.lt(liquidationRatio)

        const atRiskLevelWarningAtNextPrice =
          collateralizationRatioAtNextPrice.gte(collateralizationDangerThreshold) &&
          collateralizationRatioAtNextPrice.lt(collateralizationWarningThreshold)

        const atRiskLevelDangerAtNextPrice =
          collateralizationRatioAtNextPrice.gte(liquidationRatio) &&
          collateralizationRatioAtNextPrice.lt(collateralizationDangerThreshold)

        const underCollateralizedAtNextPrice =
          !collateralizationRatioAtNextPrice.isZero() &&
          collateralizationRatioAtNextPrice.lt(liquidationRatio)

        return {
          id: id,
          ilk,
          token,
          address: urnAddress,
          owner,
          controller,
          lockedCollateral: collateral,
          lockedCollateralUSD: collateralUSD,
          backingCollateral,
          backingCollateralUSD,
          freeCollateral,
          freeCollateralUSD,
          lockedCollateralUSDAtNextPrice: collateralUSDAtNextPrice,
          backingCollateralAtNextPrice,
          backingCollateralUSDAtNextPrice,
          freeCollateralAtNextPrice,
          freeCollateralUSDAtNextPrice,
          normalizedDebt,
          debt,
          debtOffset,
          availableDebt,
          availableDebtAtNextPrice,
          unlockedCollateral,
          collateralizationRatio,
          collateralizationRatioAtNextPrice,
          liquidationPrice,
          daiYieldFromLockedCollateral,

          atRiskLevelWarning,
          atRiskLevelDanger,
          underCollateralized,
          atRiskLevelWarningAtNextPrice,
          atRiskLevelDangerAtNextPrice,
          underCollateralizedAtNextPrice,
        }
      })

    console.log(loanDetail)

    return loanDetail
  } catch (err) {
    console.log('fetch detail error: ', err.message)
  }
}
