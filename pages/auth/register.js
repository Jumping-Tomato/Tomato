import React from 'react';
import {
  MDBContainer,
  MDBInput
}
from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { signIn } from "next-auth/react";

export default function Resgister(){
    const router = useRouter();
    const [formData, setFormData] = useState({
      "email":"",
      "first name":"",
      "last Name":"",
      "password1":"",
      "password2":"",
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
        
    }
    return (
        <form onChange={handleChange} onSubmit={handleSubmit}>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <MDBInput wrapperClass='mb-4' label='Email address' name="email" type='email' required/>
                <MDBInput wrapperClass='mb-4' label='First Name' name="first name" type='text' required/>
                <MDBInput wrapperClass='mb-4' label='Last Name' name="last name" type='text' required/>
                <MDBInput wrapperClass='mb-4' label='Password' name="password1" type='password' required />
                <MDBInput wrapperClass='mb-4' label='Password' name="password2" type='password' required />
                { error && <Alert variant="danger"> {error} </Alert>}
                <div className="d-flex justify-content-between mx-3 mb-4">
                    
                </div>
                <Button variant="primary" type="submit">
                        Submit
                </Button>

                <div className="text-center">
                    <p>Already a member? <a href="/auth/signin">Sign In</a></p>
                </div>
            </MDBContainer>
        </form>
    );
}
