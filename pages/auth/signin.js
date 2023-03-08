import {
  MDBContainer,
  MDBInput
}
from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { signIn } from "next-auth/react";
import  Link  from 'next/link';
import ReCAPTCHA from "react-google-recaptcha";
import Head from 'next/head';

export default function Signin(){
    const router = useRouter();
    const [formData, setFormData] = useState({
      "email":"",
      "password":"",
    });
    const [error, setError] = useState("");
    const captchaRef = useRef(null);
    const handleChange = function (event){
      let name = event.target.name;
      let val = event.target.value;
      setFormData({
        ...formData,
        [name]: val
      });
    }
    const handleSubmit = async function(event){
        event.preventDefault();
        try{
            const captchaValue = captchaRef.current.getValue();
            if(!captchaValue){
                setError('Prove that you are not a bot.');
                return;
            }
            const res = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
                captchaValue: captchaValue
            });
            if(res.status == 200){
                router.push("/");
            }
            else{
                setError(res.error);
                captchaRef.current.reset();
            }
        }
        catch(error){
            setError("An error has occurred. Please try again later");
        }
    }
    return (
        <>
        <div className={global.container}>
          <Head>
            <title>Sign In</title>
            <meta name="description" content="Sign-in Page" />
            <link rel="icon" href="/media/images/logo.svg" />
          </Head>

          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-lg-6 col-12 p-3">
                <form onChange={handleChange} onSubmit={handleSubmit}>
                    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                        <MDBInput wrapperClass='mb-4' label='Email address' name="email" type='email' required/>
                        <MDBInput wrapperClass='mb-4' label='Password' name="password" type='password' required />
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY}
                            ref={captchaRef}
                        />
                        <br/>
                        { error && <Alert variant="danger"> {error} </Alert>}
                        <div className="d-flex justify-content-between mx-3 mb-4">
                            <Link href="/auth/password-retrieval/forgot-password">Forgot password?</Link>
                        </div> 
                        <Button variant="primary" type="submit">
                                Sign In
                        </Button>

                        <div className="text-center">
                            <p>Not a member? <Link href="/auth/register">Register</Link></p>
                        </div>
                    </MDBContainer>
                </form>
              </div>
            </div>
          </main>
        </div>
      </>
    );
}
