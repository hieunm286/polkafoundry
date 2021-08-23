import React, { useEffect } from "react"
import { useRecoilState } from "recoil"
import { connectionAccountState } from "../recoil/atoms"
import styled from "styled-components"
import { rem, SaveToLocalStorage } from "../helpers/common-function"
import { DEFAULT_DEVICE } from "../constants/styles"
import { useTranslation } from "next-i18next"
// const abc = require("@polkadot/extension-dapp");

const WithAuth = ({ children }) => {
  const [address, setAddress] = useRecoilState(connectionAccountState)
  const { t } = useTranslation()

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("You must install meta mask first")
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      if (accounts[0]) {
        setAddress(accounts[0])
        SaveToLocalStorage("loggedWallet", 1)
      }
    } catch (err) {}
  }

  useEffect(() => {}, [])

  const ErrorPage = () => {
    return (
      <ErrorContainer>
        <Img src={`/images/background/img_1.png`} alt={``} />
        <Button onClick={connectMetaMask}>{t("connectWallet")}</Button>
      </ErrorContainer>
    )
  }

  return <>{address ? <>{children}</> : <ErrorPage />}</>
}

export default WithAuth

//----------------------------
const ErrorContainer = styled.div`
  //min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: ${rem(65)};
`

const Img = styled.img`
  width: 40%;
`

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(140.62deg, #903afd -13.58%, #492cff 102.52%);
  border-radius: ${rem`32px`};
  border: none;
  color: white;
  cursor: pointer;

  margin-top: ${rem`50px`};

  @media ${DEFAULT_DEVICE.laptop} {
    width: ${rem`255px`};
    height: ${rem`64px`};
  }
`
