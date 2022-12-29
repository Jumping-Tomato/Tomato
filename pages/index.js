import Head from 'next/head';
import global from 'styles/Global.module.scss';
import {Topbar, Footer} from 'components';
import Image from 'next/image';

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
            <Image src="/images/home_1.png" alt="students and teachers in a classroom" width={566} height={696} />
          </div>
          <div className="col-lg-6 col-12 pt-5">
            <h3 className="pt-5 lh-base">
                Make teaching easier and more fun.
                We simplify the job of every teacher
                when it comes to testing.
            </h3>
          </div>
        </div>
      </main>
    </div>
    <Footer />
    </>
  )
}
