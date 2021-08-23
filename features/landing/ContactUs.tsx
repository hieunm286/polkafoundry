import React from "react"
import styled from "styled-components"
import { rem } from "../../helpers/common-function"
import { CommonPTag, DEFAULT_DEVICE } from "../../constants/styles"
import { useTranslation } from "next-i18next"

const ContactUs = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <Title>{t("homepage.contactUs")}</Title>
      <CommonPTag fSize={24} weight={400} fColor={`#282736`} tAlign={`center`}>
        {t("homepage.getQuestion")}
      </CommonPTag>
      <Button>support@polkafi.finance</Button>
    </Container>
  )
}

export default ContactUs

//-------------------------
const Container = styled.div`
  width: 57%;
  padding: ${rem`5px`} ${rem`10px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding-top: ${rem(110)};
  padding-bottom: ${rem`100px`};
`

const Title = styled.p`
  font-style: normal;
  font-weight: 700;
  font-size: ${rem`48px`};
  line-height: 150%;
  margin-bottom: ${rem`15px`};
  background: linear-gradient(
    to right,
    rgba(255, 160, 46, 1) 42%,
    rgba(189, 14, 193, 1) 50%,
    rgba(38, 242, 255, 1) 51%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

  margin-top: ${rem`45px`};

  @media ${DEFAULT_DEVICE.laptop} {
    width: ${rem`320px`};
    height: ${rem`64px`};
  }
`
