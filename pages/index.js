import Head from 'next/head';
import global from 'styles/Global.module.scss';
import {Topbar, Footer} from 'components';
import Image from 'next/image';
import Link  from 'next/link';
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
    <Topbar />
    <div className={global.container}>
      <Head>
        <title>Jumping Tomato | Cloud-Based software, Autograding Online Test System</title>
        <meta name="description" content="At Jumping Tomato, we are dedicated to make the jobs of every teachers easier and more efficient by providing
                                          the most adequating and most affordable autograding online test system" />
        <link rel="icon" href="/media/images/logo.svg" />
      </Head>

      
      <main className={global.main}>
        <div className='row'>
          <div className="col-lg-5 col-12 pt-5">
            <Image src="/media/images/home_1.png" className={global.fadeInSlideUpAnimation} alt="students and teachers in a classroom" width={325} height={400} />
          </div>
          <div className="col-lg-7 col-12 pt-5">
            <h3 className="pt-5 lh-base">
                Make teaching easier and more fun.
                We simplify the job of every teacher
                when it comes to testing. Our platform is an autograding system
                for tests and quizzes.
            </h3>
            <br />
            { !session && <h3><Link href="/auth/register">Register</Link> and get started now.</h3> }
            { session && <h3>Go to <Link href={`/${session.role}/dashboard`}>dashboard</Link> to get started.</h3> }
          </div>
        </div>
        <div className='row'>
          <div className="col-12 pt-5">
          <h3>Reasons to Use Jumping Tomato:</h3>
          <ul>
            <li><b>Time Flexity</b>: You can set the start date and deadline of the tests, and your students can take the tests anytime within the time frame.</li>
            <li><b>Location Flexity</b>: You can create your tests anywhere in the world, and your studennts can take the tests anywhere in the world.</li>
            <li><b>Automatic Grading</b>: Score is available instantly after submission. It saves you time from grading manually.</li>
            <li><b>Activity Monitor</b>: We monitor the activities of test takers to prevent cheating.</li>
          </ul>
          </div>
        </div>
        <div className='row'>
          <div className="col-12 pt-5">
            <h3>Making the questions is really simple:</h3>
            <Image className="pt-3" src="/media/gifs/edit-questions-demo.gif" width={1240} height={620} />
          </div>
        </div>
      </main>
    </div>
    <Footer />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {},
  }
}