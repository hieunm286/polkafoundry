import React from 'react';
import Layout from "../../../components/Layout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LoanOverview from "../../../features/loan-overview/LoanOverview";

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ['common'])),
      address: ctx.query?.address || null,
    },
  }
}

const LoanSummary = ({ address }: { address: string }) => {
  return (
    <>
      <LoanOverview address={address} />
    </>
  );
};

LoanSummary.getLayout = (page) => <Layout noLayout={false}>{page}</Layout>

export default LoanSummary;