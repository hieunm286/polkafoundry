import React, { useCallback, useEffect, useState } from "react"
import { Grid } from "theme-ui"
import CustomLoanInput from "../../components/CustomLoanInput"
import { CommonPTag, DEFAULT_DEVICE } from "../../constants/styles"
import { fire, orange } from "../../constants/color"
import { useRecoilValue } from "recoil"
import { connectionAccountState } from "../../recoil/atoms"
import { formatInputNumber, rem } from "../../helpers/common-function"
import styled from "styled-components"
import { getETHBalance, getTotalBalance } from "../../helpers/web3"

const ERRORS_LIST = {
  greaterThanBalance: "You cannot deposit more collateral than the amount in your wallet",
}

interface LoanDetailEditProps {
  onClickNext: () => void
}

const CollateralEditing: React.FC<LoanDetailEditProps> = ({ onClickNext }) => {
  const address = useRecoilValue(connectionAccountState)
  const [depositValue, setDepositValue] = useState("")
  const [withdrawValue, setWithdrawValue] = useState("")
  const [showAdvanceDeposit, setShowAdvanceDeposit] = useState(false)
  const [showAdvanceWithdraw, setShowAdvanceWithdraw] = useState(false)
  const [advanceDeposit, setAdvanceDeposit] = useState("")
  const [advanceWithdraw, setAdvanceWithdraw] = useState("")
  const [balance, setBalance] = useState<string>("0")
  const [token, setToken] = useState<string>("")
  const [errors, setErrors] = useState<string[]>([])
  const [advanceToken, setAdvanceToken] = useState({
    balance: "0",
    token: "",
  })

  useEffect(() => {
    const getWalletBalance = async (): Promise<void> => {
      try {
        if (!address) {
          return
        }
        const { balance, token } = await getTotalBalance(address)
        setBalance(balance)
        setToken(token)
      } catch (err) {
        console.log(err.message)
      }
    }

    void getWalletBalance()
  }, [address])

  const onChangeDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatInputNumber(e.target.value)
    checkIsGreaterThanBalance(value, balance)

    setDepositValue(value)
  }

  const onChangeWithdraw = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatInputNumber(e.target.value)

    setWithdrawValue(value)
  }

  const checkIsGreaterThanBalance = useCallback((input: string, balance: string) => {
    if (parseFloat(input) > parseFloat(balance)) {
      const newErrors = [...errors]
      if (!newErrors.includes(ERRORS_LIST.greaterThanBalance)) {
        newErrors.push(ERRORS_LIST.greaterThanBalance)
      }
      setErrors(newErrors)
    } else {
      const newErrors = errors.filter((error) => error !== ERRORS_LIST.greaterThanBalance)
      setErrors(newErrors)
    }
  }, [])

  const onChangeAdvanceDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkIsGreaterThanBalance(e.target.value, advanceToken.balance)
    setAdvanceDeposit(formatInputNumber(e.target.value))
  }

  const onChangeAdvanceWithdraw = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkIsGreaterThanBalance(e.target.value, advanceToken.balance)
    setAdvanceWithdraw(formatInputNumber(e.target.value))
  }

  const onChangeShowAdvanceDeposit = async (): Promise<void> => {
    try {
      if (!showAdvanceDeposit) {
        const balance = await getETHBalance(address)
        setAdvanceToken({ balance: formatInputNumber(balance), token: "ETH" })
      }
      setShowAdvanceDeposit(!showAdvanceDeposit)
    } catch (err) {}
  }

  const onChangeShowAdvanceWithdraw = async (): Promise<void> => {
    try {
      if (!showAdvanceWithdraw) {
        const balance = await getETHBalance(address)
        setAdvanceToken({ balance: formatInputNumber(balance), token: "ETH" })
      }
      setShowAdvanceWithdraw(!showAdvanceWithdraw)
    } catch (err) {}
  }

  return (
    <div>
      <Grid>
        <CustomLoanInput
          value={depositValue}
          onChange={(e) => onChangeDeposit(e)}
          walletLabel={"In Wallet"}
          maxValue={balance}
          token={token}
          action={`Deposit`}
          disabled={parseFloat(withdrawValue) > 0}
        />
        {parseFloat(depositValue) > 0 && (
          <>
            <Advance fSize={14} fColor={orange} weight={500} onClick={onChangeShowAdvanceDeposit}>
              {showAdvanceDeposit ? "--" : "+"} Also deposit ETH with this transaction
            </Advance>
            {showAdvanceDeposit && (
              <CustomLoanInput
                value={advanceWithdraw}
                onChange={(e) => onChangeAdvanceWithdraw(e)}
                walletLabel={"In Wallet"}
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
          maxValue={"600.05"}
          token={`pUSD`}
          action={`Withdraw`}
          disabled={parseFloat(depositValue) > 0}
        />
        {parseFloat(withdrawValue) > 0 && (
          <>
            <Advance fSize={14} fColor={orange} weight={500} onClick={onChangeShowAdvanceWithdraw}>
              {showAdvanceWithdraw ? "--" : "+"} Also withdraw ETH with this transaction
            </Advance>
            {showAdvanceWithdraw && (
              <CustomLoanInput
                value={advanceDeposit}
                onChange={(e) => onChangeAdvanceDeposit(e)}
                walletLabel={"In Wallet"}
                maxValue={advanceToken.balance}
                token={advanceToken.token}
                action={``}
                showExchangeUSDT={true}
                showMax={true}
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
        <Button onClick={onClickNext}>Next</Button>
      </Grid>
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
  background: linear-gradient(to bottom, #903afd -13.58%, #492cff 102.52%);
  border-radius: 32px;
  margin: ${rem(20)} auto ${rem(10)};
  border: none;
  cursor: pointer;
  color: white;
  @media ${DEFAULT_DEVICE.tablet} {
    width: ${rem(218)};
    height: ${rem(40)};
  }
`
