import { BigNumber } from "bignumber.js"
import { isNumber } from "lodash"
import {billion, million, one, oneThousandth, ten, thousand, zero} from "../constants/zero"
import { getToken } from "../blockchain/tokensMetadata"
import Decimal from "decimal.js"
import React from "react"
import Web3 from "web3"
import { RAD, RAY, WAD } from "../constants/variables"
import {toast} from "react-toastify";

BigNumber.config({
  FORMAT: {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: " ",
    fractionGroupSize: 0,
  },
  EXPONENTIAL_AT: 100000,
})

const DEFAULT_RATIO = 16
export const rem = (pxValue: number | TemplateStringsArray | string) => {
  if (Array.isArray(pxValue)) {
    pxValue = pxValue[0]
  }

  pxValue = parseInt(pxValue as string + "")

  return `${pxValue / DEFAULT_RATIO}rem`
}

export const trimAddress = (address: string): string => {
  const s1 = address.substring(0, 5)
  const s2 = address.substring(address.length - 4)

  return s1 + "..." + s2
}

export const SaveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const GetFromLocalStorage = (key: string): any => {
  return JSON.parse(localStorage.getItem(key) ?? "")
}

export const RemoveFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key)
}

export function getIsInternalLink(href: string) {
  return href.startsWith("/") || href.startsWith("#")
}

export function toShorthandNumber(amount: BigNumber, suffix: string = "", precision?: number) {
  const sh = new BigNumber(
    amount
      .toString()
      .split(".")
      .map((part, index) => {
        if (index === 0) return part
        return part.substr(0, precision)
      })
      .filter((el) => el)
      .join("."),
  )
  if (precision) {
    return sh.toFixed(precision).concat(suffix)
  }
  return sh.toFixed().concat(suffix)
}

export function formatAsShorthandNumbers(amount: BigNumber, precision?: number): string {
  if (amount.absoluteValue().gte(billion)) {
    return toShorthandNumber(amount.dividedBy(billion), "B", precision)
  }
  if (amount.absoluteValue().gte(million)) {
    return toShorthandNumber(amount.dividedBy(million), "M", precision)
  }
  if (amount.absoluteValue().gte(thousand)) {
    return toShorthandNumber(amount.dividedBy(thousand), "K", precision)
  }
  return toShorthandNumber(amount, "", precision)
}

export function formatCryptoBalance(amount: BigNumber): string {
  const absAmount = amount.absoluteValue()

  if (absAmount.eq(zero)) {
    return formatAsShorthandNumbers(amount, 2)
  }

  if (absAmount.lt(oneThousandth)) {
    return `${amount.isNegative() ? "0.000" : "<0.001"}`
  }

  if (absAmount.lt(ten)) {
    return formatAsShorthandNumbers(amount, 4)
  }

  if (absAmount.lt(million)) return amount.toFormat(2, BigNumber.ROUND_DOWN)

  return formatAsShorthandNumbers(amount, 2)
}

interface FormatPercentOptions {
  precision?: number
  plus?: boolean
  roundMode?: BigNumber.RoundingMode
}

export function formatPercent(
  number: BigNumber,
  { precision = 0, plus = false, roundMode = undefined }: FormatPercentOptions = {},
) {
  const sign = plus && number.isGreaterThan(0) ? "+" : ""

  return `${sign}${number.toFixed(precision, roundMode)}%`
}

export const formatInputNumber = (numberString: string | number, decimal = 5): string => {
  numberString = (numberString as string) + ""

  numberString = numberString.replace(/[\uff01-\uff6e\uff61]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  })
  const charCode = numberString.charCodeAt(numberString.length - 1)
  if (charCode === 12290 || charCode === 129) {
    numberString = numberString.replace(/.$/, ".")
  }
  if (decimal === 0) {
    numberString = numberString.replace(/[^0-9]/g, "")
  } else {
    numberString = numberString.replace(/[^0-9.]/g, "")
  }
  if (numberString.length === 0) return ""
  const index = numberString.indexOf(".")
  if (index > 0) {
    let string = numberString.slice(index + 1)
    string = string.replace(/[^0-9]/g, "")
    const value = numberString.slice(0, index)
    if (string.length > decimal) {
      string = string.slice(0, decimal)
    }
    numberString = value + "." + string
  } else if (index === 0) {
    let string = numberString.slice(index + 1)
    string = string.replace(/[^0-9]/g, "")
    const value = "0"
    if (string.length > decimal) {
      string = string.slice(0, decimal)
    }
    numberString = value + "." + string
  } else {
    numberString = parseFloat(numberString)
  }

  if (isNumber(numberString)) {
    return `${numberString}`
  }
  return numberString
}

