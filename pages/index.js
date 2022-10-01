import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { useRouter } from 'next/router';
import { signOut, useSession, getSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
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
          {session ? <button onClick={()=>signOut()}>Log out</button> : <button onClick={()=>{router.push("/api/auth/signin")}}>Sign in</button>}
          </div>
        </div>
      </main>
    </div>
    <Footer />
    </>
  )
}
