import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Footer from '../components/footer';
import Header from '../components/header';
import About from '../components/about';
import Support from '../components/support';

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>yescrow - Blockchain Escrow Services: Trust Anonymously</title>
        <meta name="description" content="Automated crypto escrow services for your online safety. No need to register, simply stake and release when you are satisfied." />
        <link rel="canonical" href="https://yescrow.xyz" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styles.main}>
        <Header /> 
        <About />
        <Support />
      </main>
      <Footer />
    </div>
  )
}
