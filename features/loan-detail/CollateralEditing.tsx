import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Grid, Spinner } from "theme-ui"
import CustomLoanInput from "../../components/CustomLoanInput"
import { CommonPTag, CommonSpanTag, DEFAULT_DEVICE, DivTextCenter } from "../../constants/styles"
import { fire, orange } from "../../constants/color"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  appContext,
  connectionAccountState,
  MANAGE_LOAN_STAGE,
  manageLoanStage,
  proxyAccountAddress,
  triggerUpdate,
} from "../../recoil/atoms"
import {
  caculatorMaxpUSD,
  checkLoanOwner,
  formatFiatBalance,
  formatInputNumber, multi,
  rem,
  sub,
  sum,
} from "../../helpers/common-function"
import styled from "styled-components"
import {
  checkApprove,
  getDepositAndGenerateCallData,
  getETHBalance,
  getWithdrawAndPaybackCallData,
  initialContract,
  LockAmount,
  OpenCallData,
  WithdrawAndPaybackData,
} from "../../helpers/web3"
import ConfirmationLoanChange from "./ConfirmationLoanChange"
import Web3 from "web3"
import dsProxyAbi from "../../blockchain/abi/ds-proxy.json"
import erc20 from "../../blockchain/abi/erc20.json"
import {
  CDP_MANAGER,
  MCD_JOIN_DAI,
  MCD_JOIN_ETH_A,
  MCD_JUG,
  PROXY_ACTIONS,
  MCD_DAI,
} from "../../blockchain/addresses/kovan.json"
import dsProxyActionsAbi from "../../blockchain/abi/dss-proxy-actions.json"
import { BigNumber } from "bignumber.js"
import { MaxUint } from "../../constants/variables"
import { caculateCollRatio } from "../../components/TemplateCreate"
import { caculateLiquidationPrice } from "../loan/CreateNewLoan"

interface LoanDetailEditProps {
  onClickNext: () => void
  loanInfo: any;
  onNewInfo: (deposit: string, borrow: string, newLiquidation: string, newCollRatio: string) => void;
  resetEditLoan: () => void
}

export const ERRORS_LIST = {
  greaterThanBalance: "You cannot deposit more collateral than the amount in your wallet",
  pUSDMustBe0OrGt100:
    "The Loan outstanding debt must be 0 or exceed 100.00 amount of pUSD. Please change your payback amount",
  greaterThanMaxPUSD: "You cannot payback more than current pUSD",
  greaterThanAvailableWithdraw: "You cannot withdraw more than you have",
  greaterThanBorrowPUSD: "You are borrowing too much. Please borrow less PUSD",
}

