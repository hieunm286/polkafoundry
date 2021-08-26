import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Grid, Spinner } from "theme-ui"
import CustomLoanInput from "../../components/CustomLoanInput"
import styled from "styled-components"
import { CommonPTag, CommonSpanTag, DEFAULT_DEVICE, DivTextCenter } from "../../constants/styles"
import { fire, orange, vanilla } from "../../constants/color"
import {
  calculateTokenPrecisionByValue,
  formatBigNumber,
  formatCryptoBalance,
  formatFiatBalance,
  formatInputNumber, multi,
  notifySuccess,
  rem,
  sub,
} from "../../helpers/common-function"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  connectionAccountState,
  CREATE_LOAN_STAGE,
  createLoanStage,
  inputValueCreateLoanBorrow,
  inputValueCreateLoanDeposite,
  proxyAccountAddress,
  triggerUpdate,
} from "../../recoil/atoms"
import { ethers } from "ethers"
import {
  Amount,
  getETHBalance,
  getOpenCallData,
  getTotalBalance,
  getTotalBalanceByTokenAddress,
  OpenCallData,
} from "../../helpers/web3"
import Web3 from "web3"
import dsProxyAbi from "../../blockchain/abi/ds-proxy.json"
import dsProxyActionsAbi from "../../blockchain/abi/dss-proxy-actions.json"
import erc20 from "../../blockchain/abi/erc20.json"
import {
  PROXY_ACTIONS,
  ETH,
  MCD_JOIN_DAI,
  MCD_JUG,
  CDP_MANAGER,
  MCD_JOIN_ETH_A,
} from "../../blockchain/addresses/moonbeam.json"
import { BigNumber } from "bignumber.js"
import { one, zero } from "../../constants/zero"
import { MaxUint } from "../../constants/variables"
import Link from "next/link"
import LoanInformation from "../../components/LoanInformation"
import { caculateCollRatio } from "../../components/TemplateCreate"
import { getLastCdp } from "../../helpers/loan"
import {useTranslation} from "next-i18next";

const ERRORS_LIST = {
  greaterThanBalance: "You cannot deposit more collateral than the amount in your wallet",
  greaterThanBorrowPUSD: "You are borrowing too much. Please borrow less PUSD",
  minimumBorrow: "minimumBorrow"
}

function convertStringToUTF8ByteArray(str: string) {
  const binaryArray = new Uint8Array(str.length)
  Array.prototype.forEach.call(binaryArray, function (el, idx, arr) {
    arr[idx] = str.charCodeAt(idx)
  })
  return binaryArray
}

