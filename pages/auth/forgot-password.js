import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import Head from 'next/head'
import Modal from 'react-bootstrap/Modal';
import global from 'styles/Global.module.scss'


export default function ForgotPassword({userProps}){
    const router = useRouter();
    const [formData, setFormData] = useState({
      "email":""
    });
    const [showEmailPopup, setShowEmailPopup] = useState(false);
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
          email: formData.email,
        }
        axios.post('/api/auth/passwordReset', data)
        .then(function (response) {
          setShowEmailPopup(true);
          setError(null);
        })
        .catch(function (error) {
          setError(error.response.data.error);
        });  
    }   
    const handleCloseEmailPopup = function(event){
      event.preventDefault();
      setShowEmailPopup(false);
    }
    return (
        <>
         <div className={global.container}>
           <Head>
             <title>Forgot Password</title>
             <meta name="description" content="Forgot Password" />
             <link rel="icon" href="#" />
           </Head>
 
           <main className={global.main}>
             <div className='row justify-content-center'>
               <div className="col-lg-6 col-12 p-3">
                    <Form onChange={handleChange} onSubmit={handleSubmit} > 
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" placeholder="email" required />
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
         <Modal show={showEmailPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Sent</Modal.Title>
          </Modal.Header>
          <Modal.Body>Instruction to reset password has been sent to your email!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEmailPopup}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
       </>
    );
}