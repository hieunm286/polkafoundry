import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import WithAuth from "../../components/Authentication";
import OpenVaultsList from "../../features/vaults-list/OpenVaultsList";
import Layout from "../../components/Layout";

export async function getServerSideProps(ctx: any) {
    return {
        props: {
            ...(await serverSideTranslations(ctx.locale, ['common'])),
            address: ctx.query?.address || null,
        },
    }
}

const VaultsList = () => {
    return (
        <WithAuth>
            <OpenVaultsList />
        </WithAuth>
    );
};

// eslint-disable-next-line react/display-name
VaultsList.getLayout = (page) => <Layout noLayout={false}>{page}</Layout>

export default VaultsList;