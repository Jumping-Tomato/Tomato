import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import { getSession } from 'next-auth/react'

export default function ResetPassword({userProps}){
    const router = useRouter();
    const [formData, setFormData] = useState({
      "currentPassword":"",
      "newPassword1":"",
      "newPassword2":""
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
        if(formData.newPassword1 !== formData.newPassword2){
            setError("Passwords do NOT match");
            return;
        }
        const data = {
          id: userProps.id,
          password: formData.currentPassword,
          newPassword: formData.newPassword1
        }
        axios.post('/api/reset-password', data)
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
             <title>Register</title>
             <meta name="description" content="Register page" />
             <link rel="icon" href="#" />
           </Head>
 
           <main className={global.main}>
             <div className='row justify-content-center'>
               <div className="col-lg-6 col-12 p-3">
                    <Form onChange={handleChange} onSubmit={handleSubmit} > 
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
    userProps["id"] = session.id;
  }
  return {
    props: {userProps}
  }
}