import Head from 'next/head'
import global from 'styles/Global.module.scss'
import {Topbar, Footer} from 'components'



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
              <div className="col-lg-6 col-12 p-3">
                <h1>Coming Soon!</h1>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
}