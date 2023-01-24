import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
import  Link  from 'next/link';
import axios from 'axios';
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import ReCAPTCHA from "react-google-recaptcha";

export default function Resgister(){
    const router = useRouter();
    const [formData, setFormData] = useState({
      "email":"",
      "firstName":"",
      "lastName":"",
      "role": "",
      "password1":"",
      "password2":"",
    });
    const captchaRef = useRef(null);
    const [error, setError] = useState("");
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
        if(formData.password1 !== formData.password2){
          setError("Passwords do NOT match");
          return;
        }
        const user = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          password: formData.password1,
          captchaValue: captchaValue
        }
        axios.post('/api/auth/register', user)
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
            <title>Register</title>
            <meta name="description" content="Register page" />
            <link rel="icon" href="/images/logo.svg" />
          </Head>

          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-lg-6 col-12 p-3">
                <Form onChange={handleChange} onSubmit={handleSubmit} >  
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>I am a</Form.Label>
                    <Form.Select name="role" required>
                      <option disbled></option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name="firstName" placeholder="Enter First Name" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name="lastName" placeholder="Enter Last Name" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password1" placeholder="Password" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control type="password" name="password2" placeholder="Password" required />
                  </Form.Group>
                  <ReCAPTCHA
                    className='pb-2'
                    sitekey={process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY}
                    ref={captchaRef}
                  />
                  { error && <Alert variant="danger"> {error} </Alert>}
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
                <div className="text-center">
                    <p>Already a member? <Link href="/auth/signin">Sign In</Link></p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
}
