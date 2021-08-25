import React from "react"
import styled from "styled-components"
import { Spinner } from "theme-ui"
import { useRecoilValue } from "recoil"
import { pageLoading } from "../recoil/atoms"

const PageSpinning = () => {
  const loading = useRecoilValue(pageLoading)

  if (!loading) {
    return null
  }

  return (
    <LoaderContainer>
      <Loader>
        <Spinner sx={{ color: "#500EC1", marginRight: 2 }} size={60} />
      </Loader>
    </LoaderContainer>
  )
}

export default PageSpinning
//-------------------
const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f8f8ad;
  z-index: 9999;
`

const Loader = styled.div`
  left: 50%;
  top: 40%;
  z-index: 9999;
  position: absolute;
`
