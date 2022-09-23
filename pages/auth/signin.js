import React from 'react';
import {
  MDBContainer,
  MDBInput
}
from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { signIn } from "next-auth/react";

export default function Signin(){
    const [formData, setFormData] = useState({
      "email":"",
      "password":"",
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
        try{
            const res = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password
            });
            if(res.status == 200){
                router.push("/");
            }
            else{
                setError('Email or password is incorrect');
            }
        }
        catch(error){
            console.error(error);
            setError(error);
        }
    }
    return (
        <form onChange={handleChange} onSubmit={handleSubmit}>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
                <MDBInput wrapperClass='mb-4' label='Email address' name="email" type='email' required/>
                <MDBInput wrapperClass='mb-4' label='Password' name="email" type='password' required />
                { error && <Alert variant="danger"> {error} </Alert>}
                <div className="d-flex justify-content-between mx-3 mb-4">
                    <a href="!#">Forgot password?</a>
                </div>
                <Button variant="primary" type="submit">
                        Submit
                </Button>

                <div className="text-center">
                    <p>Not a member? <a href="#!">Register</a></p>
                </div>
            </MDBContainer>
        </form>
    );
}
