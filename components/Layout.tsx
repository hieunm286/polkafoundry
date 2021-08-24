import React, { useEffect } from "react"
import styled from "styled-components"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { defaultBg } from "../constants/styles"
import AppHeader from "./Header"
import {amountFromRad, amountFromRay, GetFromLocalStorage, rem, utf8ToBytes32} from "../helpers/common-function"
import { useRecoilState, useSetRecoilState } from "recoil"
import {
  connectionAccountState,
  CREATE_LOAN_STAGE,
  createLoanStage,
  proxyAccountAddress,
} from "../recoil/atoms"
import {changeChain, getProxyAddress, initialContract} from "../helpers/web3"
import { GET_CDPS, CDP_MANAGER, MCD_CAT, PIP_ETH, MCD_VAT, MCD_SPOT, MCD_JUG } from "../blockchain/addresses/moonbeam.json"
import getCdpsAbi from "../blockchain/abi/get-cdps.json"
import cdpManagerAbi from "../blockchain/abi/dss-cdp-manager.json"
import mcdJugAbi from "../blockchain/abi/mcd-jug.json"
import vatAbi from "../blockchain/abi/vat.json"
import spotAbi from "../blockchain/abi/mcd-spot.json"
import mcdCatAbi from "../blockchain/abi/mcd-cat.json"
import osmAbi from "../blockchain/abi/mcd-osm.json"

import Web3 from "web3";
import {amountFromWei} from "@oasisdex/utils";
import {BigNumber} from "bignumber.js";
import {vatIlks$} from "../helpers/ilks/vat";
import {spotIlks$} from "../helpers/ilks/spot";
import {jugIlks$} from "../helpers/ilks/jug";
import {catIlks$} from "../helpers/ilks/cat";
import {createIlkData$} from "../helpers/ilks";
import {mcdData} from "../constants/variables";
import {createOraclePriceData$} from "../helpers/pip/oracle";
import {pipPeek$} from "../helpers/pip/pip";

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
        console.log(err)
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
