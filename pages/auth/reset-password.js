import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import { getSession } from 'next-auth/react'
import UserForm from "components/User-form"


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
          id: userProps._id,
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
    const formFields = [
      {
        "label": "Current Password",
        "type": "password",
        "name": "currentPassword",
        "placeholder": "Current Password",
        "required": true
      },
      {
        "label": "New Password",
        "type": "password",
        "name": "newPassword1",
        "placeholder": "New Password",
        "required": true
      },
      {
        "label": "Confirm New Password",
        "type": "password",
        "name": "newPassword2",
        "placeholder": "Confirm New Password",
        "required": true
      },
    ]

    return (
         <>
         <div className={global.container}>
           <Head>
             <title>Reset Password</title>
             <meta name="description" content="Reset Password" />
             <link rel="icon" href="#" />
           </Head>
 
           <main className={global.main}>
             <div className='row justify-content-center'>
               <div className="col-lg-6 col-12 p-3">
                  <UserForm handleChange={handleChange} handleSubmit={handleSubmit} formFields={formFields} error={error} />
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