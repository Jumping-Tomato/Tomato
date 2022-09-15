import { Button } from 'react-bootstrap';

import Head from 'next/head'
import Topbar from "../components/Topbar";
import global from '../styles/Global.module.scss'
import Footer from '../components/Footer'


export default function Login() {
    return(
        <>
      <Topbar />
      <div className={global.container}>
        <Head>
          <title>Login</title>
          <meta name="description" content="Plese Login to Tomoto" />
      
        </Head>

        <main className={global.main}>
            
            
        </main>
      </div>
      <Footer />
    </>
    )
}