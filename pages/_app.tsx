import "../styles/globals.css"
import { AppProps } from "next/app"
import { NextComponentType, NextPageContext } from "next"
import React, { ReactElement } from "react"
import { ThemeProvider } from "styled-components"

import { lightTheme, GlobalStyles } from "../ThemeConfig"
// import useDarkMode from "use-dark-mode"
import { RecoilRoot } from "recoil"
import nextI18NextConfig from "../next-i18next.config.js"
import { appWithTranslation } from "next-i18next"
import { theme } from "../theme-ui"

const ThemeUI = require("theme-ui").ThemeProvider

declare global {
  interface Window {
    ethereum: any
  }
}

interface CustomAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, {}> & {
    getLayout: (page: ReactElement | HTMLElement) => ReactElement | HTMLElement
  }
  pageProps: any
}

const MyApp: React.FC<CustomAppProps> = ({ Component, pageProps }) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const getLayout = Component.getLayout || ((page) => page)
  // const [isMounted, setIsMounted] = useState(false)
  // const darkMode = useDarkMode(false)

  // const theme = darkMode.value ? darkTheme : lightTheme

  // useEffect(() => {
  //     setIsMounted(true)
  //     // darkMode.disable()
  // }, [])

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <ThemeUI theme={theme}>
        <RecoilRoot>{getLayout(<Component {...pageProps} />)}</RecoilRoot>
      </ThemeUI>
    </ThemeProvider>
  )
}

export default appWithTranslation(
  MyApp as React.ComponentType<AppProps> | React.ElementType<AppProps>,
  nextI18NextConfig,
)