export function formatBigNumber(amount: BigNumber, digits: number) {
  return amount.dp(digits, BigNumber.ROUND_DOWN).toString()
}

export function calculateTokenPrecisionByValue({
  token,
  usdPrice,
}: {
  token: string
  usdPrice: BigNumber
}) {
  const ten = new Decimal(10)
  const price = new Decimal(usdPrice.toString())
  const tokenPrecision = getToken(token).precision
  const tokenPricePerDollar = price.pow(-1)
  const tokenPricePerCent = tokenPricePerDollar.times(new Decimal(10).pow(-2))

  const magnitude = tokenPricePerCent.logarithm(ten).times(-1).floor()
  return magnitude.gt(tokenPrecision) ? tokenPrecision : magnitude.gt(0) ? magnitude.toNumber() : 0
}

export function handleNumericInput(fn: (n?: BigNumber) => void) {
  return (e: string) => {
    const value = e.replace(/,/g, "")
    const amount = value !== "" ? new BigNumber(value) : undefined
    fn(amount)
  }
}

export function utf8ToBytes32(str: string): string {
  return Web3.utils.utf8ToHex(str).padEnd(66, "0")
}

export function ilkUrnAddressToString({
  ilk,
  urnAddress,
}: {
  ilk: string
  urnAddress: string
}): string {
  return `${ilk}-${urnAddress}`
}

export function amountFromRay(amount: BigNumber): BigNumber {
  return amount.div(RAY)
}

export function amountFromRad(amount: BigNumber): BigNumber {
  return amount.div(RAD)
}

export function funcSigTopic(v: string): string {
  //@ts-ignore
  return padEnd(ethAbi.encodeFunctionSignature(v), 66, "0")
}

export function amountToWei(amount: BigNumber, token: string): BigNumber {
  const precision = getToken(token).precision
  return amount.times(new BigNumber(10).pow(precision))
}

export function amountToWad(amount: BigNumber): BigNumber {
  return amount.times(WAD)
}

export function ilkToToken(ilk: string) {
  return ilk.split('-')[0]
}

export function formatFiatBalance(amount?: BigNumber): string {
  if (!amount) return "";
  const absAmount = amount.absoluteValue()

  if (absAmount.eq(zero)) return formatAsShorthandNumbers(amount, 2)
  if (absAmount.lt(one)) return formatAsShorthandNumbers(amount, 4)
  if (absAmount.lt(million)) return amount.toFormat(2, BigNumber.ROUND_DOWN)
  // We don't want to have numbers like 999999 formatted as 999.99k

  return formatAsShorthandNumbers(amount, 2)
}

export function checkLoanOwner(proxyAddress?: string, loanOwner?: string) {
  if (!proxyAddress || !loanOwner) return false;
  return proxyAddress === loanOwner
}

export function caculatorMaxpUSD(deposit: string, ratio: BigNumber, oldValue = '0') {
  console.log(deposit)
  console.log(ratio)
  console.log(oldValue)
  const cvDeposit = formatInputNumber(deposit)
  const cvRatio = formatInputNumber(ratio.toString())
  return formatInputNumber(`${parseFloat(cvDeposit) * parseFloat(cvRatio) + parseFloat(oldValue)}`, 2)
}

export const notifySuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export const sub = (a: string, b: string) => {
  return formatInputNumber(parseFloat(a) - parseFloat(b))
}

export const sum = (a: string, b: string) => {
  return formatInputNumber(parseFloat(a) + parseFloat(b))
}

export const multi = (a: string, b: string, decimal = 2) => {
  return formatInputNumber(parseFloat(a) * parseFloat(b), decimal)
}