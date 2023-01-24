import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import { getSession } from 'next-auth/react';
import { Alert, Button, Form } from 'react-bootstrap';
import ReCAPTCHA from "react-google-recaptcha";

/*
*
* This page is for authenticated users to change their password.
*
*/
export default function PasswordResetPage({userProps}){
    const router = useRouter();
    const [formData, setFormData] = useState({
      "currentPassword":"",
      "newPassword1":"",
      "newPassword2":""
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
        const captchaValue = captchaRef.current.getValue();
        if(!captchaValue){
          setError('Prove that you are not a bot.');
          return;
        }
        if(formData.newPassword1 !== formData.newPassword2){
            setError("Passwords do NOT match");
            return;
        }
        const data = {
          id: userProps._id,
          password: formData.currentPassword,
          newPassword: formData.newPassword1,
          captchaValue,captchaValue
        }
        axios.post('/api/reset-password', data)
        .then(function (response) {
          router.push("/auth/signin");
        })
        .catch(function (error) {
          setError(error.response.data.error);
          captchaRef.current.reset();
        });  
    }

    return (
         <>
         <div className={global.container}>
           <Head>
             <title>Reset Password</title>
             <meta name="description" content="Reset Password" />
             <link rel="icon" href="/images/logo.svg" />
           </Head>
 
           <main className={global.main}>
             <div className='row justify-content-center'>
               <div className="col-lg-6 col-12 p-3">
                <Form onChange={handleChange}  onSubmit={handleSubmit}>  
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" name="currentPassword" placeholder="Current Password" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" name="newPassword1" placeholder="New Password" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" name="newPassword2" placeholder="Confirm New Password" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY}
                      ref={captchaRef}
                    />
                  </Form.Group>
                  { error && <Alert variant="danger"> {error} </Alert>}
                  <Button variant="primary" type="submit">
                      Submit
                  </Button>
                </Form>
               </div>
             </div>
           </main>
         </div>
       </>
    );
}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  let userProps = {};
  if (session){
    userProps["_id"] = session._id;
  }
  return {
    props: {userProps}
  }
}