import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useRouter } from 'next/router';
import {Alert, Button, Form, Col, Row } from 'react-bootstrap';

export default function CreateCoursePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      "teacherFirstName":"",
      "teacherLastName": "",
      "course":""
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
    const handleSubmit = (event) => {
      event.preventDefault();
      const url = "/api/findCourses";
      axios.post(url, formData)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        setError(error.response.data.error);
      }); 
    }
    return(
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>Add Course Page</title>
            <meta name="description" content="student Add Course Page" />
            <link rel="icon" href="#" />
          </Head>
          
     
          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-lg-6 col-12 p-3">
                <Form onChange={handleChange} onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Teacher's First Name</Form.Label>
                                <Form.Control type="text" name="firstName" min="1" max="30" placeholder="Teacher's First Name" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Teacher's Last Name</Form.Label>
                                <Form.Control type="text" name="lastName" min="1" max="30" placeholder="Teacher's Last Name" />
                            </Form.Group>
                        </Col>
                    </Row> 
                    <Form.Group className="mb-3">
                        <Form.Label>Course</Form.Label>
                        <Form.Control type="text" name="course" min="1" max="30" placeholder="Course's name" />
                    </Form.Group>
                  { error && <Alert variant="danger"> {error} </Alert>}
                  <Button variant="primary" type="submit">
                    Search
                  </Button>
                </Form>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
}