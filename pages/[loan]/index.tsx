import React from "react"
import Layout from "../../components/Layout"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import BigNumber from "bignumber.js"
import LoanDetailOverView from "../../features/loan-detail/LoanDetailOverView"
import WithAuth from "../../components/Authentication";

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ["common"])),
      loan: ctx.query?.loan || null,
    },
  }
}

const LoanDetail = ({ loan }: { loan: string }) => {
  const loanId = new BigNumber(loan)
  const isValidLoanId = loanId.isInteger() && loanId.gt(0)

  return (
    <WithAuth>{isValidLoanId && <LoanDetailOverView loan={loan} />}</WithAuth>
  )
}

LoanDetail.getLayout = (page) => <Layout noLayout={false}>{page}</Layout>

export default LoanDetail
