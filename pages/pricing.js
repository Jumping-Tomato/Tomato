import Head from 'next/head'
import global from 'styles/Global.module.scss'
import {Topbar, Footer} from 'components'
import Image from 'next/image';


export default function Pricing() {
    return(
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>Pricing | Jumping Tomato</title>
            <meta name="description" content="Pricing Page" />
            <link rel="icon" href="/images/logo.svg" />
          </Head>
          
     
          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-lg-6 col-12 p-5">
                <h1>It is FREE!!!</h1>
                <Image src="/gifs/yes-happy.gif" width={498} height={220} />
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
}