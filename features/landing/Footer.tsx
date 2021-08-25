import React from "react"
import styled from "styled-components"
import { rem } from "../../helpers/common-function"
import { CommonPTag, DEFAULT_DEVICE } from "../../constants/styles"
import { Box, Grid } from "theme-ui"
import { useTranslation } from "next-i18next"

const FOOTER_SECTION = [
  {
    gap: 1,
    title: "homepage.about",
    link: [
      { label: "homepage.landingPage", url: "/" },
      { label: "homepage.whitePaper", url: "/" },
      { label: "homepage.term", url: "/" },
      { label: "homepage.privacy", url: "/" },
    ],
  },
  {
    gap: 2,
    title: "homepage.support",
    link: [
      { label: "homepage.faq", url: "/" },
      { label: "homepage.oraclePrice", url: "/" },
    ],
  },
]

const Footer = () => {
  const { t } = useTranslation()
  return (
    <FooterContainer>
      <Grid gap={2} columns={[1, "1fr 1fr 1fr 1fr"]}>
        <Grid>
          <Box>
            <Logo src={`/images/icon/polka-icon.svg`} alt={``} />
            <Image src={`/images/icon/polka-label.svg`} alt={``} width={82} height={30} />
          </Box>
        </Grid>
        {FOOTER_SECTION.map(({ gap, title, link }) => (
          <div key={title}>
            <CommonPTag fSize={18} weight={`bold`} m={`0 0 25px 0`}>
              {t(title)}
            </CommonPTag>
            {link.map(({ label, url }, idx) => (
              <Box key={label} sx={{ marginTop: 12 }}>
                <Link href={url} target={"_blank"}>
                  {t(label)}
                </Link>
              </Box>
            ))}
          </div>
        ))}
        <Grid>
          <Box>
            <Link href={"/"}>
              <Image src={"/images/icon/facebook.svg"} alt={``} />
              <Image src={"/images/icon/twitter.svg"} alt={``} />
              <Image src={"/images/icon/telegram.svg"} alt={``} />
            </Link>
          </Box>
        </Grid>
      </Grid>
    </FooterContainer>
  )
}

export default Footer

//------------
const FooterContainer = styled.footer`
  @media ${DEFAULT_DEVICE.laptop} {
    padding: ${rem`105px`} ${rem`165px`};
  }
`

const Logo = styled.img`
  width: ${rem`38px`};
  height: ${rem`44px`};
  margin-right: ${rem`12px`};
  cursor: pointer;
`

const Link = styled.a`
  color: white;
  font-weight: 500;
  font-size: ${rem(14)};
  line-height: ${rem(17)};
`

const Image = styled.img`
  cursor: pointer;
  margin-right: ${rem(40)};
`
