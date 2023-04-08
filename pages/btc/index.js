import Head from 'next/head'
import styles from '../../styles/Home.module.css';
import DepositForm from '../../components/btcDeposit';
import Footer from '../../components/footer';
import Header from '../../components/header';
import Support from '../../components/support';


export default function Btc() {
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Bitcoin Escrow Services - yescrow</title>
        <meta name="description" content="Escrow bitcoin safely. No need to register - just deposit crypto and release it when you receive your end of the deal." />
        <link rel="icon" href="/favicon.png" />
        <link rel="canonical" href="https://yescrow.xyz/btc" />
      </Head>
      <main className={styles.main}>
        <Header />  
        <DepositForm />
        <Support />
      </main>
      <Footer />
      </div>
  )
}