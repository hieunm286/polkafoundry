import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import LandingTemplate from "../features/landing/LandingTemplate";
import Layout from "../components/Layout";

const LandingPage = () => {
  return (
      <>
          <LandingTemplate />
      </>
  )
}

LandingPage.layout = page => <Layout>{page}</Layout>

export default LandingPage