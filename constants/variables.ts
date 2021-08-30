import type { ElementOf } from "ts-essentials"
import { LoanHistory } from "../helpers/model"
import { BigNumber } from "bignumber.js"
import mcdOsmAbi from "../blockchain/abi/mcd-osm.json"
import { default as kovan } from "../blockchain/addresses/kovan.json"
import { default as polkadot } from "../blockchain/addresses/polkadot.json"
import { default as moonbeam } from "../blockchain/addresses/moonbeam.json"
import { getCollateralJoinContracts } from "../blockchain/addresses/addressesUtils"

export const WAD = new BigNumber("1e18")
export const RAY = new BigNumber("1e27")
export const RAD = new BigNumber("1e45")

export const HOUR = 60 * 60
export const DAY = 24 * HOUR
export const SECONDS_PER_YEAR = 365 * DAY

export const test = [
  {
    name: "ETH",
    price: "1$",
    ilk: "ETH",
  },
  {
    name: "BSC",
    price: "2$",
    ilk: "BSC",
  },
  {
    name: "SOTA",
    price: "3$",
    ilk: "SOTA",
  },
  {
    name: "USDT",
    price: "4$",
    ilk: "USDT",
  },
  {
    name: "NFTA",
    price: "5$",
    ilk: "NFTA",
  },
]

export const loadDetailTest: LoanHistory[] = [
  {
    action: "Deposit",
    amount: "500",
    token: "pUSD",
    time: new Date(),
    txtHash: "txsasafsdfsdfsdfsdfsdfsdf123sdf",
  },
  {
    action: "Borrow",
    amount: "0.5",
    token: "ETH",
    time: new Date(),
    txtHash: "txsasafsdfsdfsdfsdf321sdfsdfsdf",
  },
  {
    action: "Create new Loan #122",
    amount: undefined,
    token: undefined,
    time: new Date(),
    txtHash: "txsasafsdfsd3211fsdfsdfsdfsdfsdf",
  },
]

export const MaxUint =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"

export const COIN_TAGS = ["stablecoin", "lp-token"] as const
export type CoinTag = ElementOf<typeof COIN_TAGS>

export const MULTICHAIN = {
  kovan: {
    ...kovan
  },
  polka: {
    ...polkadot
  },
  moonbeam: {
    ...moonbeam
  }
}

export const mcdData = (network = 'kovan') => {
  return {
    ETH: {
      abi: mcdOsmAbi,
      address: MULTICHAIN[network].PIP_ETH
    }
  }
}

export const MULTICHAIN_SETUP = {
  kovan: {
    token: { ...getCollateralJoinContracts(kovan) },
    address: { ...kovan },
    nativeSymbol: 'ETH'
  },
  polka: {
    token: { ...getCollateralJoinContracts(polkadot) },
    address: { ...polkadot },
    nativeSymbol: 'ETH'
  },
  moonbeam: {
    token: { ...getCollateralJoinContracts(moonbeam) },
    address: { ...moonbeam },
    nativeSymbol: 'DEV'
  }
}
