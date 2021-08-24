import { pipHop$, pipPeek$, pipPeep$, pipZzz$ } from "./pip"
import Web3 from "web3"
import { mcdData } from "../../constants/variables"
import { BigNumber } from "bignumber.js"
import { getToken } from "../../blockchain/tokensMetadata"
import { zero } from "../../constants/zero"

const DSVALUE_APPROX_SIZE = 6000

export interface OraclePriceData {
  currentPrice: BigNumber
  nextPrice: BigNumber
  currentPriceUpdate?: Date
  nextPriceUpdate?: Date
  priceUpdateInterval?: number
  isStaticPrice: boolean
  percentageChange: BigNumber
}

function transformOraclePrice({
  token,
  oraclePrice,
}: {
  token: string
  oraclePrice: [string, boolean]
}): BigNumber {
  const precision = getToken(token).precision
  const rawPrice = new BigNumber(oraclePrice[0])
    .shiftedBy(-18)
    .toFixed(precision, BigNumber.ROUND_DOWN)
  return new BigNumber(rawPrice)
}

function calculatePricePercentageChange(current: BigNumber, next: BigNumber): BigNumber {
  const rawPriceChange = current.div(next)
  if (rawPriceChange.isZero()) return zero
  return current.minus(next).div(current).times(-1)
}

export const createOraclePriceData$ = async (token: string) => {
  const web3 = new Web3(Web3.givenProvider)
  const contractData = await web3.eth.getCode(mcdData()[token].address)

  const promise =
    contractData.length > DSVALUE_APPROX_SIZE
      ? Promise.all([
          await pipPeek$(token),
          await pipPeep$(token),
          await pipZzz$(token),
          await pipHop$(token),
          false,
        ])
      : Promise.all([
        await pipPeek$(token),
        await Promise.resolve(),
        await Promise.resolve(),
        await Promise.resolve(),
        true
      ])

  const res = promise.then(([peek, peep, zzz, hop, isStaticPrice]) => {
    const currentPriceUpdate = zzz ? new Date(zzz.toNumber()) : undefined
    const nextPriceUpdate = zzz && hop ? new Date(zzz.plus(hop).toNumber()) : undefined
    const priceUpdateInterval = hop ? hop.toNumber() : undefined
    const currentPrice = transformOraclePrice({ token, oraclePrice: peek })
    const nextPrice = peep ? transformOraclePrice({ token, oraclePrice: peep }) : currentPrice

    const percentageChange = calculatePricePercentageChange(currentPrice, nextPrice)

    return {
      currentPrice,
      nextPrice: nextPrice,
      currentPriceUpdate,
      nextPriceUpdate,
      priceUpdateInterval,
      isStaticPrice,
      percentageChange,
    }
  })

  return res
}
