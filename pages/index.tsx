import LandingTemplate from "../features/landing/LandingTemplate"
import Layout from "../components/Layout"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
})

const LandingPage = () => {
  return (
    <>
      <LandingTemplate />
    </>
  )
}

// eslint-disable-next-line react/display-name
LandingPage.getLayout = (page) => <Layout noLayout>{page}</Layout>

export default LandingPage
