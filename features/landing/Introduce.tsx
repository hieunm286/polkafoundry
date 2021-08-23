import React from "react"
import styled from "styled-components"
import { CommonPTag } from "../../constants/styles"
import { rem } from "../../helpers/common-function"
import { useTranslation } from "next-i18next"

const Introduce = () => {
  const { t } = useTranslation()

  return (
    <IntroduceContainer>
      <CoinImage src={`/images/icon/home-coin.png`} alt={``} />
      <IntroDescription>
        <CommonPTag fSize={16} fColor={`#EDA44C`} weight={500}>
          {t("homepage.overview")}
        </CommonPTag>
        <CommonPTag fSize={50} fColor={`#6419E0`} weight={700}>
          {t("homepage.pUSDStable")}
        </CommonPTag>
        <CommonPTag fSize={14} fColor={`#282736`} weight={500} m={`60px 0 0`}>
          {t("homepage.introduceDes1")}
        </CommonPTag>
        <BR />
        <CommonPTag fSize={14} fColor={`#282736`} weight={500}>
          {t("homepage.introduceDes2")}
        </CommonPTag>
        <BR />
        <CommonPTag fSize={14} fColor={`#282736`} weight={500}>
          {t("homepage.introduceDes3")}
        </CommonPTag>
      </IntroDescription>
    </IntroduceContainer>
  )
}

export default Introduce

//----------------------
const IntroduceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;

  padding-bottom: ${rem`100px`};
`

const CoinImage = styled.img`
  max-width: 100%;
  display: block;
  margin-top: ${rem`-390px`};
`

const IntroDescription = styled.div`
  text-align: left;
  max-width: ${rem`665px`};
  margin: ${rem`50px`} auto 0;
`
const BR = styled.br``