const CollateralEditing: React.FC<LoanDetailEditProps> = ({ onClickNext, loanInfo, onNewInfo, resetEditLoan }) => {
  const address = useRecoilValue(connectionAccountState)
  const AppContext = useRecoilValue(appContext)
  const [depositValue, setDepositValue] = useState("")
  const [withdrawValue, setWithdrawValue] = useState("")
  const [showAdvanceDeposit, setShowAdvanceDeposit] = useState(false)
  const [showAdvanceWithdraw, setShowAdvanceWithdraw] = useState(false)
  const [advanceDeposit, setAdvanceDeposit] = useState("")
  const [advanceWithdraw, setAdvanceWithdraw] = useState("")
  const [balance, setBalance] = useState<string>("0")
  const [token, setToken] = useState<string>("")
  const userProxy = useRecoilValue(proxyAccountAddress)
  const [errors, setErrors] = useState<string[]>([])
  const [manageStage, setManageStage] = useRecoilState(manageLoanStage)
  const [loading, setLoading] = useState(false)
  const [tx, setTx] = useState(undefined)
  const [trigger, setTrigger] = useRecoilState(triggerUpdate)
  const [approve, setApprove] = useState<boolean>(true)
  const [advanceToken, setAdvanceToken] = useState({
    balance: "0",
    token: "",
  })
  const [type, setType] = useState<"deposit" | "withdraw">("deposit")

  useEffect(() => {
    const getWalletBalance = async (): Promise<void> => {
      try {
        if (!address) {
          return
        }
        const balance = await getETHBalance(address)
        setBalance(balance)
        setToken(AppContext.nativeSymbol || "ETH")
      } catch (err) {
        console.log(err.message)
      }
    }

    void getWalletBalance()
  }, [address, trigger])

  useEffect(() => {
    if (!address || !userProxy) {
      return
    }

    void checkApprove(erc20, MCD_DAI, address, userProxy).then(setApprove)
  }, [])

  useEffect(() => {
    if (!depositValue || depositValue === "" || depositValue === "0") {
      setAdvanceDeposit("")
      setShowAdvanceDeposit(false)
    }

    if (!withdrawValue || withdrawValue === "" || withdrawValue === "0") {
      setAdvanceWithdraw("")
      setShowAdvanceWithdraw(false)
    }
  }, [depositValue, withdrawValue])

  useEffect(() => {
    checkBorrowValid(advanceDeposit || "0", advanceToken.balance)
  }, [advanceDeposit, advanceToken.balance])

  const onChangeDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatInputNumber(e.target.value)
    checkIsGreaterThanBalance(value, balance)
    // checkDebtValid(advanceDeposit || '0', caculatorMaxpUSD(
    //   value,
    //   loanInfo?.maxDebtPerUnitCollateral,
    //   formatInputNumber(loanInfo?.detailData?.availableDebt?.toString()),
    // ))

    setDepositValue(value)
    setAdvanceToken({
      ...advanceToken,
      balance: caculatorMaxpUSD(
        value,
        loanInfo?.maxDebtPerUnitCollateral,
        formatInputNumber(loanInfo?.detailData?.availableDebt?.toString()),
      ),
    })
    if (!e.target.value || parseFloat(e.target.value) === 0) {
      resetEditLoan()
    } else {
      const newDeposit = sum(value || "0", loanInfo.detailData?.lockedCollateral.toString() || '0')
      const newBorrow = sum(loanInfo?.detailData?.debt.toString() || '0', advanceDeposit || '0')

      const liquidationPrice = caculateLiquidationPrice(
        newDeposit,
        newBorrow,
        formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()),
        formatInputNumber(loanInfo?.currentPrice.toString()),
      )

      const newCollRatio = caculateCollRatio(loanInfo?.currentPrice.toString(), newBorrow, newDeposit)

      onNewInfo(newDeposit, newBorrow, liquidationPrice, newCollRatio)
    }

    if (type !== "deposit") {
      setType("deposit")
    }
  }

  const onChangeWithdraw = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkWithdrawValid(e.target.value, loanInfo?.detailData?.freeCollateral ?? "0")
    const value = formatInputNumber(e.target.value)

    setWithdrawValue(value)
    if (!e.target.value || parseFloat(e.target.value) === 0) {
      resetEditLoan()
    } else {
      // Re caculate
      const newDeposit = sub(loanInfo.detailData?.lockedCollateral.toString() || '0', value || "0")
      const newBorrow = sub(loanInfo?.detailData?.debt.toString() || '0', advanceWithdraw || '0')
      const liquidationPrice = caculateLiquidationPrice(
        newDeposit,
        newBorrow,
        formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()),
        formatInputNumber(loanInfo?.currentPrice.toString()),
      )

      const newCollRatio = caculateCollRatio(loanInfo?.currentPrice.toString(), newBorrow, newDeposit)

      onNewInfo(newDeposit, newBorrow, liquidationPrice, newCollRatio)
    }

    if (type !== "withdraw") {
      setType("withdraw")
    }
  }

  const checkIsGreaterThanBalance = useCallback(
    (input: string, balance: string) => {
      const cInput = parseFloat(input)
      const cCurrent = parseFloat(balance)
      const setError = new Set(errors)
      if (cInput > cCurrent) {
        setError.add(ERRORS_LIST.greaterThanBalance)
      } else {
        setError.delete(ERRORS_LIST.greaterThanBalance)
      }

      const newError = Array.from(setError)
      setErrors(newError)
    },
    [balance],
  )

  const checkDebtValid = useCallback(
    (input: string, current: string) => {
      const cInput = parseFloat(input)
      const cCurrent = parseFloat(current)
      const setError = new Set(errors)
      console.log(cCurrent)
      console.log(cInput)
      if (cInput > cCurrent) {
        setError.add(ERRORS_LIST.greaterThanMaxPUSD)
      } else if (cCurrent - cInput < 100 && cCurrent !== cInput) {
        setError.add(ERRORS_LIST.pUSDMustBe0OrGt100)
      } else {
        setError.delete(ERRORS_LIST.greaterThanMaxPUSD)
        setError.delete(ERRORS_LIST.pUSDMustBe0OrGt100)
      }

      const newError = Array.from(setError)
      setErrors(newError)
    },
    [advanceToken.balance, advanceDeposit],
  )

  const checkBorrowValid = useCallback(
    (input: string, current: string) => {
      const cInput = parseFloat(input)
      const cCurrent = parseFloat(current)
      const setError = new Set(errors)
      console.log(cCurrent)
      if (cInput > cCurrent) {
        setError.add(ERRORS_LIST.greaterThanBorrowPUSD)
      } else {
        setError.delete(ERRORS_LIST.greaterThanBorrowPUSD)
      }
      const newError = Array.from(setError)
      setErrors(newError)
    },
    [advanceToken.balance],
  )

  const checkWithdrawValid = useCallback(
    (input: string, current: string) => {
      const cInput = parseFloat(input)
      const cCurrent = parseFloat(current)
      const setError = new Set(errors)
      if (cInput > cCurrent) {
        setError.add(ERRORS_LIST.greaterThanAvailableWithdraw)
      } else {
        setError.delete(ERRORS_LIST.greaterThanAvailableWithdraw)
      }
      const newError = Array.from(setError)
      setErrors(newError)
    },
    [loanInfo?.detailData?.freeCollateral],
  )

  const onChangeAdvanceDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
    // checkBorrowValid(e.target.value, advanceToken.balance)
    setAdvanceDeposit(formatInputNumber(e.target.value))
    if (!e.target.value || parseFloat(e.target.value) === 0) {
      resetEditLoan()
    } else {
      const newDeposit = sum(depositValue || "0", loanInfo.detailData?.lockedCollateral.toString() || '0')
      const newBorrow = sum(loanInfo?.detailData?.debt.toString() || '0', e.target.value)

      const liquidationPrice = caculateLiquidationPrice(
        newDeposit,
        newBorrow,
        formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()),
        formatInputNumber(loanInfo?.currentPrice.toString()),
      )
      const newCollRatio = caculateCollRatio(loanInfo?.currentPrice.toString(), newBorrow, newDeposit)

      onNewInfo(newDeposit, newBorrow, liquidationPrice, newCollRatio)
    }

  }

  const onChangeAdvanceWithdraw = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkDebtValid(e.target.value, advanceToken.balance)
    setAdvanceWithdraw(formatInputNumber(e.target.value))
    if (!e.target.value || parseFloat(e.target.value) === 0) {
      resetEditLoan()
    } else {
      const newDeposit = sub(loanInfo.detailData?.lockedCollateral.toString() || '0', withdrawValue || "0")
      const newBorrow = sub(loanInfo?.detailData?.debt.toString() || '0', e.target.value || '0')
      const liquidationPrice = caculateLiquidationPrice(
        newDeposit,
        newBorrow,
        formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()),
        formatInputNumber(loanInfo?.currentPrice.toString()),
      )

      const newCollRatio = caculateCollRatio(loanInfo?.currentPrice.toString(), newBorrow, newDeposit)
      onNewInfo(newDeposit, newBorrow, liquidationPrice, newCollRatio)
    }

  }

  const onChangeShowAdvanceDeposit = async (): Promise<void> => {
    try {
      if (!showAdvanceDeposit) {
        setAdvanceToken({
          balance: caculatorMaxpUSD(
            depositValue,
            loanInfo?.maxDebtPerUnitCollateral,
            formatInputNumber(loanInfo?.detailData?.availableDebt?.toString()),
          ),
          token: "pUSD",
        })
        setShowAdvanceWithdraw(false)
      }
      setShowAdvanceDeposit(!showAdvanceDeposit)
    } catch (err) {}
  }

  const onChangeShowAdvanceWithdraw = async (): Promise<void> => {
    try {
      if (!showAdvanceWithdraw) {
        setAdvanceToken({
          balance: loanInfo?.detailData?.debt ? formatFiatBalance(loanInfo?.detailData?.debt) : "0",
          token: "pUSD",
        })
        setShowAdvanceDeposit(false)
      }
      setShowAdvanceWithdraw(!showAdvanceWithdraw)
    } catch (err) {}
  }

  const onClickBack = () => {
    setManageStage(MANAGE_LOAN_STAGE.editFormCollateral)
    setTx(undefined)
  }

  const handleConfirmChangeLoan = async () => {
    if (!address || !userProxy || !loanInfo) return
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(dsProxyAbi as any, userProxy)

    const context: OpenCallData = {
      dssProxyActions: dsProxyActionsAbi,
      dssCdpManager: CDP_MANAGER,
      mcdJug: MCD_JUG,
      mcdJoinDai: MCD_JOIN_DAI,
      joinsIlk: MCD_JOIN_ETH_A,
    }

    const amount: LockAmount = {
      id: loanInfo.detailData.id,
      depositAmount: depositValue,
      borrowAmount: advanceDeposit,
      proxyAddress: userProxy,
      ilk: loanInfo.detailData.ilk,
      token: AppContext.nativeSymbol || "ETH",
    }

    try {
      const encodeData = getDepositAndGenerateCallData(amount, context).encodeABI()
      console.log("encodeData", encodeData)
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
          setTx(receipt)
          setLoading(false)
        })
        .on("receipt", function (receipt) {
          console.log(receipt)
          setTx(receipt.transactionHash)
          setLoading(false)
          setTrigger(!trigger)
          setAdvanceWithdraw('')
          setAdvanceDeposit('')
          setDepositValue('')
          setWithdrawValue('')
        })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!address || !userProxy || !loanInfo) return
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(dsProxyAbi as any, userProxy)
    const shouldPaybackAll =
      parseInt(`${parseFloat(advanceToken.balance) - parseFloat(advanceWithdraw)}`) === 0

    console.log("shouldPaybackAll", shouldPaybackAll)

    const context: OpenCallData = {
      dssProxyActions: dsProxyActionsAbi,
      dssCdpManager: CDP_MANAGER,
      mcdJug: MCD_JUG,
      mcdJoinDai: MCD_JOIN_DAI,
      joinsIlk: MCD_JOIN_ETH_A,
    }

    const amount: WithdrawAndPaybackData = {
      id: loanInfo.detailData.id,
      withdrawAmount: withdrawValue,
      paybackAmount: advanceWithdraw,
      proxyAddress: userProxy,
      ilk: loanInfo.detailData.ilk,
      token: AppContext.nativeSymbol || "ETH",
      shouldPaybackAll: shouldPaybackAll,
    }

    try {
      const encodeData = getWithdrawAndPaybackCallData(amount, context).encodeABI()
      console.log("encodeData", encodeData)
      await contract.methods
        .execute(PROXY_ACTIONS, encodeData)
        .send(
          {
            from: address,
            // value: Web3.utils.toWei(`${depositValue}`, "ether"),
            // gas: 807021,
            // gasPrice: new BigNumber({
            //   s: 1,
            //   e: 9,
            //   c: [2020000000],
            //   _isBigNumber: true,
            // }),
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
          setTx(receipt)
          setLoading(false)
        })
        .on("receipt", function (receipt) {
          console.log(receipt)
          setTx(receipt.transactionHash)
          setLoading(false)
          setTrigger(!trigger)
          setAdvanceWithdraw('')
          setAdvanceDeposit('')
          setDepositValue('')
          setWithdrawValue('')
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handleClickApprove = async () => {
    if (!address || !userProxy) return
    try {
      const contract = initialContract(erc20, MCD_DAI)
      await contract.methods
        .approve(userProxy, MaxUint)
        .send(
          {
            from: address,
          },
          () => {
            setLoading(true)
          },
        )
        .on("error", () => {
          setLoading(false)
        })
        .on("receipt", function () {
          setLoading(false)
          setApprove(true)
        })
    } catch (err) {}
  }

  const handleConfirm = async () => {
    if (type === "deposit") {
      await handleConfirmChangeLoan()
    } else if (type === "withdraw") {
      await handleWithdraw()
    }
    resetEditLoan()
  }

  const reviewDeposit = useMemo(
    () => [
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
        value: advanceDeposit ? formatInputNumber(advanceDeposit) + " " + "pUSD" : "0 pUSD",
      },
      {
        label: "collaterizationRatio",
        value: loanInfo
          ? caculateCollRatio(
              formatInputNumber(loanInfo.currentPrice.toString()),
              sum(advanceDeposit || "0", loanInfo.detailData.debt.toString()),
              formatInputNumber(
                parseFloat(depositValue) +
                  parseFloat(loanInfo?.detailData?.lockedCollateral.toString()),
              ),
            )
          : "0%",
      },
      {
        label: "liquidationPrice",
        value: loanInfo
          ? caculateLiquidationPrice(
              sum(depositValue, loanInfo?.detailData?.lockedCollateral.toString()),
              sum(advanceDeposit || "0", loanInfo.detailData.debt.toString()),
              formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()),
              formatInputNumber(loanInfo.currentPrice.toString()),
            ) +
            " " +
            token
          : loanInfo?.detailData.liquidationPrice,
      },
    ],
    [loanInfo, depositValue, advanceDeposit, balance, trigger],
  )

  const reviewWithdraw = useMemo(
    () => [
      {
        label: "inWallet",
        value: formatInputNumber(balance) + " " + token,
      },
      {
        label: "movingOutOfLoan",
        value: formatInputNumber(withdrawValue) + " " + token,
      },
      {
        label: "remainingInWallet",
        value: sum(balance, withdrawValue) + " " + token,
      },
      {
        label: "pUSDBeingPayback",
        value: advanceWithdraw ? formatInputNumber(advanceWithdraw) + " " + "pUSD" : "0 pUSD",
      },
      {
        label: "collaterizationRatio",
        value: loanInfo
          ? caculateCollRatio(
              formatInputNumber(loanInfo.currentPrice.toString()),
              sub(loanInfo.detailData.debt.toString(), advanceWithdraw || "0"),
              sub(
                formatInputNumber(loanInfo?.detailData?.lockedCollateral.toString()),
                withdrawValue,
              ),
            )
          : "0%",
      },
      {
        label: "liquidationPrice",
        value: loanInfo
          ? caculateLiquidationPrice(
              sub(withdrawValue, loanInfo?.detailData?.lockedCollateral.toString()),
              sub(loanInfo.detailData.debt.toString(), advanceWithdraw || "0"),
              formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()),
              formatInputNumber(loanInfo.currentPrice.toString()),
            ) +
            " " +
            token
          : loanInfo?.detailData.liquidationPrice,
      },
    ],
    [loanInfo, withdrawValue, advanceWithdraw, balance, trigger],
  )

  const review = useMemo(
    () => (type === "deposit" ? reviewDeposit : reviewWithdraw),
    [type, reviewWithdraw, reviewDeposit, trigger],
  )

  return (
    <div>
      {manageStage === MANAGE_LOAN_STAGE.confirmationCollateral && (
        <ConfirmationLoanChange
          onClickBack={onClickBack}
          onConfirm={handleConfirm}
          loading={loading}
          tx={tx}
          review={review}
        />
      )}
      {manageStage === MANAGE_LOAN_STAGE.editFormCollateral && (
        <Grid>
          <CustomLoanInput
            value={depositValue}
            onChange={(e) => onChangeDeposit(e)}
            walletLabel={"In Wallet"}
            maxValue={balance}
            showMax={false}
            token={token}
            action={`Deposit`}
            disabled={parseFloat(withdrawValue) > 0}
            exchangeUSDT={multi(depositValue, loanInfo ? loanInfo.currentPrice.toString() : "0")}
          />
          {(checkLoanOwner(userProxy, loanInfo?.detailData?.owner) && parseFloat(depositValue)) >
            0 && (
            <>
              <Advance fSize={14} fColor={orange} weight={500} onClick={onChangeShowAdvanceDeposit}>
                {showAdvanceDeposit ? "--" : "+"} Also borrow pUSD with this transaction
              </Advance>
              {showAdvanceDeposit && (
                <CustomLoanInput
                  value={advanceDeposit}
                  onChange={(e) => onChangeAdvanceDeposit(e)}
                  walletLabel={"In Wallet"}
                  showMax={false}
                  maxValue={advanceToken.balance}
                  token={advanceToken.token}
                  action={``}
                />
              )}
            </>
          )}
          <Divider>
            <CommonPTag fColor={orange}>----------------------</CommonPTag>
            <Or>
              <CommonPTag fSize={12} weight={500}>
                OR
              </CommonPTag>
            </Or>
            <CommonPTag fColor={orange}>----------------------</CommonPTag>
          </Divider>
          <CustomLoanInput
            value={withdrawValue}
            onChange={(e) => onChangeWithdraw(e)}
            walletLabel={"Max"}
            maxValue={loanInfo?.detailData?.freeCollateral ?? "0"}
            showMax={false}
            token={token}
            action={`Withdraw`}
            disabled={parseFloat(depositValue) > 0 || !checkLoanOwner(userProxy, loanInfo?.detailData?.owner)}
            exchangeUSDT={multi(withdrawValue, loanInfo ? loanInfo.currentPrice.toString() : "0")}

          />
          {(checkLoanOwner(userProxy, loanInfo?.detailData?.owner) && parseFloat(withdrawValue)) >
            0 && (
            <>
              <Advance
                fSize={14}
                fColor={orange}
                weight={500}
                onClick={onChangeShowAdvanceWithdraw}
              >
                {showAdvanceWithdraw ? "--" : "+"} Also payback pUSD with this transaction
              </Advance>
              {showAdvanceWithdraw && (
                <CustomLoanInput
                  value={advanceWithdraw}
                  onChange={(e) => onChangeAdvanceWithdraw(e)}
                  walletLabel={"In Wallet"}
                  showMax={false}
                  maxValue={advanceToken.balance}
                  token={advanceToken.token}
                  action={``}
                  showExchangeUSDT={true}
                />
              )}
            </>
          )}
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
                      {err}
                    </CommonPTag>
                  </Grid>
                ))
              }
            </ErrorContainer>
          )}
          {!(advanceWithdraw && !approve) ? (
            <Button
              onClick={onClickNext}
              disabled={
                errors.length > 0 ||
                ((!depositValue || parseFloat(depositValue) <= 0) &&
                  (!withdrawValue || parseFloat(withdrawValue) <= 0))
              }
            >
              Next
            </Button>
          ) : (
            <DivTextCenter>
              <Button onClick={handleClickApprove} disabled={loading}>
                {loading && <Spinner sx={{ color: "#500EC1", marginRight: 2 }} size={24} />}
                <CommonSpanTag>Set allowance</CommonSpanTag>
              </Button>
            </DivTextCenter>
          )}
        </Grid>
      )}
    </div>
  )
}

export default CollateralEditing

//--------------------------------
const ErrorContainer = styled.div`
  background: #2c204f;
  box-shadow: 0 ${rem(6)} ${rem(16)} rgba(38, 23, 70, 0.5);
  border-radius: ${rem(4)};
  padding: ${rem(16)} ${rem(12)};
`

const Divider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Or = styled.div`
  width: ${rem(32)};
  height: ${rem(32)};
  border: 1px solid ${orange};
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Advance = styled.p`
  font-size: ${rem(14)};
  color: ${orange};
  font-weight: 500;
  cursor: pointer;
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
  color: white;

  span {
    color: ${(props) => (props.disabled ? "#500EC1" : "white")};
  }

  @media ${DEFAULT_DEVICE.tablet} {
    width: ${rem(218)};
    height: ${rem(40)};
  }
`
