import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import WithAuth from "../../components/Authentication";
import Layout from "../../components/Layout";
import LoanList from "../../features/loan/LoanList";

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ['common'])),
      address: ctx.query?.address || null,
    },
  }
}

const ListingLoan = () => {
  return (
    <>
      <LoanList />
    </>
  );
};

// eslint-disable-next-line react/display-name
ListingLoan.getLayout = (page) => <Layout noLayout={false}>{page}</Layout>

export default ListingLoan;