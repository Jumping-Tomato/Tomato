import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import global from 'styles/Global.module.scss';
import Head from 'next/head';
import {Topbar, Footer} from 'components';
import { useRouter } from 'next/router';

export default function Success() {
    const router = useRouter();

    return(
        <>  
            <Topbar />
            <div className={global.container}>
                <Head>
                    <title>Payment Succeeded</title>
                    <meta name="Payment Succeeded Page" content="Payment Succeeded" />
                    <link rel="icon" href="/media/images/logo.svg" />
                </Head>

                <main className={global.main}>
                    <div className='row justify-content-center'>
                        <div className="col-lg-8 col-12 p-5">
                            <h4>&#128549 Payment was processed successfully. You will be redirected to dashboard page.</h4>  
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className="col-2 p-3">
                            <CountdownCircleTimer
                                isPlaying={true}
                                duration={15}
                                size={100}
                                strokeWidth={6}
                                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                                colorsTime={[10, 6, 3, 0]}
                                onComplete={() => {
                                    router.push('/teacher/dashboard');
                                }}
                            >
                                {renderTime}
                            </CountdownCircleTimer>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    )
}

const renderTime = ({ remainingTime }) => {
    return (
      <h1 style={{ marginTop: '0.5rem'}}>  
        {remainingTime}
      </h1>
    );
};