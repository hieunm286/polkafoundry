import React, { useEffect } from "react"
import styled from "styled-components"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { defaultBg } from "../constants/styles"
import AppHeader from "./Header"
import { GetFromLocalStorage, rem } from "../helpers/common-function"
import { useRecoilState, useSetRecoilState } from "recoil"
import {
  appContext,
  connectionAccountState,
  CREATE_LOAN_STAGE,
  createLoanStage,
  proxyAccountAddress,
} from "../recoil/atoms"
import { changeChain, getProxyAddress } from "../helpers/web3"
import { MULTICHAIN_SETUP } from "../constants/variables"

interface LayoutProps {
  children: JSX.Element
  noLayout: boolean
}

const LayoutContainer = styled.div<{ noLayout?: boolean }>`
  width: 100%;
  margin: 0 auto;
  background: ${(props) => (props.noLayout ? "100%" : `url("/images/background/stars1.jpeg") top left`)};
  background-size: cover;
  background-color: ${defaultBg};
  min-height: 100vh;
  //overflow: hidden;
`

const LayoutMain = styled.div<{ noLayout?: boolean }>`
  max-width: ${(props) => (props.noLayout ? "100%" : rem`1440px`)};
  margin: 0 auto;
`

const Layout: React.FC<LayoutProps> = ({ noLayout = false, children }) => {
  const [address, setAddress] = useRecoilState(connectionAccountState)
  const setProxyAddress = useSetRecoilState(proxyAccountAddress)
  const setStage = useSetRecoilState(createLoanStage)
  const setAppContext = useSetRecoilState(appContext)

  useEffect(() => {
    const metaMask = async () => {
      try {
        if (GetFromLocalStorage("loggedWallet")) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
          if (accounts[0]) {
            setAddress(accounts[0])
            const proxy = await getProxyAddress(accounts[0])
            setProxyAddress(proxy)
          }

          window.ethereum.on("accountsChanged", async (accounts) => {
            setAddress(accounts[0])
            setStage(CREATE_LOAN_STAGE.editForm)
            const proxy = await getProxyAddress(accounts[0])
            setProxyAddress(proxy)
          })
        }
        window.ethereum.on("chainChanged", () => {
          window.location.reload()
        })
      } catch (err) {
        console.log(err)
      }
    }

    void metaMask()
    setAppContext(MULTICHAIN_SETUP.kovan)
  }, [])

  useEffect(() => {
    const checkChain = async (): Promise<void> => {
      if (address) {
        await changeChain()
      }
    }

    void checkChain()
  }, [address])

  return (
    <LayoutContainer noLayout={noLayout}>
      <AppHeader />
      <LayoutMain noLayout={noLayout}>{children}</LayoutMain>
    </LayoutContainer>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
})

export default Layout
