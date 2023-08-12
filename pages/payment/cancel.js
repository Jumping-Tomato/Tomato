import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import global from 'styles/Global.module.scss';
import Head from 'next/head';
import {Topbar, Footer} from 'components';
import { useRouter } from 'next/router';


export default function Cancel() {
    const router = useRouter();
    
    return(
        <>  
            <Topbar />
            <div className={global.container}>
                <Head>
                    <title>Payment Failed</title>
                    <meta name="Payment Failed Page" content="Payment Failed" />
                    <link rel="icon" href="/media/images/logo.svg" />
                </Head>

                <main className={global.main}>
                    <div className='row justify-content-center'>
                        <div className="col-lg-8 col-12 p-5">
                            <h2>&#128542;&#128542;&#128542;&#128542;&#128542;&#128542;</h2>
                            <h4><span role="img" aria-label="sad emoji"></span>Payment Failed. You will be redirected to the checkout page again.</h4>  
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
                                    router.push('/payment/checkout');
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

