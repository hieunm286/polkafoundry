import BigNumber from 'bignumber.js'
// import {CatIlk} from "../blockchain/calls/cat";
// import {JugIlk} from "../blockchain/calls/jug";
// import {SpotIlk} from "../blockchain/calls/spot";
// import {VatIlk} from "../blockchain/calls/vat";
import {CoinTag} from "../blockchain/tokensMetadata";
import {Dictionary} from "ts-essentials";

export type Direction = 'ASC' | 'DESC' | undefined

export interface IlkWithBalance extends IlkData {
  balance?: BigNumber
  balancePriceInUsd?: BigNumber
}

interface DerivedIlkData {
  token: string
  ilk: string
  ilkDebt: BigNumber
  ilkDebtAvailable: BigNumber
  collateralizationDangerThreshold: BigNumber
  collateralizationWarningThreshold: BigNumber
}
export type IlkData = any & DerivedIlkData

export type IlkSortBy =
  | 'ilkDebtAvailable'
  | 'stabilityFee'
  | 'liquidationRatio'
  | undefined

export type TagFilter = CoinTag | 'popular' | 'balance' | 'loanDetail' | 'loanHistory' | 'pUSD' | 'collateral' | undefined

export type Change<S, K extends keyof S> = {
  kind: K
} & {
  [value in K]: S[K]
}

type Changes =
  | Change<IlksFilterState, 'sortBy'>
  | Change<IlksFilterState, 'search'>
  | Change<IlksFilterState, 'tagFilter'>

export interface IlksFilterState {
  sortBy?: IlkSortBy
  direction?: Direction
  search: string
  tagFilter: TagFilter
  change?: (ch: Changes) => void
}

export interface LoanDetail {
  label: string;
  value: string | number;
  token?: string;
  change?: string
}

export interface LoanHistory {
  action: string;
  amount: string | number | undefined;
  token: string | undefined;
  time: any;
  txtHash: string
}

export interface Ilks {
  ilks: string
}

export interface VaultSummary {
  totalCollateralPrice: BigNumber
  totalDaiDebt: BigNumber
  numberOfVaults: number
  vaultsAtRisk: number
  depositedAssetRatio: Dictionary<BigNumber>
}

export interface Vault {
  id: BigNumber
  owner: string
  controller?: string
  token: string
  ilk: string
  address: string
  lockedCollateral: BigNumber
  unlockedCollateral: BigNumber
  lockedCollateralUSD: BigNumber
  lockedCollateralUSDAtNextPrice: BigNumber
  backingCollateral: BigNumber
  backingCollateralAtNextPrice: BigNumber
  backingCollateralUSD: BigNumber
  backingCollateralUSDAtNextPrice: BigNumber
  freeCollateral: BigNumber
  freeCollateralAtNextPrice: BigNumber
  freeCollateralUSD: BigNumber
  freeCollateralUSDAtNextPrice: BigNumber
  debt: BigNumber
  debtOffset: BigNumber
  normalizedDebt: BigNumber
  availableDebt: BigNumber
  availableDebtAtNextPrice: BigNumber
  collateralizationRatio: BigNumber
  collateralizationRatioAtNextPrice: BigNumber
  liquidationPrice: BigNumber
  daiYieldFromLockedCollateral: BigNumber

  atRiskLevelWarning: boolean
  atRiskLevelDanger: boolean
  underCollateralized: boolean

  atRiskLevelWarningAtNextPrice: boolean
  atRiskLevelDangerAtNextPrice: boolean
  underCollateralizedAtNextPrice: boolean
}
