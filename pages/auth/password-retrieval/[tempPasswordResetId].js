import { passwordResetRepo } from 'database/password-reset-repo'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
import  Link  from 'next/link';
import axios from 'axios';
import Head from 'next/head'
import global from 'styles/Global.module.scss'

/*
*
* This page is for un-authenticated users who forgot their password
* to reset their password.
*
*/
export default function TempPassowordResetPage({props}){
  const router = useRouter();
  const [formData, setFormData] = useState({
    "email":"",
    "newPassword1":"",
    "newPassword2":"",
  });
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
    if(formData.password1 !== formData.password2){
      setError("Passwords do NOT match");
      return;
    }
    const data = {
      pwResetId: props.pw_reset_id,
      user_id: props.user_id,
      newPassword: formData.newPassword1
    }
    const url = "/api/auth/password-retrieval/ForceResetPasswordHandler";
    axios.post(url, data)
    .then(function (response) {
      router.push("/auth/signin");
    })
    .catch(function (error) {
      setError(error.response.data.error);
    });       
}

  return (
    <>
        <div className={global.container}>
          <Head>
            <title>Un-authenticated User Password Reset Page</title>
            <meta name="description" content="Password Reset Page" />
            <link rel="icon" href="/images/logo.svg" />
          </Head>

          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-lg-6 col-12 p-3">
                <Form onChange={handleChange} onSubmit={handleSubmit} >  
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" name="newPassword1" placeholder="Password" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" name="newPassword2" placeholder="Password" required />
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
    )
}


export async function getServerSideProps(context) {
  const { tempPasswordResetId } = context.query;
  let passwordResetData;
  try{
    passwordResetData = await passwordResetRepo.find(tempPasswordResetId);
  }
  catch(error){
    console.error(error);
    throw error;
  }
  if(!passwordResetData || new Date() > new Date(passwordResetData.expire)){
    return {
      notFound: true,
    }
  }
  const props = {
    user_id: passwordResetData.user_id.toString(),
    pw_reset_id: tempPasswordResetId
  };
  return {
    props: {props}
  }
}