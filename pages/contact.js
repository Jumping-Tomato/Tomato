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
            <div className='row'>
              <div className="col-lg-6 col-12 p-3 mt-5">
                <h6 className='text-primary'>Say Hello</h6>
                <h2>Contact the Team</h2>
                <p>Having trouble with the product, need help with signing up, 
                  have questions about our offering, or just want to chat? 
                  You can reach out to our team through a couple of methods:
                </p>
                <ul>
                  <li>Email: <a href="mailto:support@jumpingtomato.com" target="_blank" rel="noreferrer">support@jumpingtomato.com</a></li>
                  <li>Discord: <a href="https://discord.gg/GRwZ9e7z">Join our server</a></li>
                </ul>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
}