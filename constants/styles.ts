import styled from "styled-components"
import { rem } from "../helpers/common-function"

const defaultBg = "#231642"

const BREAKPOINT = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "769px",
  laptop: "1025px",
  laptopL: "1440px",
  laptopXL: "1920px",
  desktop: "2560px",
  desktopL: "5000px",
}

const DEFAULT_DEVICE = {
  mobileS: `(min-width: ${BREAKPOINT.mobileS})`,
  mobileM: `(min-width: ${BREAKPOINT.mobileM})`,
  mobileL: `(min-width: ${BREAKPOINT.mobileL})`,
  tablet: `(min-width: ${BREAKPOINT.tablet})`,
  laptop: `(min-width: ${BREAKPOINT.laptop})`,
  laptopL: `(min-width: ${BREAKPOINT.laptopL})`,
  laptopXL: `(min-width: ${BREAKPOINT.laptopXL})`,
  desktop: `(min-width: ${BREAKPOINT.desktop})`,
  desktopL: `(min-width: ${BREAKPOINT.desktopL})`,
}

const BREAKPOINT_DEFAULT = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 769,
  laptop: 1024,
  laptopL: 1440,
  laptopXL: 1920,
  desktop: 2560,
}

interface CommonDivProp {
  p?: string
  m?: string
  d?: string
  tAlign?: string
}

interface CommonTagProp extends CommonDivProp {
  fSize?: number
  weight?: string | number
  pointer?: boolean
  fColor?: string
}

const CommonDivTag = styled.div<CommonDivProp>`
  padding: ${(props) => (props.p ? props.p : 0)};
  margin: ${(props) => (props.m ? props.m : 0)};

  display: ${(props) => (props.d ? props.d : "block")};
  flex-direction: column;
  align-items: center;
  color: white;

  text-align: ${(props) => (props.tAlign ? props.tAlign : "left")};
`

const CommonPTag = styled.p<CommonTagProp>`
  color: ${(props) => (props.fColor ? props.fColor : "white")};
  font-size: ${(props) => (props.fSize ? `${rem(props.fSize)}` : "14px")};
  font-weight: ${(props) => (props.weight ? props.weight : "400")};
  padding: ${(props) => (props.p ? props.p : 0)};
  margin: ${(props) => (props.m ? props.m : 0)};
  cursor: ${(props) => (props.pointer ? "pointer" : "default")};
  text-align: ${(props) => (props.tAlign ? props.tAlign : "left")};
`

const CommonSpanTag = styled.span<CommonTagProp>`
  color: ${(props) => (props.fColor ? props.fColor : "white")};
  font-size: ${(props) => (props.fSize ? `${rem(props.fSize)}` : "14px")};
  font-weight: ${(props) => (props.weight ? props.weight : "400")};
  padding: ${(props) => (props.p ? props.p : 0)};
  margin: ${(props) => (props.m ? props.m : 0)};
`

const Space = styled.div<{ top?: number }>`
  margin-top: ${(props) => (props.top ? `${rem(props.top)}` : 0)};
`

const DivTextCenter = styled.div`
  text-align: center;
`

export {
  defaultBg,
  BREAKPOINT,
  DEFAULT_DEVICE,
  BREAKPOINT_DEFAULT,
  CommonDivTag,
  CommonPTag,
  CommonSpanTag,
  Space,
  DivTextCenter
}
