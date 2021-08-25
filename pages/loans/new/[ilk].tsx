import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from "../../../components/Layout";
import CreateNewLoan from "../../../features/loan/CreateNewLoan";
import WithAuth from "../../../components/Authentication";

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ['common'])),
      ilk: ctx.query.ilk || null,
    },
  }
}

export default function NewLoan({ ilk }: { ilk: string }) {
  return (
    <WithAuth>
      <CreateNewLoan ilk={ilk} />
    </WithAuth>
  )
}

NewLoan.getLayout = (page) => <Layout noLayout={false}>{page}</Layout>