const LoanEditing = ({
  ilk,
  onChangeAmount,
  maxDebt,
  review,
  currentPrice,
  liquidationPrice,
  debtFloor
}: {
  ilk: string
  onChangeAmount: (amount: string, kind: "borrow" | "deposit") => void
  maxDebt?: BigNumber
  review: { label: string; value: string }[]
  currentPrice?: BigNumber
  liquidationPrice?: BigNumber
  debtFloor?: BigNumber
}) => {
  const address = useRecoilValue(connectionAccountState)
  const [depositValue, setDepositValue] = useRecoilState(inputValueCreateLoanDeposite)
  const [borrowValue, setBorrowValue] = useRecoilState(inputValueCreateLoanBorrow)
  const userProxy = useRecoilValue(proxyAccountAddress)
  const setCreateStage = useSetRecoilState(createLoanStage)
  const [balance, setBalance] = useState<string>("0")
  const [token, setToken] = useState<string>("")
  const [errors, setErrors] = useState<string[]>([])
  const [step, setStep] = useRecoilState(createLoanStage)
  const [loading, setLoading] = useState(false)
  const [tx, setTx] = useState(undefined)
  const [trigger, setTrigger] = useRecoilState(triggerUpdate)
  const [lastLoan, setLastLoan] = useState<string | undefined>(undefined)
  const { t } = useTranslation()

  useEffect(() => {
    const getWalletBalance = async (): Promise<void> => {
      try {
        if (!address) {
          return
        }
        // For kovan
        const balance = await getETHBalance(address)
        setBalance(balance)
        setToken("DEV")

        // For polkadot
        // const { balance, token } = await getTotalBalanceByTokenAddress(address, ETH)
        // setBalance(balance)
        // setToken(token)
      } catch (err) {
        console.log(err.message)
      }
    }

    void getWalletBalance()
  }, [address, trigger])

  useEffect(() => {
    setTx(undefined)
    setLastLoan(undefined)
  }, [step])

  useEffect(() => {
    if (tx) {
      if (!userProxy) {
        return
      }
      void getLastCdp(userProxy)
        .then((res) => {
          setLastLoan(res.id)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [tx, userProxy])

  useEffect(() => {
    checkValidInput()
  }, [depositValue, borrowValue])

  const onClickSetupProxy = () => {
    setCreateStage(CREATE_LOAN_STAGE.createProxy)
  }

  const checkValidInput = useCallback(() => {
    const maxBorrow = maxDebt && depositValue
      ? formatInputNumber(
        parseFloat(depositValue) * parseFloat(formatInputNumber(maxDebt.toString())),
        2,
      )
      : "0"
    const cInput = parseFloat(depositValue)
    const cCurrent = parseFloat(balance)

    const setError = new Set(errors)

    if (cInput > cCurrent) {
      console.log('aaaaaa')
      setError.add(ERRORS_LIST.greaterThanBalance)
    } else {
      console.log('bbbbbb')
      setError.delete(ERRORS_LIST.greaterThanBalance)
    }

    if (parseFloat(borrowValue) > parseFloat(maxBorrow)) {
      setError.add(ERRORS_LIST.greaterThanBorrowPUSD)
    } else {
      setError.delete(ERRORS_LIST.greaterThanBorrowPUSD)
    }

    if (parseFloat(borrowValue) < parseFloat(debtFloor ? debtFloor.toString() : '0')) {
      setError.add(ERRORS_LIST.minimumBorrow)
    } else {
      setError.delete(ERRORS_LIST.minimumBorrow)
    }

    const newError = Array.from(setError)
    setErrors(newError)

  }, [depositValue, borrowValue, debtFloor, balance, maxDebt])

  const onChangeDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatInputNumber(e.target.value)
    setDepositValue(value)
    onChangeAmount(value, "deposit")
  }

  const onChangeBorrow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatInputNumber(e.target.value)
    setBorrowValue(value)
    onChangeAmount(value, "borrow")
  }

  const handleConfirmOpenLoan = async () => {
    if (!address || !userProxy) return
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(dsProxyAbi as any, userProxy)

    const context: OpenCallData = {
      dssProxyActions: dsProxyActionsAbi,
      dssCdpManager: CDP_MANAGER,
      mcdJug: MCD_JUG,
      mcdJoinDai: MCD_JOIN_DAI,
      joinsIlk: MCD_JOIN_ETH_A,
    }

    const amount: Amount = {
      depositAmount: depositValue,
      borrowAmount: borrowValue,
      proxyAddress: userProxy,
      ilk: ilk,
      token: "ETH",
    }

    try {
      const encodeData = getOpenCallData(amount, context).encodeABI()
      await contract.methods
        .execute(PROXY_ACTIONS, encodeData)
        .send(
          {
            from: address,
            value: Web3.utils.toWei(`${depositValue}`, "ether"),
            gas: 807021,
            gasPrice: new BigNumber({
              s: 1,
              e: 9,
              c: [2020000000],
              _isBigNumber: true,
            }),
          },
          // eslint-disable-next-line handle-callback-err
          function (err, receipt) {
            console.log(receipt)
            setLoading(true)
          },
        )
        // eslint-disable-next-line handle-callback-err
        .on("error", function (error, receipt) {
          console.log(receipt)
          setLoading(false)
        })
        .on("receipt", function (receipt) {
          console.log(receipt)
          setTx(receipt.transactionHash)
          setLoading(false)
          setDepositValue("")
          setBalance("")
          setErrors([])
          setTrigger(!trigger)
          notifySuccess("✅ Transaction submitted successfully")
        })
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const finalReview = useMemo(
    (): typeof review => [
      {
        label: "inWallet",
        value: formatInputNumber(balance) + " " + token,
      },
      {
        label: "depositToLoan",
        value: formatInputNumber(depositValue) + " " + token,
      },
      {
        label: "remainingInWallet",
        value: sub(balance, depositValue) + " " + token,
      },
      {
        label: "pUSDBeingBorrowed",
        value: borrowValue ? formatInputNumber(borrowValue) + " " + "pUSD" : "0 pUSD",
      },
      {
        label: "collaterizationRatio",
        value: currentPrice
          ? caculateCollRatio(
              formatInputNumber(currentPrice.toString()),
              borrowValue,
              depositValue,
            ) +
            " " +
            token
          : "0%",
      },
      {
        label: "liquidationPrice",
        value: liquidationPrice ? formatFiatBalance(liquidationPrice) + " " + token : "0",
      },
      ...review,
    ],
    [review, liquidationPrice, currentPrice, depositValue, borrowValue, balance, token],
  )

  return (
    <div>
      {step === CREATE_LOAN_STAGE.editForm && (
        <Grid>
          <CustomLoanInput
            value={depositValue}
            onChange={onChangeDeposit}
            walletLabel={"In Wallet"}
            maxValue={balance}
            showMax={false}
            token={token}
            action={`Deposit`}
            exchangeUSDT={multi(depositValue, currentPrice ? currentPrice.toString() : '0')}
          />
          <Divider>
            <CommonPTag fColor={orange}>----------------------</CommonPTag>
            <img src={"/images/icon/down.svg"} alt={""} />
            <CommonPTag fColor={orange}>----------------------</CommonPTag>
          </Divider>
          <CustomLoanInput
            value={borrowValue}
            onChange={onChangeBorrow}
            walletLabel={"Max"}
            maxValue={
              maxDebt && depositValue
                ? formatInputNumber(
                    parseFloat(depositValue) * parseFloat(formatInputNumber(maxDebt.toString())),
                    2,
                  )
                : "0"
            }
            showMax={false}
            showExchangeUSDT={false}
            token={`pUSD`}
            action={`Borrow`}
          />
          {errors.length > 0 && (
            <ErrorContainer>
              {
                // eslint-disable-next-line handle-callback-err
                errors.map((err, idx) => (
                  <Grid key={idx} columns={["5px 1fr"]}>
                    <CommonPTag fSize={12} weight={400} fColor={fire}>
                      •
                    </CommonPTag>
                    <CommonPTag fSize={12} weight={400} fColor={fire}>
                      {t(err, { debtFloor: debtFloor || '' })}
                    </CommonPTag>
                  </Grid>
                ))
              }
            </ErrorContainer>
          )}
          {userProxy === ethers.constants.AddressZero ? (
            <Button onClick={onClickSetupProxy}>
              <CommonSpanTag>Setup Proxy</CommonSpanTag>
            </Button>
          ) : (
            <Button onClick={() => setStep(CREATE_LOAN_STAGE.confirmation)} disabled={
              errors.length > 0 ||
              ((!depositValue || parseFloat(depositValue) <= 0) &&
                (!borrowValue || parseFloat(borrowValue) <= 0))
            }>
              <CommonSpanTag>Creat Loan</CommonSpanTag>
            </Button>
          )}
        </Grid>
      )}
      {step === CREATE_LOAN_STAGE.confirmation && (
        <>
          <LoanInformation loanInfo={finalReview} />
          <DivTextCenter>
            {lastLoan ? (
              // Uncomment for moonbeam or kovan
              <Link href={`/${lastLoan}`}>
                <Button>
                  <CommonSpanTag>Go to Loan #{lastLoan}</CommonSpanTag>
                </Button>
              </Link>
            ) : (
              <Button onClick={handleConfirmOpenLoan} disabled={loading}>
                {loading && <Spinner sx={{ color: "#500EC1", marginRight: 2 }} size={24} />}
                <CommonSpanTag>Confirm</CommonSpanTag>
              </Button>
            )}
            {tx ? (
              // <a
              //   href={`https://moonbase-blockscout.testnet.moonbeam.network/tx/${tx}`}
              //   target="_blank"
              //   rel={`noreferrer noopener`}
              // >
                <a href={`https://kovan.etherscan.io/tx/${tx}`} target="_blank" rel={`noreferrer noopener`}>
                <Back>View transaction</Back>
              </a>
            ) : !loading ? (
              <Back onClick={() => setStep(CREATE_LOAN_STAGE.editForm)}>Back to Loan setup</Back>
            ) : (
              <></>
            )}
          </DivTextCenter>
        </>
      )}
    </div>
  )
}

export default LoanEditing

const Divider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Button = styled.button`
  background: ${(props) =>
    props.disabled ? "#C8C6E5" : `linear-gradient(to bottom, #903afd -13.58%, #492cff 102.52%)`};
  border-radius: 32px;
  margin: ${rem(20)} auto 0;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    color: ${(props) => (props.disabled ? "#500EC1" : "white")};
  }

  @media ${DEFAULT_DEVICE.tablet} {
    width: ${rem(218)};
    height: ${rem(40)};
  }
`

const ErrorContainer = styled.div`
  background: #2c204f;
  box-shadow: 0 ${rem(6)} ${rem(16)} rgba(38, 23, 70, 0.5);
  border-radius: ${rem(4)};
  padding: ${rem(16)} ${rem(12)};
`

const Back = styled.p`
  color: ${orange};
  font-weight: bold;
  font-size: ${rem(16)};

  cursor: pointer;
`
