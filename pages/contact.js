import Head from 'next/head'
import global from 'styles/Global.module.scss'
import {Topbar, Footer} from 'components'



export default function Contact() {
    return(
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>Contact Us | Jumping Tomato</title>
            <meta name="description" content="Contact Us Page" />
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