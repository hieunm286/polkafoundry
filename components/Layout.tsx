import React, { useEffect } from "react"
import styled from "styled-components"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { defaultBg } from "../constants/styles"
import AppHeader from "./Header"
import {GetFromLocalStorage, rem, utf8ToBytes32} from "../helpers/common-function"
import { useRecoilState, useSetRecoilState } from "recoil"
import {
  connectionAccountState,
  CREATE_LOAN_STAGE,
  createLoanStage,
  proxyAccountAddress,
} from "../recoil/atoms"
import {changeChain, getProxyAddress, initialContract} from "../helpers/web3"
import { GET_CDPS, CDP_MANAGER, MCD_CAT, PIP_ETH } from "../blockchain/addresses/kovan.json"
import getCdpsAbi from "../blockchain/abi/get-cdps.json"
import mcdCatAbi from "../blockchain/abi/mcd-cat.json"
import osmAbi from "../blockchain/abi/mcd-osm.json"

interface LayoutProps {
  children: JSX.Element
  noLayout: boolean
}

const LayoutContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  background: url("/images/background/stars1.jpeg") top left;
  background-size: cover;
  background-color: ${defaultBg};
  min-height: 100vh;
  //overflow: hidden;
`

const LayoutMain = styled.div`
  max-width: ${(props) => (props.noLayout ? "100%" : rem`1440px`)};
  margin: 0 auto;
`

const Layout: React.FC<LayoutProps> = ({ noLayout = false, children }) => {
  const [address, setAddress] = useRecoilState(connectionAccountState)
  const setProxyAddress = useSetRecoilState(proxyAccountAddress)
  const setStage = useSetRecoilState(createLoanStage)

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

            const contract = initialContract(getCdpsAbi, GET_CDPS)
            const cdp = await contract.methods.getCdpsAsc(CDP_MANAGER, proxy).call()
            console.log(cdp)
            const mcdCont = initialContract(mcdCatAbi, MCD_CAT)
            const osm = initialContract(osmAbi, PIP_ETH)

          }

          window.ethereum.on("accountsChanged", async (accounts) => {
            setAddress(accounts[0])
            setStage(CREATE_LOAN_STAGE.editForm)
            const proxy = await getProxyAddress(accounts[0])
            setProxyAddress(proxy)
          })

          window.ethereum.on("chainChanged", () => {
            window.location.reload()
          })
        }
      } catch (err) {
        console.log(err.message)
      }
    }

    void metaMask()
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
    <LayoutContainer>
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
