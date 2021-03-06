import React from "react"
import styled from "styled-components"
import {rem, SaveToLocalStorage, trimAddress} from "../helpers/common-function"
import Image from "next/image"
import { useTranslation } from "next-i18next"
import { useRecoilState } from "recoil"
import { connectionAccountState } from "../recoil/atoms"
import Link from "next/link"

const AppHeader = () => {
  const { t, i18n } = useTranslation()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [address, setAddress] = useRecoilState(connectionAccountState)

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

  return (
    <HeaderContainer>
      <HeaderLeft>
        <Link href={`/`}>
          <a>
            <Logo src={`/images/icon/polka-icon.svg`} alt={``} />
          </a>
        </Link>
        <Link href={"/"}>
          <a>
            <Image src={`/images/icon/polka-label.svg`} alt={``} width={65} height={15} />
          </a>
        </Link>
        <HeaderMenu>
          {address && (
            <Link href={`/owner/${address}`}>
              <MenuLink>{t("yourVaults")}</MenuLink>
            </Link>
          )}
          <Link href={`/loans/list`}>
            <MenuLink>{t("openNewVaults")}</MenuLink>
          </Link>
        </HeaderMenu>
      </HeaderLeft>

      <HeaderRight>
        <LabelInfo>{i18n.language}</LabelInfo>
        <LabelInfo>{t("dot")}</LabelInfo>
        {address ? (
          <AddressInfo>{trimAddress(address)}</AddressInfo>
        ) : (
          <LabelInfo onClick={connectMetaMask}>{t("connectWallet")}</LabelInfo>
        )}
      </HeaderRight>
    </HeaderContainer>
  )
}

export default AppHeader

// -----------------------
const HeaderContainer = styled.nav`
  width: 100%;
  background: transparent;
  height: ${rem`70px`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${rem`50px`};
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`

const Logo = styled.img`
  width: ${rem`25px`};
  height: ${rem`18px`};
  margin-right: ${rem`12px`};
  cursor: pointer;
`

const HeaderMenu = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${rem`60px`};
`

const MenuLink = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: ${rem`14px`};
  line-height: 150%;

  //margin-bottom: 0;
  margin-right: ${rem`60px`};
  cursor: pointer;
  color: white;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`

const LabelInfo = styled.div`
  padding: ${rem`7px`} ${rem`20px`};
  border-radius: ${rem`32px`};
  background: #2c204f;
  color: white;
  margin-right: ${rem`16px`};
  cursor: pointer;
`

const AddressInfo = styled.div`
  padding: ${rem`7px`} ${rem`20px`};
  border-radius: ${rem`32px`};
  background: #f9b55e;
  color: white;
  margin-right: ${rem`16px`};
`
