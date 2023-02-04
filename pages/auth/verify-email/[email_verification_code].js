import React, { useState, useRef, useEffect } from 'react';
import { usersRepo } from 'database/user-repo';
import Head from 'next/head';
import global from 'styles/Global.module.scss';
import { Footer } from 'components';
import { useRouter } from 'next/router';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';


export default function VerifyEmailPage(){
    const router = useRouter();
       
    return (
      <>
          <div className={global.container}>
            <Head>
              <title>Email Verification Page</title>
              <meta name="Email Verification Page" content="Email Verification" />
              <link rel="icon" href="/images/logo.svg" />
            </Head>
  
            <main className={global.main}>
              <div className='row justify-content-center'>
                <div className="col-lg-8 col-12 p-3">
                    <h4>Email has been verified. You will be redirected to the login page.</h4>  
                </div>
              </div>
              <div className='row justify-content-center'>
                <div className="col-2 p-3">
                      <CountdownCircleTimer
                          isPlaying={true}
                          duration={5}
                          size={100}
                          strokeWidth={6}
                          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                          colorsTime={[10, 6, 3, 0]}
                          onComplete={() => {
                            router.push('/auth/signin');
                          }}
                        >
                        {renderTime}
                      </CountdownCircleTimer>
                </div>
              </div>
            </main>
          </div>
       </>
  );
}

const renderTime = ({ remainingTime }) => {
  return (
    <h1 style={{ marginTop: '0.5rem'}}>  
      {remainingTime}
    </h1>
  );
};
export async function getServerSideProps(context) {
  const { email_verification_code } = context.query;
  const email_verified = await usersRepo.verifyUserEmail(email_verification_code);
  if(!email_verified){
    return {
      notFound: true
    }
  }
  return {
    props: {}
  }
}