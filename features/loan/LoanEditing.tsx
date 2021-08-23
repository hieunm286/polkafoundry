import React, {useEffect, useState} from "react"
import { Grid } from "theme-ui"
import CustomLoanInput from "../../components/CustomLoanInput"
import styled from "styled-components"
import { CommonPTag, CommonSpanTag, DEFAULT_DEVICE } from "../../constants/styles"
import {fire, orange} from "../../constants/color"
import {
  calculateTokenPrecisionByValue,
  formatBigNumber,
  formatCryptoBalance,
  formatInputNumber,
  rem
} from "../../helpers/common-function"
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil"
import {
  connectionAccountState,
  CREATE_LOAN_STAGE,
  createLoanStage,
  inputValueCreateLoanBorrow,
  inputValueCreateLoanDeposite, proxyAccountAddress,
} from "../../recoil/atoms"
import {ethers} from "ethers";
import {
  Amount,
  getETHBalance,
  getOpenCallData,
  getTotalBalance,
  getTotalBalanceByTokenAddress,
  OpenCallData
} from "../../helpers/web3";
import Web3 from "web3";
import dsProxyAbi from "../../blockchain/abi/ds-proxy.json";
import dsProxyActionsAbi from "../../blockchain/abi/dss-proxy-actions.json";
import erc20 from "../../blockchain/abi/erc20.json";
import { PROXY_ACTIONS, ETH, MCD_JOIN_DAI, MCD_JUG, CDP_MANAGER, MCD_JOIN_ETH_A } from "../../blockchain/addresses/kovan.json";
import {BigNumber} from "bignumber.js";
import {one, zero} from "../../constants/zero";
import {MaxUint} from "../../constants/variables";


const ERRORS_LIST = {
  greaterThanBalance: 'You cannot deposit more collateral than the amount in your wallet'
}

function convertStringToUTF8ByteArray(str: string) {
  const binaryArray = new Uint8Array(str.length)
  Array.prototype.forEach.call(binaryArray, function (el, idx, arr) { arr[idx] = str.charCodeAt(idx) })
  return binaryArray
}

const LoanEditing = ({ ilk }: { ilk: string }) => {
  const address = useRecoilValue(connectionAccountState)
  const [depositValue, setDepositValue] = useRecoilState(inputValueCreateLoanDeposite)
  const [borrowValue, setBorrowValue] = useRecoilState(inputValueCreateLoanBorrow)
  const userProxy = useRecoilValue(proxyAccountAddress)
  const setCreateStage = useSetRecoilState(createLoanStage)
  const [balance, setBalance] = useState<string>('0')
  const [token, setToken] = useState<string>('')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const getWalletBalance = async (): Promise<void> => {
      try {
        if (!address) {
          return;
        }
        // For kovan
        const balance = await getETHBalance(address)
        setBalance(balance)
        setToken("ETH")

        // For polkadot
        // const { balance, token } = await getTotalBalanceByTokenAddress(address, ETH)
        // setBalance(balance)
        // setToken(token)
      } catch (err) {
        console.log(err.message)
      }
    }

    void getWalletBalance()
  }, [address])

  console.log(token)

  const onClickSetupProxy = () => {
    setCreateStage(CREATE_LOAN_STAGE.createProxy)
  }

  const onChangeDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatInputNumber(e.target.value)
    if (parseFloat(value) > parseFloat(balance)) {
      const newErrors = [...errors]
      newErrors.push(ERRORS_LIST.greaterThanBalance)
      setErrors(newErrors)
    } else {
      const newErrors = errors.filter(error => error !== ERRORS_LIST.greaterThanBalance)
      setErrors(newErrors)
    }
    setDepositValue(value)
  }

  const handleConfirmOpenLoan = async () => {
    if (!address || !userProxy) return;
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(dsProxyAbi as any, userProxy)
    const ethContract = new web3.eth.Contract(erc20 as any, ETH)

    const context: OpenCallData = {
      dssProxyActions: dsProxyActionsAbi,
      dssCdpManager: CDP_MANAGER,
      mcdJug: MCD_JUG,
      mcdJoinDai: MCD_JOIN_DAI,
      joinsIlk: MCD_JOIN_ETH_A
    }

    const amount: Amount = {
      depositAmount: depositValue,
      borrowAmount: borrowValue,
      proxyAddress: userProxy,
      ilk: ilk,
      token: "ETH"
    }

    const encodeData = getOpenCallData(amount, context).encodeABI()
    console.log(encodeData)
    await contract.methods.execute(PROXY_ACTIONS, encodeData).send({
        from: address,
        value: Web3.utils.toWei(`${depositValue}`, "ether"),
        gas: 807021,
        gasPrice: new BigNumber({
          s: 1,
          e: 9,
          c: [2020000000],
          _isBigNumber: true
        })
      },
      // eslint-disable-next-line handle-callback-err
      function (err, receipt) {
        console.log(receipt)
      },)
  }

  return (
    <div>
      <Grid>
        <CustomLoanInput
          value={depositValue}
          onChange={onChangeDeposit}
          walletLabel={"In Wallet"}
          maxValue={balance}
          token={token}
          action={`Deposit`}
        />
        <Divider>
          <CommonPTag fColor={orange}>----------------------</CommonPTag>
          <img src={"/images/icon/down.svg"} alt={""} />
          <CommonPTag fColor={orange}>----------------------</CommonPTag>
        </Divider>
        <CustomLoanInput
          value={borrowValue}
          onChange={(e) => setBorrowValue(e.target.value)}
          walletLabel={"Max"}
          maxValue={'600.05'}
          token={`pUSD`}
          action={`Borrow`}
        />
        {
          errors.length > 0 && (
            <ErrorContainer>
              {
                // eslint-disable-next-line handle-callback-err
                errors.map((err, idx) => (
                  <Grid key={idx} columns={["5px 1fr"]}>
                    <CommonPTag fSize={12} weight={400} fColor={fire}>•</CommonPTag>
                    <CommonPTag fSize={12} weight={400} fColor={fire}>{err}</CommonPTag>
                  </Grid>
                ))
              }
            </ErrorContainer>
          )
        }
        {
          userProxy === ethers.constants.AddressZero ? (
            <Button onClick={onClickSetupProxy}>
              <CommonSpanTag>Setup Proxy</CommonSpanTag>
            </Button>
          ) : (
            <Button onClick={handleConfirmOpenLoan}>
              <CommonSpanTag>Confirm</CommonSpanTag>
            </Button>
          )
        }

      </Grid>
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
  background: linear-gradient(to bottom, #903afd -13.58%, #492cff 102.52%);
  border-radius: 32px;
  margin: ${rem(20)} auto;
  border: none;
  cursor: pointer;
  @media ${DEFAULT_DEVICE.tablet} {
    width: ${rem(218)};
    height: ${rem(40)};
  }
`

const ErrorContainer = styled.div`
  background: #2C204F;
  box-shadow: 0 ${rem(6)} ${rem(16)} rgba(38, 23, 70, 0.5);
  border-radius:${rem(4)};
  padding: ${rem(16)} ${rem(12)};
`
