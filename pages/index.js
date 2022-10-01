import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'

export default function Home() {
  return (
    <>
    <Topbar />
    <div className={global.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/hair_cut.svg" />
      </Head>

      
      <main className={global.main}>
        <div className='row'>
          <div className="col-lg-6 col-12 pt-5">
          
          </div>
        </div>
      </main>
    </div>
    <Footer />
    </>
  )
}
